const pokemonList = document.getElementById("pokemonList")
const loadMoreButton = document.getElementById("loadMoreButton")

const limit = 10

let offSet = 0

let selectedPokemon = null


// Converte um Pokémon para HTML
function convertPokemonToLi(pokemon) {

    return `
        <li
            class="pokemon-thumbnail ${pokemon.mainType}"
            data-pokemon-id="${pokemon.number}"
            tabindex="0"
            role="button"
            aria-label="Abrir detalhes de ${pokemon.name}"
        >

            <img
                src="${pokemon.photo}"
                alt="${pokemon.name}"
                loading="lazy"
            >

            <span class="pokemon-thumbnail-name">
                ${pokemon.name}
            </span>

        </li>
    `
}


// Carrega os Pokémons
function loadPokemonItems(offSet, limit) {

    pokeApi.getPokemons(offSet, limit)

        .then((pokemons = []) => {

            const newHtml = pokemons
                .map(convertPokemonToLi)
                .join("")

            pokemonList.innerHTML += newHtml


            // Guarda os dados no próprio elemento
            pokemons.forEach((pokemon) => {

                const pokemonElement =
                    document.querySelector(
                        `[data-pokemon-id="${pokemon.number}"]`
                    )

                if (pokemonElement) {

                    pokemonElement.pokemonData = pokemon

                    addPokemonEvent(pokemonElement)
                }
            })
        })

        .catch((error) => {

            console.error(
                "Não foi possível carregar os Pokémons:",
                error
            )
        })
}


// Adiciona eventos nas miniaturas
function addPokemonEvent(element) {

    element.addEventListener("click", () => {

        openPokemonCard(element.pokemonData)
    })


    // Permite abrir usando Enter
    element.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault()

            openPokemonCard(element.pokemonData)
        }
    })
}


// Abre o card maior
function openPokemonCard(pokemon) {

    selectedPokemon = pokemon

    const existingCard =
        document.getElementById("pokemonCardOverlay")


    // Remove um card existente antes de abrir outro
    if (existingCard) {

        existingCard.remove()
    }


    // Clareia as miniaturas
    pokemonList.classList.add("card-open")


    const typesHtml = pokemon.types
        .map(
            (type) => `
                <span class="pokemon-type ${type}">
                    ${type}
                </span>
            `
        )
        .join("")


    const cardHtml = `

        <div
            id="pokemonCardOverlay"
            class="pokemon-card-overlay"
        >

            <article
                class="pokemon-card ${pokemon.mainType}"
            >

                <button
                    id="closePokemonCard"
                    class="close-card"
                    type="button"
                    aria-label="Fechar detalhes"
                >
                    ×
                </button>


                <span class="pokemon-number">
                    #${String(pokemon.number).padStart(3, "0")}
                </span>


                <img
                    class="pokemon-card-image"
                    src="${pokemon.photo}"
                    alt="${pokemon.name}"
                >


                <h2>
                    ${pokemon.name}
                </h2>


                <div class="pokemon-types">
                    ${typesHtml}
                </div>


                <div class="pokemon-information">

                    <div class="pokemon-info-item">

                        <span>
                            Altura
                        </span>

                        <strong>
                            ${formatHeight(pokemon.height)}
                        </strong>

                    </div>


                    <div class="pokemon-info-item">

                        <span>
                            Peso
                        </span>

                        <strong>
                            ${formatWeight(pokemon.weight)}
                        </strong>

                    </div>

                </div>

            </article>

        </div>
    `


    document.body.insertAdjacentHTML(
        "beforeend",
        cardHtml
    )


    const overlay =
        document.getElementById(
            "pokemonCardOverlay"
        )


    const closeButton =
        document.getElementById(
            "closePokemonCard"
        )


    closeButton.addEventListener(
        "click",
        closePokemonCard
    )


    // Fecha ao clicar fora do card
    overlay.addEventListener(
        "click",
        (event) => {

            if (event.target === overlay) {

                closePokemonCard()
            }
        }
    )
}


// Fecha o card
function closePokemonCard() {

    const card =
        document.getElementById(
            "pokemonCardOverlay"
        )


    if (card) {

        card.classList.add("closing")


        setTimeout(() => {

            card.remove()

        }, 180)
    }


    pokemonList.classList.remove("card-open")

    selectedPokemon = null
}


// Formata altura
function formatHeight(height) {

    // A PokéAPI trabalha em decímetros
    return `${(height / 10).toFixed(1)} m`
}


// Formata peso
function formatWeight(weight) {

    // A PokéAPI trabalha em hectogramas
    return `${(weight / 10).toFixed(1)} kg`
}


// Fecha com ESC
document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            selectedPokemon
        ) {

            closePokemonCard()
        }
    }
)


// Botão "Load More"
loadMoreButton.addEventListener(
    "click",
    () => {

        offSet += limit

        loadPokemonItems(
            offSet,
            limit
        )
    }
)


// Primeira execução
loadPokemonItems(
    offSet,
    limit
)