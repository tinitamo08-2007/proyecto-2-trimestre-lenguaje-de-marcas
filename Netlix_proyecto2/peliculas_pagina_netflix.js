/* ==================================================================
   Proyecto 2: Página de los 2000s 
   Materia: Lenguajes de Marcas
   Integrantes: cesar, stefan y valentina
   Descripción: Este script se encarga de:
    - Mostrar el nombre del usuario logueado en la barra.
    - Cargar el archivo datos.json con la lista de películas.
    - Generar dinámicamente las tarjetas de cada película
      en el contenedor de la página de catálogo.
   ================================================================== */


// Obtenemos el nombre del usuario desde sessionStorage y lo mostramos en la barra de bienvenida
// sessionStorage es un almacenamiento temporal que guarda datos mientras la pestaña está abierta.
// Aquí recuperamos el valor guardado con la clave "netflix_nombre" .
let nombreUser = sessionStorage.getItem("netflix_nombre");

// Buscamos en la página el elemento HTML que tiene el id "welcomeName".
// Este elemento es donde se muestra el nombre del usuario .
const welcomeEl = document.getElementById("welcomeName");

// Si el elemento existe en la página , actualizamos su texto.
if (welcomeEl) {
    // Si hay un nombre guardado , lo mostramos.
    // Si no hay usuario logueado, mostramos "Usuario" por defecto.
    welcomeEl.textContent = nombreUser || "Usuario";
}

// Función para cargar los datos de las películas desde el archivo JSON
async function cargar_datos() {
    try {
        // cargamos el json , y usamos el trycatch por si hay algún error .

        // Leemos el archivo JSON usando fetch. fetch devuelve una promesa, por eso usamos "await" para esperar la respuesta.
        // La ruta "./datos.json" indica que el archivo está en la misma carpeta que la página HTML.
        const datoJson = await fetch("./datos.json");

        // Convertimos la respuesta a un objeto JavaScript
        // Con .json() extraemos el contenido y lo convertimos en un array de objetos .
        const datosPeliculas = await datoJson.json();

        // Mostramos los datos en la consola del navegador para verificar que se cargaron correctamente.
        console.log(datosPeliculas);

        // Buscamos el elemento HTML donde vamos a insertar las tarjetas de las películas.
        // Este elemento tiene id "contenedordvds" .
        var contenedor = document.getElementById("contenedordvds");

        // Recorremos el array de películas con forEach.
        // Por cada película, añadimos HTML al contenedor.
        datosPeliculas.forEach(function (pelicula) {
            // Usamos innerHTML += para agregar contenido sin borrar lo que ya había.
            // Creamos una columna de Bootstrap (col-6 col-md-3) para que se vean 2 en móvil y 4 en escritorio.
            // Dentro de la columna, un div con clase "dvd-card" que contiene:
            // - Un enlace  que abre el trailer en una nueva pestaña  y muestra el título.
            // - Un div con clase "dvd-cover" que tiene una imagen de fondo .
            contenedor.innerHTML += '<div class="col-6 col-md-3">' +
                '<div class="dvd-card">' +
                '<a href="' + pelicula.trailer + '" target="_blank">' + pelicula.titulo + '</a>' +
                '<div class="dvd-cover" style="background-image:url(\'' + pelicula.imagen + '\');"></div>' +
                '</div>' +
                '</div>';
        });

    } catch (error) {
        // Si ocurre algún error en el bloque try , lo capturamos aquí.
        // Mostramos el error en la consola 
        console.log("Error al leer el archivo JSON:", error);
    }
}

// Llamamos a la función para que se ejecute cuando la página carga.
cargar_datos();
