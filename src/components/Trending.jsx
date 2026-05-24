import React from 'react'

function Trending({ movies }) {
  if (!movies?.length) return null

  return (
    <section className="trending">
      <h2>Trending Searches</h2>
      <ul>
        {movies.map((doc, index) => (
          <li key={doc.$id}>
            <p>{index + 1}</p>
            {doc.poster_url ? (
              <img src={doc.poster_url} alt={doc.searchTerm} />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Trending
