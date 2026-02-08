import {
    Alert,
    Image,
    ImageBackground,
    ImageSourcePropType,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import React from 'react'
import {icons} from "@/constants/icons";
import {SafeAreaView} from "react-native-safe-area-context";
import {images} from "@/constants/images";
import {settings} from "@/constants/data";
import {useUser} from "@/services/AppWriteProvider";
import LanguageSelector from "@/components/LanguageSelector";

interface SettingItemsProps {
    icon: ImageSourcePropType;
    title: string;
    onPress?: () => void;
    textStyle?: string;
    showArrow?: boolean;
}

const SettingItem = ({icon, title, onPress, textStyle, showArrow = true}: SettingItemsProps) => (
    <TouchableOpacity onPress={onPress} className="flex flex-row items-center justify-between py-3">
        <View className="flex flex-row items-center gap-3">
            <Image source={icon} className="size-6"/>
            <Text className={`text-lg text-white ${textStyle} `}>{title}</Text>
        </View>
        {showArrow && <Image source={icons.arrow} className="size-5"/>}
    </TouchableOpacity>

)


const Profile = () => {
    const {current: user, logout, login} = useUser();

    const handleLogout = async () => {
        const result = await logout();
        if (result) {
            Alert.alert("Success", "You have been logged out.");
            //await refetch();
        } else {
            Alert.alert("Error", "An error occurred while logging out.");
        }
    };
    const handleLogin = async () => {
        const result = await login();

        if (result) {
            console.log('Login successful');
        } else {
            Alert.alert('Error', 'Login failed.');
        }
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            {user ?
                <Image source={images.bg}
                       className="flex-1 absolute w-full z-0"
                       resizeMode="cover"/> :
                <Image source={images.background}
                       className="flex-1 absolute w-full h-full z-0"
                       resizeMode="cover"/>}

            <ScrollView contentContainerClassName="h-full pb-32 px-7">
                {!user ? (
                    <>
                        <View className="relative px-10">
                            <Text className="text-lg font-thin text-white text-center mt-12">
                                Login with Google
                            </Text>

                            <TouchableOpacity onPress={handleLogin} className="bg-primary shadow-md border border-zinc-400 shadow-zinc-300 rounded-full w-full
                    py-4 mt-5">
                                <View className="flex flex-row items-center justify-center">
                                    <Image source={icons.google}
                                           className="w-5 h-5"
                                           resizeMode="contain"/>
                                    <Text className="text-zinc-400 text-lg font-bold ml-2">Continue with Google</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </>
                ) : (
                    <>
                        <View className="flex flex-row items-center justify-between mt-5">
                            <Text className="text-white text-xl font-bold">
                                Profile
                            </Text>
                            <Image source={icons.bell} className="size-7"/>
                        </View>

                        <View className="flex flex-row justify-center mt-5">
                            <View className="flex flex-col items-center relative mt-5">
                                <Image source={user ? {uri: user.avatar} : images.avatar}
                                       className="size-44 relative rounded-full"/>
                                <TouchableOpacity className="absolute bottom-11 right-2">

                                    <ImageBackground
                                        source={images.highlight}
                                        className="h-10 w-10 justify-center items-center rounded-xl
                                overflow-hidden"
                                    >
                                        <Image source={icons.edit} className="size-7"/>

                                    </ImageBackground>
                                </TouchableOpacity>
                                <Text className="text-white text-2xl font-bold mt-2">{user?.name}</Text>
                            </View>


                        </View>

                        <View className="flex flex-col mt-5 border-t pt-5 ">
                            {settings.map((item, index) => (
                                <SettingItem key={index} {...item} />
                            ))}
                            <LanguageSelector/>
                        </View>

                        <View className="flex flex-col mt-5 border-t pt-5">
                            <SettingItem icon={icons.logout} title="Logout" showArrow={false} onPress={handleLogout}/>
                        </View>

                    </>
                )}


            </ScrollView>
        </SafeAreaView>
    )
}
export default Profile
