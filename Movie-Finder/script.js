// API Setup
const API_URL = 'https://www.omdbapi.com/?apikey=trilogy&s=';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const results = document.getElementById('results');
const loading = document.getElementById('loading');

// Search Movies
async function searchMovies(query) {
    loading.classList.remove('hidden');
    results.innerHTML = '';
    
    try {
        const response = await fetch(API_URL + query);
        const data = await response.json();
        
        loading.classList.add('hidden');
        
        if (data.Search) {
            showMovies(data.Search);
        } else {
            results.innerHTML = '<p class="no-results">No movies found!</p>';
        }
    } catch (error) {
        loading.classList.add('hidden');
        results.innerHTML = '<p class="no-results">Error loading movies!</p>';
    }
}

// Display Movies
function showMovies(movies) {
    results.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="showDetails('${movie.imdbID}')">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x400?text=No+Image'}" 
                 alt="${movie.Title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-year">${movie.Year}</p>
                <span class="movie-rating">🎬 ${movie.Type}</span>
            </div>
        </div>
    `).join('');
}

// Show Movie Details
async function showDetails(id) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=trilogy&i=${id}`);
        const movie = await response.json();
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>${movie.Title} (${movie.Year})</h2>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Actors:</strong> ${movie.Actors}</p>
                <p><strong>Rating:</strong> ${movie.imdbRating}/10 ⭐</p>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.onclick = (e) => e.target === modal && modal.remove();
        
    } catch (error) {
        alert('Error loading movie details!');
    }
}

// Event Listeners
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) searchMovies(query);
});

// Load initial movies
searchMovies('avengers');