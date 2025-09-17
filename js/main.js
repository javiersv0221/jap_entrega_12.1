document.addEventListener('DOMContentLoaded', async function () {
    const API_URL = "https://japceibal.github.io/japflix_api/movies-data.json";
    const inputBuscar = document.getElementById('inputBuscar');
    const btnBuscar = document.getElementById('btnBuscar');
    const lista = document.getElementById('lista');

    // Inicializar con parámetro de búsqueda de la URL
    const urlParams = new URLSearchParams(window.location.search);

    async function getMoviesList() {
        try {
            const response = await fetch(API_URL);
            return await response.json();
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            return null;
        }
    }

    function getSearchQuery() {
        const searchParam = urlParams.get('search');
        if (searchParam) return searchParam.trim().toLowerCase();
        return inputBuscar.value.trim().toLowerCase();
    }

    function updateSearchParam(query) {
        const url = new URL(window.location);
        if (query) {
            url.searchParams.set('search', query);
        } else {
            url.searchParams.delete('search');
        }

        // Reemplaza la URL en la barra del navegador sin recargar y sin agregar el cambio al historial.
        window.history.replaceState({}, '', url);
    }

    function filterMovies(movies) {
        const query = getSearchQuery();
        if (!query) return movies;
        return movies.filter(movie => {
            const matchTitle = movie.title.toLowerCase().includes(query);
            const matchTagline = movie.tagline && movie.tagline.toLowerCase().includes(query);
            const matchOverview = movie.overview && movie.overview.toLowerCase().includes(query);
            const matchGenres = movie.genres && movie.genres.some(genre => genre.name.toLowerCase().includes(query));
            return matchTitle || matchTagline || matchOverview || matchGenres;
        });
    }

    function displayMovies(movies) {
        lista.innerHTML = '';
        movies.forEach(movie => {
            const movieTitle = movie.title;
            const movieTagline = movie.tagline;
            const voteAverage = movie.vote_average;
            const starsGold = Math.floor(voteAverage / 2);
            const starsWhite = 5 - starsGold;

            const listItem = document.createElement('li');
            listItem.className = 'list-group-item bg-dark text-white mb-2';
            listItem.innerHTML = `
               <div class="d-flex justify-content-between align-items-start flex-wrap">
                    <div class="flex-grow-1 me-3">
                        <h5 class="fw-bold mb-2 text-white">${movieTitle}</h5>
                        <p class="text-muted mb-1 fst-italic">${movieTagline ?? 'No hay descripción disponible'}</p>
                    </div>
                    <div class="text-end">
                        ${'<span class="fa fa-star checked"></span>'.repeat(starsGold)}${'<span class="fa fa-star"></span>'.repeat(starsWhite)}
                    </div>
                </div>
            `;

            listItem.addEventListener('click', function () {
                showMovieDetails(movie);
            });

            lista.appendChild(listItem);
        });
    }

    /**
     * Función para mostrar detalles de la película en un offcanvas
     * @param movie {Object} - Objeto de la película cuyos detalles se mostrarán
     */
    function showMovieDetails(movie) {

        const offcanvasElement = document.getElementById('movieOffcanvas');
        const offcanvas = new bootstrap.Offcanvas(offcanvasElement);

        // Actualizar contenido del offcanvas
        document.getElementById('offcanvasMovieTitle').textContent = movie.title;
        document.getElementById('offcanvasMovieOverview').textContent = movie.overview || 'Sinopsis no disponible';

        const genresList = document.getElementById('offcanvasMovieGenres');
        genresList.innerHTML = '';

        if (movie.genres && movie.genres.length > 0) {
            movie.genres.forEach(genre => {
                const genreSpan = document.createElement('span');
                genreSpan.className = 'badge bg-primary me-2 mb-2';
                genreSpan.textContent = genre.name;
                genresList.appendChild(genreSpan);
            });
        } else {
            genresList.innerHTML = '<span class="text-muted">Géneros no disponibles</span>';
        }

        const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '-';
        const runtime = movie.runtime ? `${movie.runtime} minutos` : '-';
        const budget = movie.budget ? `${movie.budget.toLocaleString()}` : '-';
        const revenue = movie.revenue ? `${movie.revenue.toLocaleString()}` : '-';

        document.getElementById('movieYear').textContent = releaseYear;
        document.getElementById('movieRuntime').textContent = runtime;
        document.getElementById('movieBudget').textContent = budget;
        document.getElementById('movieRevenue').textContent = revenue;

        offcanvas.show();
    }

    async function executeSearch() {
        const movies = await getMoviesList();
        if (movies) {
            const query = inputBuscar.value.trim();
            updateSearchParam(query);
            const filteredMovies = filterMovies(movies);
            displayMovies(filteredMovies);
        }
    }

    btnBuscar.addEventListener('click', executeSearch);

    inputBuscar.addEventListener('input', executeSearch);

    inputBuscar.value = getSearchQuery();
    await executeSearch();
});