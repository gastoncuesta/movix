import {Account, Avatars, Client, ID, OAuthProvider, Query, TablesDB} from "react-native-appwrite";
import * as Linking from 'expo-linking';
import {openAuthSessionAsync} from "expo-web-browser";
import {Buffer} from "buffer";

export const config = {
    platform: 'com.gastoncuesta.movix',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DB_ID!,
    collectionMetricsId: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_METRICS_ID!,
    collectionSavedId: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_SAVED_ID!
}

const client = new Client()
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setPlatform(config.platform!)

export const avatar = new Avatars(client);
export const account = new Account(client);


export async function login() {
    try {
        const redirectUri = Linking.createURL("");

        const authUrl = account.createOAuth2Token({ //Should include await?
            provider: OAuthProvider.Google,
            success: redirectUri,
            failure: redirectUri
        })

        if (!authUrl) {
            throw new Error("Failed to login")
        }

        const browserResult = await openAuthSessionAsync(
            authUrl.toString(),
            redirectUri
        )

        if (browserResult.type != 'success') throw new Error("Failed to login")

        const url = new URL(browserResult.url)
        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        if (!userId || !secret) throw new Error("Failed to login")


        const session = await account.createSession({userId, secret});

        if (!session) throw new Error("Failed to login")

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function logout() {
    try {
        await account.deleteSession({sessionId: 'current'});
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function getAvatarUri(userAvatar: ArrayBuffer) {
    const b64 = Buffer.from(new Uint8Array(userAvatar)).toString("base64");
    return `data:image/png;base64,${b64}`;
}

export async function getCurrentUser() {

    try {
        const response = await account.get();

        if (response.$id) {
            const userAvatar = await avatar.getInitials({name: response.name})
            const avatarUri = getAvatarUri(userAvatar);
            return {
                ...response,
                avatar: avatarUri
            }
        }
    } catch (error) {
        console.error("ERROR: " + error);
        return null;
    }
}

const database = new TablesDB(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {

        const promise = database.listRows({
            databaseId: config.databaseId,
            tableId: config.collectionMetricsId,
            queries: [Query.equal('searchTerm', query)]
        });

        promise.then(async result => {
            if (result.rows.length > 0) {
                const existingMovie = result.rows[0];
                await database.updateRow({
                    databaseId: config.databaseId,
                    tableId: config.collectionMetricsId,
                    rowId: existingMovie.$id,
                    data: {
                        count: existingMovie.count + 1,
                    }
                }).then(result => console.log(`Movie ${movie.title} was updated successfully`))
            } else {
                await database.createRow({
                    databaseId: config.databaseId,
                    tableId: config.collectionMetricsId,
                    rowId: ID.unique(),
                    data: {
                        searchTerm: query,
                        movie_id: movie.id,
                        title: movie.title,
                        count: 1,
                        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                    }
                }).then(result => console.log(`Movie ${movie.title} was created successfully`))
            }
        }, error => {
            console.log(error);
        });

    } catch (error) {
        console.log(error);
        throw error;
    }

}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const promise = await database.listRows({
            databaseId: config.databaseId,
            tableId: config.collectionMetricsId,
            queries: [
                Query.limit(5),
                Query.orderDesc('count'),
            ]
        });
        return promise.rows as unknown as TrendingMovie[]
    } catch (error) {
        console.error(error);
        return undefined;
    }
}


export const updateSavedMovies = async (userId: string, {
    movie_id,
    poster_url,
    title,
    vote_average,
    vote_count,
    release_date
}: SavedMovie): Promise<boolean> => {
    try {

        const promise = database.listRows({
            databaseId: config.databaseId,
            tableId: config.collectionSavedId,
            queries: [
                Query.equal('user_id', userId!),
                Query.equal('movie_id', movie_id),
            ]
        });

        promise.then(async result => {
            if (result.rows.length > 0) {
                const existingMovie = result.rows[0];
                await database.deleteRow({
                    databaseId: config.databaseId,
                    tableId: config.collectionSavedId,
                    rowId: existingMovie.$id
                })
                return false;
            } else {
                await database.createRow({
                    databaseId: config.databaseId,
                    tableId: config.collectionSavedId,
                    rowId: ID.unique(),
                    data: {
                        user_id: userId,
                        movie_id,
                        title: title,
                        poster_url: `https://image.tmdb.org/t/p/w500/${poster_url}`,
                        vote_average: vote_average.toString(),
                        vote_count: vote_count.toString(),
                        release_date
                    }
                })
                return true;
            }
        }, error => {
            console.log(error);
        });

    } catch (error) {
        console.log(error);
        throw error;
    }
    return false;

}

export const getSavedMovies = async (userId: string | undefined): Promise<SavedMovie[] | undefined> => {
    try {
        const promise = await database.listRows({
            databaseId: config.databaseId,
            tableId: config.collectionSavedId,
            queries: [
                Query.equal('user_id', userId!),
                Query.orderDesc('$createdAt'),
            ]
        });
        return promise.rows as unknown as SavedMovie[]
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getSavedMovie = async (userId: string, movieId: string): Promise<boolean> => {
    if (userId && movieId) {
        try {
            const promise = await database.listRows({
                databaseId: config.databaseId,
                tableId: config.collectionSavedId,
                queries: [
                    Query.equal('user_id', userId!),
                    Query.equal('movie_id', movieId),
                ]
            });
            return promise.rows.length > 0;
        } catch (error) {
            console.error("SAVED MOVIE ERROR: " + error);
            return false;
        }
    }
    return false;

}