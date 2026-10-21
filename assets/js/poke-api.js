const pokeApi = {}

// Converte os dados retornados pela API
function convertPokeApiDetailToPokemon(pokeDetail) {
    return {
        number: pokeDetail.id,
        name: pokeDetail.name,
        height: pokeDetail.height,
        weight: pokeDetail.weight,

        types: pokeDetail.types.map((typeSlot) => typeSlot.type.name),

        mainType: pokeDetail.types[0].type.name,

        photo:
            pokeDetail.sprites.other?.["official-artwork"]?.front_default ||
            pokeDetail.sprites.front_default
    }
}


// Busca os detalhes de cada Pokémon
pokeApi.getPokemonDetail = (pokemon) => {

    return fetch(pokemon.url)
        .then((response) => {

            if (!response.ok) {
                throw new Error("Erro ao buscar detalhes do Pokémon")
            }

            return response.json()
        })

        .then(convertPokeApiDetailToPokemon)
}


// Busca a lista de Pokémons
pokeApi.getPokemons = (offSet = 0, limit = 10) => {

    // Utilizando o mesmo formato do seu código
    const url =
        `https://pokeapi.co/api/v2/pokemon?offset=${offSet}&limit=${limit}`


    return fetch(url)

        .then((response) => {

            if (!response.ok) {
                throw new Error("Erro ao consumir a PokéAPI")
            }

            return response.json()
        })

        .then((responseBody) => {

            // responseBody.results contém:
            // name
            // url

            const pokemons = responseBody.results

            // Busca os detalhes de todos os Pokémons
            return Promise.all(
                pokemons.map(pokeApi.getPokemonDetail)
            )
        })

        .catch((error) => {

            console.error("Error!", error)

            throw error
        })
}