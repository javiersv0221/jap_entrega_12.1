document.addEventListener('DOMContentLoaded', function () {
    const API_URL = "https://japceibal.github.io/japflix_api/movies-data.json";
    const inputBuscar = document.getElementById('inputBuscar');
    const btnBuscar = document.getElementById('btnBuscar');
    const lista = document.getElementById('lista');

    async function getMoviesList() {
        try {
            const response = await fetch(API_URL);
            return await response.json();
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            return null;
        }
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
            lista.appendChild(listItem);
        });
    }

    btnBuscar.addEventListener('click', async () => {
        const movies = await getMoviesList();
        if (movies) {
            displayMovies(movies);
        }
    });

});