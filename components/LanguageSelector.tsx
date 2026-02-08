import React, {useMemo, useState} from "react";
import {Image, Modal, Pressable, Text, TouchableOpacity, View} from "react-native";
import {Picker} from "@react-native-picker/picker";
import * as Localization from "expo-localization";
import {icons} from "@/constants/icons";
import {useUser} from "@/services/AppWriteProvider";
import {languages} from "@/constants/data";

const DEFAULT_LANGUAGE = "en-US"
function getDeviceLang(): string {
    return Localization.getLocales()?.[0]?.languageTag ?? DEFAULT_LANGUAGE;
}

export default function LanguageSelector() {
    const deviceLang = useMemo(getDeviceLang, []);
    const {setLanguage} = useUser();

    const initial = languages.some(l => l.code === deviceLang) ? deviceLang : DEFAULT_LANGUAGE;

    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState<string>(initial);

    const currentLabel = languages.find(l => l.code === lang)?.name ?? lang;

    return (
        <View>
            <TouchableOpacity
                className="flex flex-row items-center justify-between py-3"
                onPress={() => setOpen(true)}
            >
                <View className="flex flex-row items-center gap-3">
                    <Image source={icons.language} className="size-6"/>
                    <Text className="text-white text-lg">Language: {currentLabel}</Text>
                </View>
                <Image source={icons.arrow} className="size-5"/>
            </TouchableOpacity>

            <Modal visible={open} transparent animationType="fade">
                <TouchableOpacity
                    onPress={() => setOpen(false)}
                    className="flex-1 bg-black/50 justify-end">
                    <Pressable
                        onPress={() => {
                        }}
                        className="bg-white rounded-t-2xl p-4"
                    >
                        <Text className="text-lg font-semibold mb-2">
                            Select language
                        </Text>

                        <Picker
                            selectedValue={lang}
                            onValueChange={(value) => {
                                setLang(value)
                                setLanguage(value)
                            }}
                        >
                            {languages.map((l) => (
                                <Picker.Item key={l.code} label={l.name} value={l.code}/>
                            ))}
                        </Picker>

                        <Pressable
                            onPress={() => setOpen(false)}
                            className="mt-4 bg-primary py-3 rounded-xl">
                            <Text className="text-white text-center font-semibold">Done</Text>
                        </Pressable>
                    </Pressable>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}