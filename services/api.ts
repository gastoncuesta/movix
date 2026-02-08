import ignore from "ignore";
import language from "@/app/settings/language";

export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }

}

export const fetchMovies = async ({query, language}: { query: string, language: string }) => {
    const endpoint = query
        ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=${language}`
        : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&language=${language}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    })
    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to fetch movies', response.statusText);
    }

    const data = await response.json();

    const movies: Movie[] = data.results;
    return query
        ? movies.sort((a, b) => b.popularity - a.popularity)
        : movies.sort((a, b) => Date.parse(b.release_date) - Date.parse(a.release_date));
}

export const fetchMovieDetails = async (movieId: string, language: string): Promise<MovieDetails> => {
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?append_to_response=credits&language=${language}&api_key=${TMDB_CONFIG.API_KEY}`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        });
        if (!response.ok) {
            throw new Error('Failed to fetch movie details');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }

}

export const fetchPeopleDetails = async (castId: string): Promise<CastDetails> => {
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/person/${castId}`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        });
        if (!response.ok) {
            throw new Error('Failed to fetch cast details');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
