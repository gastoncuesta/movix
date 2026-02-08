import {images} from "@/constants/images"
import {View, Text, Image, FlatList, ActivityIndicator} from 'react-native'
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import {fetchMovies} from "@/services/api";
import {icons} from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import {useEffect, useState} from "react";
import {updateSearchCount} from "@/services/appWrite";
import {useUser} from "@/services/AppWriteProvider";
import {languages} from "@/constants/data";

const Search = () => {
    const [query, setQuery] = useState("");
    const {language} = useUser();
    const {
        data: movies,
        loading: moviesLoading,
        error: moviesError,
        refetch: loadMovies,
        resetData: resetMovies,
    } = useFetch(() => fetchMovies({
        query,
        language: language|| "en-US"
    }), false)

    useEffect(() => {

        const timeoutId = setTimeout(async () => {

            if (query.trim()) {
                await loadMovies();

            } else {
                resetMovies();
            }
        }, 500)
        return () => clearTimeout(timeoutId);
    }, [query]);

    useEffect(() => {
        if (movies && movies.length > 0 && movies?.[0]) {
            updateSearchCount(query, movies[0])
        }
    }, [movies]);


    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover"/>

            <FlatList
                data={movies}
                renderItem={({item}) => <MovieCard {...item}/>}
                keyExtractor={(item) => item.id.toString()}
                className="px-5"
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: 'center',
                    gap: 16,
                    marginVertical: 16

                }}
                contentContainerStyle={{paddingBottom: 100}}
                ListHeaderComponent={
                    <>
                        <View className="w-full flex-row justify-center mt-20 mb-5 items-center">
                            <Image source={icons.logo} className="w-14 h-12"/>
                        </View>
                        <View className="my-5 ">
                            <SearchBar
                                placeholder="Search movies..."
                                value={query}
                                onChangeText={(text: string) => setQuery(text)}
                            />
                        </View>
                        {moviesLoading && (
                            <ActivityIndicator size="large" color="#0000ff" className="my-3"/>
                        )}
                        {moviesError && (
                            <Text className="text-red-500 px-5 my-3">
                                Error: {moviesError.message}
                            </Text>
                        )}
                        {!moviesLoading && !moviesError && query.trim() && movies && movies?.length > 0 && (
                            <Text className="text-xl text-white font-bold">
                                Search results for {''}
                                <Text className="text-accent">{query}</Text>
                            </Text>
                        )}
                    </>
                }
                ListEmptyComponent={
                    !moviesLoading && !moviesError ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-gray-500">
                                {query.trim() ? 'No movies found' : 'Search for a movie'}
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    )
}
export default Search
