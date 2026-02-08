import {View, Text, Image, ScrollView} from 'react-native'
import React from 'react'
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";

const Language = () => {
    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute w-full z-0"/>
            <ScrollView className="flex-1 px-5"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            minHeight: '100%', paddingBottom: 10
                        }}>
                <Image source={icons.logo} className="w-14 h-12 mt-20 mb-5 mx-auto"/>
                <Text className="text-white font-bold text-xl">Language</Text>
            </ScrollView>
        </View>
    )
}
export default Language
