import React, { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import Trending from './components/Trending.jsx'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite.js'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [movies, setMovies] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useDebounce(
    () => {
      setDebouncedSearch(searchTerm.trim())
      setCurrentPage(1)
    },
    500,
    [searchTerm]
  )

  useEffect(() => {
    getTrendingMovies().then(setTrendingMovies)
  }, [])

  useEffect(() => {
    if (!API_KEY) {
      setErrorMessage('Missing VITE_TMDB_API_KEY in .env.local')
      setLoading(false)
      return
    }

    const controller = new AbortController()

    const fetchMovies = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const query = debouncedSearch
        const endpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${currentPage}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${currentPage}`

        const response = await fetch(endpoint, {
          ...API_OPTIONS,
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`TMDB request failed (${response.status})`)
        }

        const data = await response.json()

        if (!data.results?.length) {
          setMovies([])
          setTotalPages(1)
          if (query) setErrorMessage('No movies found')
          return
        }

        setMovies(data.results)
        setTotalPages(Math.max(1, data.total_pages ?? 1))

        if (query) {
          await updateSearchCount(query, data.results[0])
          const trending = await getTrendingMovies()
          setTrendingMovies(trending)
        }
      } catch (error) {
        if (error.name === 'AbortError') return
        console.error(error)
        setErrorMessage(
          'An error occurred while fetching movies. Please try again later.'
        )
        setMovies([])
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
    return () => controller.abort()
  }, [debouncedSearch, currentPage])

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="/hero.png" alt="Movies" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <Trending movies={trendingMovies} />

          <section className="all-movies">
            <h2>{debouncedSearch ? 'Search Results' : 'All Movies'}</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : errorMessage ? (
              <p className="text-light-200 text-center">{errorMessage}</p>
            ) : (
              <ul>
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>

          {!loading && !errorMessage && movies.length > 0 && (
            <div className="flex gap-4 justify-center items-center my-6">
              <button
                type="button"
                className="w-10 h-10 bg-blue-500 text-white rounded disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              <span className="text-white">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                className="w-10 h-10 bg-blue-500 text-white rounded disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default App
