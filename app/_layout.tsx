import {Stack} from "expo-router";
import './globals.css';
import {StatusBar} from "react-native";
import {AppwriteProvider} from "@/services/AppWriteProvider";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();
export default function RootLayout() {
    return (
        <AppwriteProvider>
            <StatusBar hidden={true}/>
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="movies/[id]"
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="cast/[id]"
                    options={{
                        headerShown: false
                    }}
                />
            </Stack>
        </AppwriteProvider>
    );
}
