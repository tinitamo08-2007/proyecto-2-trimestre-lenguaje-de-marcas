// Obtenemos el nombre del usuario desde sessionStorage y lo mostramos en la barra de bienvenida
let nombreUser = sessionStorage.getItem("netflix_nombre");
const welcomeEl = document.getElementById("welcomeName");
if (welcomeEl) {
    welcomeEl.textContent = nombreUser || "Usuario";
}

// Funcion para cargar los datos de las peliculas desde el JSON
async function cargar_datos() {
    try {
        // Leemos el Json con fetch
        const datoJson = await fetch("./datos.json");
        // Lo convertimo a un objeto de JavaScript
        const datosPeliculas = await datoJson.json();
        console.log(datosPeliculas);

        // Cargamos lo sdatos en la web HTML
        var contenedor = document.getElementById("contenedordvds");

        datosPeliculas.forEach(function (pelicula) {
            contenedor.innerHTML += '<div class="col-6 col-md-3">' +
                '<div class="dvd-card">' +
                '<a href="' + pelicula.trailer + '" target="_blank">' + pelicula.titulo + '</a>' +
                '<div class="dvd-cover" style="background-image:url(\'' + pelicula.imagen + '\');"></div>' +
                '</div>' +
                '</div>';
        });

    } catch (error) {
        console.log("Error al leer el archivo JSON:", error);
    }
}
cargar_datos();

