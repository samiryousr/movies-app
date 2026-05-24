import { Client, Databases, Query, ID } from 'appwrite'

const projectId = import.meta.env.VITE_APPWRITE_ID
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID

const isAppwriteConfigured = Boolean(projectId && databaseId && collectionId)

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(projectId)

const databases = new Databases(client)

export const updateSearchCount = async (searchTerm, movie) => {
  if (!isAppwriteConfigured || !searchTerm?.trim() || !movie?.id) return

  try {
    const result = await databases.listDocuments(databaseId, collectionId, [
      Query.equal('searchTerm', searchTerm.trim()),
    ])

    if (result.documents.length > 0) {
      const doc = result.documents[0]
      await databases.updateDocument(databaseId, collectionId, doc.$id, {
        count: doc.count + 1,
      })
    } else {
      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        searchTerm: searchTerm.trim(),
        count: 1,
        movie_id: movie.id,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : '',
      })
    }
  } catch (error) {
    console.warn('Appwrite updateSearchCount:', error.message)
  }
}

export const getTrendingMovies = async () => {
  if (!isAppwriteConfigured) return []

  try {
    const result = await databases.listDocuments(databaseId, collectionId, [
      Query.orderDesc('count'),
      Query.limit(5),
    ])
    return result.documents
  } catch (error) {
    console.warn('Appwrite getTrendingMovies:', error.message)
    return []
  }
}
