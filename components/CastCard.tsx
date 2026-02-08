import {View, Text, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import {Link} from "expo-router";
import MaskedView from "@react-native-masked-view/masked-view";
import {images} from "@/constants/images";

const CastCard = ({name, character, profile_path, id }: Cast) => {

    return (
        <Link href={`/cast/${id}`} asChild>
            <TouchableOpacity className="w-32 relative pl-5">
                <Image
                    source={{uri: `https://image.tmdb.org/t/p/w500/${profile_path}`}}
                    className="w-32 h-32 rounded-full"
                    resizeMode="cover"
                />
                <Text className="font-bold text-base mt-2 text-white" numberOfLines={2}>
                    {name}
                </Text>
                <Text className="font-light text-sm mt-2 text-light-200" numberOfLines={2}>
                    {character}
                </Text>

            </TouchableOpacity>
        </Link>
    )
}
export default CastCard
