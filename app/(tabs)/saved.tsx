import {FlatList, Image, View} from 'react-native'
import React, {useCallback} from 'react'
import {images} from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import {getSavedMovies} from "@/services/appWrite";
import {useUser} from "@/services/AppWriteProvider";
import {useFocusEffect} from "expo-router";

const Saved = () => {
    const {current: user} = useUser();

    const {
        data: savedMovies,
        loading: savedLoading,
        error: savedError,
        refetch: saveMoviesRefetch,
    } = useFetch(() => getSavedMovies(user?.$id))

    useFocusEffect(
        useCallback(() => {
            // cuando entrás a este tab/screen
            if (user?.$id) {
                saveMoviesRefetch();
            }
        }, [user?.$id, saveMoviesRefetch])
    );

    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover"/>
            <FlatList
                data={savedMovies}
                renderItem={({item}) => <MovieCard
                    id={Number.parseInt(item.movie_id)}
                    title={item.title}
                    poster_path={item.poster_url}
                    vote_average={item.vote_average}
                    vote_count={item.vote_count} adult={false} backdrop_path={""} genre_ids={[]} original_language={""}
                    original_title={""} overview={""} popularity={0} release_date={item.release_date} video={false}
                />}
                keyExtractor={(item) => item.movie_id.toString()}
                className="px-5 mt-20 mb-5"
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: 'flex-start',
                    gap: 16,
                    marginVertical: 16

                }}
                contentContainerStyle={{paddingBottom: 100}}

            />
        </View>
    )
}
export default Saved
