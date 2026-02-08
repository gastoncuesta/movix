import React, {useMemo, useState} from "react";
import {Modal, Pressable, Text, View} from "react-native";
import {Picker} from "@react-native-picker/picker";
import * as Localization from "expo-localization";

type Lang = { code: string; label: string };

const LANGUAGES: Lang[] = [
    {code: "en", label: "English"},
    {code: "es", label: "Español"},
    {code: "da", label: "Dansk"},
    {code: "fr", label: "Français"},
    {code: "de", label: "Deutsch"},
    {code: "it", label: "Italiano"},
    {code: "pt", label: "Português"},
    // agregá los que uses
];

function getDeviceLang(): string {
    // ej: "es-AR" -> "es"
    const device = Localization.getLocales()?.[0]?.languageCode ?? "en";
    return device;
}

export default function LanguageSelector() {
    const deviceLang = useMemo(getDeviceLang, []);
    const initial = LANGUAGES.some(l => l.code === deviceLang) ? deviceLang : "en";

    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState<string>(initial);

    const currentLabel = LANGUAGES.find(l => l.code === lang)?.label ?? lang;

    return (
        <View>
            <Pressable
                onPress = {()
=>
    setOpen(true)
}
    style = {
    {
        padding: 12, borderRadius
    :
        10, backgroundColor
    :
        "#222"
    }
}
>
    <Text style = {
    {
        color: "white"
    }
}>
    Language: {
        currentLabel
    }
    </Text>
    < /Pressable>

    < Modal
    visible = {open}
    transparent
    animationType = "fade" >
    <Pressable
        onPress = {()
=>
    setOpen(false)
}
    style = {
    {
        flex: 1, backgroundColor
    :
        "rgba(0,0,0,0.5)", justifyContent
    :
        "flex-end"
    }
}
>
    <Pressable
        onPress = {()
=>
    {
    }
}
    style = {
    {
        backgroundColor: "white", padding
    :
        16, borderTopLeftRadius
    :
        16, borderTopRightRadius
    :
        16
    }
}
>
    <Text style = {
    {
        fontSize: 16, fontWeight
    :
        "600", marginBottom
    :
        8
    }
}>
    Select
    language
    < /Text>

    < Picker
    selectedValue = {lang}
    onValueChange = {(value)
=>
    setLang(value)
}
>
    {
        LANGUAGES.map((l) => (
            <Picker.Item key = {l.code}
        label = {l.label}
        value = {l.code}
        />
    ))
    }
    </Picker>

    < Pressable
    onPress = {()
=>
    setOpen(false)
}
    style = {
    {
        marginTop: 12, padding
    :
        12, borderRadius
    :
        10, backgroundColor
    :
        "#222"
    }
}
>
    <Text style = {
    {
        color: "white", textAlign
    :
        "center"
    }
}>
    Done < /Text>
    < /Pressable>
    < /Pressable>
    < /Pressable>
    < /Modal>
    < /View>
)
    ;
}