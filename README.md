# Pokémon Card Display

A simple web application that displays Pokémon cards based on user-selected type and quantity. This app fetches Pokémon data from the [PokéAPI](https://pokeapi.co/) and presents detailed information about each Pokémon in a visually appealing card format.

## Features

- **Select Pokémon Type**: Choose from a dropdown menu to display Pokémon cards of a specific type (e.g., Water, Fire, Grass).
- **Customize Card Count**: Select the number of cards to display, between 1 and 50.
- **Detailed Pokémon Cards**: Each card displays the Pokémon's name, ID, abilities, and official artwork.
- **Responsive Design**: The app is mobile-friendly, automatically adjusting the layout for better accessibility on smaller screens.

## Technologies Used

- HTML, CSS, JavaScript
- [PokéAPI](https://pokeapi.co/) for fetching Pokémon data

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sthita19/pokemon-cards.git
   cd pokemon-cards
   ```

2. **Open in a Browser**:
   Open the `index.html` file in your preferred web browser.

## Usage

1. Select the number of cards and Pokémon type from the dropdown menu.
2. Click **Get Pokémon** to load the Pokémon cards.

## File Structure

```
pokemon-card-display/
├── index.html        # Main HTML file
├── styles.css        # CSS for styling the app
├── script.js         # JavaScript for fetching and displaying Pokémon data
└── README.md         # Project documentation
```

## Screenshots

### Desktop View
![image](https://github.com/user-attachments/assets/45a54265-5b16-488a-82f8-5b8f9aaf5b58)


## How It Works

### User Input

1. Enter the number of Pokémon cards to display.
2. Select the Pokémon type from the dropdown.

### Fetch Data

- On clicking **Get Pokémon**, the app sends a request to the PokéAPI for the selected Pokémon type.
- Pokémon data (e.g., name, ID, abilities) is then fetched for each Pokémon up to the selected quantity.

### Display Pokémon Cards

- Each Pokémon’s details are displayed in a card format with an image, ID, and abilities.

## License

This project is licensed under the MIT License.
