import React from 'react'

function Search({ searchTerm, setSearchTerm }) {
  return (
    <div className="search">
      <div>
        <img className=" m-0" src="search.svg" alt="search" />
        <input
          type="text"
          placeholder="search for movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Search
