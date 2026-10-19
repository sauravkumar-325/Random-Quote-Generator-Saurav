

const quotes = [
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "Dream big and dare to fail.",
        author: "Norman Vaughan"
    },
    {
        text: "It always seems impossible until it's done.",
        author: "Nelson Mandela"
    },
    {
        text: "Success is the sum of small efforts repeated daily.",
        author: "Robert Collier"
    },
    {
        text: "Do what you can, with what you have, where you are.",
        author: "Theodore Roosevelt"
    }
];

const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const newQuoteButton = document.getElementById("newQuote");
const copyButton = document.getElementById("copyQuote");
const favoriteButton = document.getElementById("favoriteQuote");
const showFavoritesButton = document.getElementById("showFavorites");
const messageElement = document.getElementById("message");
const favoritesSection = document.getElementById("favoritesSection");
const favoritesList = document.getElementById("favoritesList");

let currentQuote = quotes[0];

let favorites = JSON.parse(
    localStorage.getItem("favoriteQuotes") || "[]"
);

function displayQuote(quote) {
    currentQuote = quote;
    quoteElement.textContent = '"' + quote.text + '"';
    authorElement.textContent = "— " + quote.author;
    updateFavoriteButton();
}

function updateFavoriteButton() {
    const isFavorite = favorites.some(
        quote => quote.text === currentQuote.text &&
                 quote.author === currentQuote.author
    );

    favoriteButton.textContent = isFavorite
        ? "♥ Remove from Favorites"
        : "♡ Add to Favorites";
}

function saveFavorites() {
    localStorage.setItem(
        "favoriteQuotes",
        JSON.stringify(favorites)
    );
}

function showMessage(message) {
    messageElement.textContent = message;
}

// New random quote
newQuoteButton.addEventListener("click", function () {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    displayQuote(quotes[randomIndex]);
    showMessage("");
});

// Copy quote
copyButton.addEventListener("click", async function () {
    const text = '"' + currentQuote.text +
                 '" — ' + currentQuote.author;

    try {
        await navigator.clipboard.writeText(text);
        showMessage("Quote copied successfully!");
    } catch (error) {
        showMessage("Copy failed. Please try using Live Server or localhost.");
    }
});

// Add or remove favorite
favoriteButton.addEventListener("click", function () {
    const index = favorites.findIndex(
        quote => quote.text === currentQuote.text &&
                 quote.author === currentQuote.author
    );

    if (index !== -1) {
        favorites.splice(index, 1);
        showMessage("Removed from favorites.");
    } else {
        favorites.push(currentQuote);
        showMessage("Added to favorites!");
    }

    saveFavorites();
    updateFavoriteButton();
    renderFavorites();
});

// Display favorite quotes
function renderFavorites() {
    favoritesList.replaceChildren();

    if (favorites.length === 0) {
        favoritesList.textContent = "No favorite quotes yet.";
        return;
    }

    favorites.forEach(function (quote, index) {
        const item = document.createElement("div");
        item.className = "favorite-item";

        const text = document.createElement("p");
        text.textContent = '"' + quote.text +
                           '" — ' + quote.author;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function () {
            favorites.splice(index, 1);
            saveFavorites();
            renderFavorites();
            updateFavoriteButton();
            showMessage("Favorite removed.");
        });

        item.append(text, removeButton);
        favoritesList.appendChild(item);
    });
}

// Show or hide favorites
showFavoritesButton.addEventListener("click", function () {
    favoritesSection.hidden = !favoritesSection.hidden;

    showFavoritesButton.textContent = favoritesSection.hidden
        ? "View Favorites"
        : "Hide Favorites";

    renderFavorites();
});

// Initial display
displayQuote(currentQuote);
renderFavorites();

