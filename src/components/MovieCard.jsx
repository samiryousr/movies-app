import React from 'react'

function MovieCard({
  movie: { title, poster_path, release_date, original_language, vote_average },
}) {
  return (
    <div className="movie-card">
      <img
        className=" cursor-pointer"
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : '/logo.svg'
        }
        alt={title}
      />
      <p className=" hover:text-gray-100 transition-all duration-300 cursor-pointer mt-2 text-white text-2xl font-bold">
        {title}
      </p>
      <div className="content">
        <div className="rating">
          <img src="/star.svg" alt="" />
          <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          <span>•</span>
          <p>{original_language}</p>
          <span>•</span>
          <p>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
