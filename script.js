function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getPokemonCards() {
    const numCards = parseInt(document.getElementById('num-cards').value);
    const category = document.getElementById('category').value.toLowerCase();
    const pokemonContainer = document.getElementById('pokemon-container');
    pokemonContainer.innerHTML = ''; 

    if (!numCards || numCards < 1 || numCards > 50) {
        alert('Please enter a valid number of cards between 1 and 50.');
        return;
    }

    fetch(`https://pokeapi.co/api/v2/type/${category}`)
        .then(response => {
            if (!response.ok) throw new Error('Invalid category');
            return response.json();
        })
        .then(data => {
            const pokemonList = data.pokemon.slice(0, numCards);

            const pokemonDetailsPromises = pokemonList.map(pokemonItem =>
                fetch(pokemonItem.pokemon.url).then(response => response.json())
            );

            Promise.all(pokemonDetailsPromises)
                .then(detailedPokemonData => {
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
        })
        .catch(error => {
            console.error('Error fetching type data:', error);
            alert('Could not fetch data. Check the category and try again.');
        });
}
