import * as Linking from "expo-linking";
import {Href, router} from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {Platform} from "react-native";
import {Models, OAuthProvider} from "react-native-appwrite";
import {account, avatar} from "@/services/appWrite";
import {Buffer} from "buffer";

interface User extends Models.User {
    avatar: string;
}

const UserContext = createContext<{
    current: User | null;
    login: () => Promise<boolean>;
    logout: () => Promise<boolean>;
    setLanguage: Dispatch<SetStateAction<string | undefined>>;
    language: string | undefined;
}>({
    current: null,
    login: async () => false,
    logout: async () => false,
    language: undefined,
    setLanguage: () => {}
});

export function useUser() {
    return useContext(UserContext);
}

export function AppwriteProvider(props: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [language, setLanguage] = useState<string | undefined>("en");

    async function login(redirectPath: string = "") {

        try {
            const redirectUri = Linking.createURL(redirectPath);

            const response = account.createOAuth2Token({
                provider: OAuthProvider.Google,
                success: redirectUri,
                failure: redirectUri
            });

            if (!response) {
                console.error("No OAuth URL returned from Appwrite");
                return false;
            }

            const result = await WebBrowser.openAuthSessionAsync(
                response.toString(),
                redirectUri
            );

            if (result.type === "success" && result.url) {
                const url = new URL(result.url);

                const secret = url.searchParams.get("secret")?.toString();
                const userId = url.searchParams.get("userId")?.toString();

                if (!userId || !secret) throw new Error("Failed to login")

                await account.createSession({userId, secret});
                const user = await account.get();

                if (Platform.OS === "ios") {
                    router.replace(redirectPath as Href);
                }

                const userAvatar = await avatar.getInitials({name: user.name})
                const avatarUri = getAvatarUri(userAvatar);


                setUser({
                    ...user,
                    avatar: avatarUri
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error("OAuth error:", error);
            return false;
        }
    }

    async function logout() {
        await account.deleteSession({sessionId: "current"});
        setUser(null);
        return true;
    }

    function getAvatarUri(userAvatar: ArrayBuffer) {
        const b64 = Buffer.from(new Uint8Array(userAvatar)).toString("base64");
        return `data:image/png;base64,${b64}`;
    }

    async function init() {
        try {
            const loggedIn = await account.get();
            const userAvatar = await avatar.getInitials({name: loggedIn.name})
            const avatarUri = getAvatarUri(userAvatar);
            setUser({
                ...loggedIn,
                avatar: avatarUri
            });
        } catch (err) {
            setUser(null);
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <UserContext.Provider value={{current: user, login, logout, language, setLanguage}}>
            {props.children}
        </UserContext.Provider>
    );
}
