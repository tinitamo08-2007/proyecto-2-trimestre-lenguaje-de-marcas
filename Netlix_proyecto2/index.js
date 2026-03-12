// JavaScript para manejar el inicio de sesión
document.getElementById("btnLogin").addEventListener("click", function () {
    var email = document.getElementById("emailInput").value.trim().toLowerCase();
    var pass = document.getElementById("passInput").value;
    var error = document.getElementById("loginError");

    if (email === "miembro@netflix.com" && pass === "netflix123") {
        sessionStorage.setItem("netflix_nombre", "Carlos");
        window.location.href = "pagina_netflix.html";
    } else {
        error.classList.add("show");
    }
});

// Funcion asincrona para cargar los datos de las peliculas desde el JSON
async function cargar_datos() {
    try {
        // Leemos el Json con fetch
        const datoJson = await fetch ("./datos.json");
        // Lo convertimo a un objeto de JavaScript
        const datosPeliculas = await datoJson.json();
        console.log(datosPeliculas);

        // Cargamos lo sdatos en la web HTML
        var contenedor = document.getElementById("contenedordvds");
                        
        datosPeliculas.forEach(function(pelicula){
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

// Se llama a la función para cargar los datos al cargar la página
cargar_datos();