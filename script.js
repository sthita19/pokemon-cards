function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

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
    const pokemonContainer = document.getElementById('pokemon-container');
    pokemonList = shuffleArray(pokemonList).slice(0, numCards);
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
                card.addEventListener('click', () => displayEvolutionChain(pokemonData.species.url));
                pokemonContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching Pokémon details:', error));
}

function displayEvolutionChain(speciesUrl) {
    fetch(speciesUrl)
        .then(response => response.json())
        .then(speciesData => fetch(speciesData.evolution_chain.url))
        .then(response => response.json())
        .then(evolutionData => {
            const evolutionContainer = document.getElementById('evolution-container');
            evolutionContainer.innerHTML = ''; 

            let currentStage = evolutionData.chain;
            const evolutionPromises = [];

            
            while (currentStage) {
                evolutionPromises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${currentStage.species.name}`).then(response => response.json()));
                currentStage = currentStage.evolves_to[0];
            }

            Promise.all(evolutionPromises)
                .then(evolutionDetails => {
                    evolutionDetails.forEach(pokemonData => {
                        const card = document.createElement('div');
                        card.className = 'pokemon-card';
                        card.innerHTML = `
                            <h3>${pokemonData.name.toUpperCase()}</h3>
                            <img src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
                            <p>ID: ${pokemonData.id}</p>
                            <p>Abilities: ${pokemonData.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)).join(', ')}</p>
                        `;
                        evolutionContainer.appendChild(card);
                    });
                    
                    // Show modal after loading evolution cards
                    document.getElementById('evolution-modal').style.display = 'flex';
                })
                .catch(error => console.error('Error fetching evolution details:', error));
        })
        .catch(error => console.error('Error fetching evolution chain:', error));
}

// Close modal when 'x' is clicked
document.getElementById('close-modal').onclick = function() {
    document.getElementById('evolution-modal').style.display = 'none';
}

// Close modal when clicking outside the modal content
window.onclick = function(event) {
    const modal = document.getElementById('evolution-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
