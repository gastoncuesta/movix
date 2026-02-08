import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {icons} from "@/constants/icons";
import {router, useLocalSearchParams} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchPeopleDetails} from "@/services/api";

interface CastInfoProps {
    label: string,
    value?: string | number | null;
}

const CastInfo = ({label, value}: CastInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-sm">{label}</Text>
        <Text className="text-light-100 font-bold text-sm mt-2">{value || 'N/A'}</Text>
    </View>
)
const Cast = () => {
    const {id} = useLocalSearchParams();
    const {data: cast, loading} = useFetch(() => fetchPeopleDetails(id as string));

    return (
        <View className="bg-primary flex-1">
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 80
                }}>
                <View>
                    <Image
                        className="w-full h-[500px]"
                        resizeMode="cover"
                        source={{uri: `https://image.tmdb.org/t/p/w500/${cast?.profile_path}`}}
                    />
                </View>


                <View className="flex-col items-start justify-center mt-5 px-5">
                    <Text className="text-white text-xl font-bold">{cast?.name}</Text>

                    <View className="flex-col justify-center gap-x-1 mt-2">
                        <Text className="text-light-200 text-sm">Birthday: {cast?.birthday}</Text>
                        <Text className="text-light-200 text-sm">Place of birth: {cast?.place_of_birth}</Text>
                        <Text className="text-light-200 text-sm">{cast?.deathday && `Deathday: ${cast?.deathday}`}</Text>
                    </View>

                    {/*{casting() && (
                        <View className="mt-5 flex-row">
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    gap: 1
                                }}
                                ItemSeparatorComponent={() => <View className="w-3"/>}
                                data={casting()}
                                renderItem={({item}) => (
                                    <CastCard {...item}/>
                                )}
                                keyExtractor={(item) => item.cast_id.toString()}
                            />
                        </View>
                    )}*/}


                    <CastInfo label="Biography" value={cast?.biography}/>


                </View>

                <TouchableOpacity
                    onPress={router.back}
                    className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50">
                    <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff"/>
                    <Text className="text-white font-semibold text-base">Go Back</Text>
                </TouchableOpacity>



            </ScrollView>
        </View>
    )
}
export default Cast
