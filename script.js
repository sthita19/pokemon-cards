function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Move shuffleArray here so it can be used in displayPokemonCards
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getPokemonCards() {
    const numCards = parseInt(document.getElementById('num-cards').value);
    const category = document.getElementById('category').value.toLowerCase();
    const secondaryCategory = document.getElementById('secondary-category').value.toLowerCase();
    const pokemonContainer = document.getElementById('pokemon-container');
    pokemonContainer.innerHTML = '';

    if (!numCards || numCards < 1 || numCards > 50) {
        alert('Please enter a valid number of cards between 1 and 50.');
        return;
    }

    if (!category) {
        alert('Please select at least one Pokémon type.');
        return;
    }

    fetch(`https://pokeapi.co/api/v2/type/${category}`)
        .then(response => {
            if (!response.ok) throw new Error('Invalid category');
            return response.json();
        })
        .then(data => {
            let pokemonList = data.pokemon;

            if (secondaryCategory) {
                fetch(`https://pokeapi.co/api/v2/type/${secondaryCategory}`)
                    .then(response => {
                        if (!response.ok) throw new Error('Invalid secondary category');
                        return response.json();
                    })
                    .then(secondaryData => {
                        const secondaryPokemonList = secondaryData.pokemon.map(p => p.pokemon.name);
                        pokemonList = pokemonList.filter(pokemon => 
                            secondaryPokemonList.includes(pokemon.pokemon.name)
                        );
                        displayPokemonCards(pokemonList, numCards);
                    })
                    .catch(error => console.error('Error fetching secondary type data:', error));
            } else {
                displayPokemonCards(pokemonList, numCards);
            }
        })
        .catch(error => {
            console.error('Error fetching type data:', error);
            alert('Could not fetch data. Check the category and try again.');
        });
}

function displayPokemonCards(pokemonList, numCards) {
    pokemonList = shuffleArray(pokemonList).slice(0, numCards);
    const pokemonDetailsPromises = pokemonList.map(pokemonItem =>
        fetch(pokemonItem.pokemon.url).then(response => response.json())
    );

    Promise.all(pokemonDetailsPromises)
        .then(detailedPokemonData => {
            const pokemonContainer = document.getElementById('pokemon-container');
            detailedPokemonData.forEach(pokemonData => {
                const card = document.createElement('div');
                card.className = 'pokemon-card';
                card.innerHTML = `
                    <h3>${pokemonData.name.toUpperCase()}</h3>
                    <img src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
                    <p>ID: ${pokemonData.id}</p>
                    <p>Abilities: ${pokemonData.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)).join(', ')}</p>
                `;
                pokemonContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching Pokémon details:', error));
}
