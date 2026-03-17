import React, { useEffect, useState } from 'react'
import './index.css'

const Pokemon = () => {

    const API = "https://pokeapi.co/api/v2/pokemon?limit=24"

    const [pokemon, setPokemon] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState("")

    const fetchPokemon = async () => {
        try {
            const res = await fetch(API)
            const data = await res.json()

            const detailedPokemon = data.results.map(async (currPokemon) => {
                const res = await fetch(currPokemon.url)
                const data = await res.json()
                return data
            })

            const detailedResponses = await Promise.all(detailedPokemon)

            setPokemon(detailedResponses)
            setLoading(false)

        } catch (error) {
            setError(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPokemon()
    }, [])

    // ✅ FIXED FILTER
    const searchData = pokemon.filter((curPokemon) =>
        curPokemon.name.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return <h1 className="status">Loading...</h1>
    }

    if (error) {
        return <h1 className="status">{error.message}</h1>
    }

    return (
        <div className='container'>

            <h1 className='title'>Pokédex</h1>

            <div className='pokemon-search'>
                <input
                    type="text"
                    placeholder='Search Pokémon...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className='card-grid'>

                {searchData.map((currElem) => {

                    return (
                        <div key={currElem.id} className='card'>

                            <img
                                src={
                                    currElem.sprites.other.dream_world.front_default ||
                                    currElem.sprites.front_default
                                }
                                alt={currElem.name}
                                className='pokemon-img'
                            />

                            <h2 className='pokemon-name'>
                                {currElem.name}
                            </h2>

                            <p className='pokemon-type'>
                                {currElem.types[0].type.name}
                            </p>

                            <div className='stats'>
                                <span>HP: {currElem.stats[0].base_stat}</span>
                                <span>ATTACK: {currElem.stats[1].base_stat}</span>
                                <span>SPEED: {currElem.stats[5].base_stat}</span>
                            </div>

                        </div>
                    )
                })}

            </div>

        </div>
    )
}

export default Pokemon