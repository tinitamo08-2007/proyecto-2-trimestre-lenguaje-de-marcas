/* ==================================================================
   Proyecto 2: Página de los 2000s 
   Materia: Lenguajes de Marcas
   Integrantes: cesar, stefan y valentina
   Descripción: Script principal para la funcionalidad de:
    - Inicio de sesión de usuarios (validación con JSON).
    - Cierre de sesión (limpieza de sessionStorage).
    - Actualización del contador de DVDs en casa.
    - Carga y visualización de alquileres en Mi Cuenta.
   ================================================================== */


// Buscamos en la página el elemento HTML que tiene el id "welcomeName".
// Este elemento muestra el nombre del usuario en la parte superior de la pagina 
// document.getElementById("welcomeName") devuelve ese elemento o null si no existe.
const elementoNombre = document.getElementById("welcomeName");

// si el elemento existe realizamos la operación de mostrar el nombre del usuario
if (elementoNombre) {
    // Si existe, le coloamos el nombre de uduario
    // sessionStorage.getItem("netflix_nombre") compara y recupera el valor que esta guardado
    // con la clave "netflix_nombre". Si no hay nada guardado, devuelve null.
    // Y si lo que devuelve es null, usa "Usuario".
    //tambien , si alguien no ha iniciado sesión, mostramos "Usuario" por defecto.
    elementoNombre.textContent = sessionStorage.getItem("netflix_nombre") || "Usuario";
}
//=========================================================
// Buscamos el botón que tiene id "btnLogin".
const botonLogin = document.getElementById("btnLogin");

// Si el botón existe entonces añadimos un evento de clic para manejar el inicio de sesión.
if (botonLogin) {
    // Añadimos una alerta para que escuche el evento de clic. El primer parámetro es el tipo de evento,
    // en este caso "click". El segundo parámetro es la función que se ejecutará
    // cuando ocurra el clic. La función es async porque dentro se cargara el json que puede caer en el error por ello 
    // esperamonscon await.
    botonLogin.addEventListener("click", async function () {
        // Obtenemos el valor del campo de correo electrónico.
        // .value obtiene lo que escribió.
        // .trim() elimina espacios en blanco al principio y final.
        // .toLowerCase() lo convierte a minúsculas para evitar problemas de mayúsculas.
        let email = document.getElementById("emailInput").value.trim().toLowerCase();

        // Obtenemos la contraseña. No usamos trim porque podría tener espacios válidos,
        // pero en este caso no debería. Tampoco la pasamos a minúsculas porque las
        // contraseñas suelen tener mayúsculas.
        let password = document.getElementById("passInput").value;

        // si el correo o la contraseña son incoreectos, mostramos el mensaje de error
        let errorBox = document.getElementById("loginError");

        // luego leemos el archivo JSON.
        // El bloque trycatch lo usamos para capturar errores que puedan ocurrir
        // por si el archivo no existe.
        try {
            // Aquí pedimos el archivo "datos_usuarios.json" .
            // el "./" significa que el archivo json está en la carpeta actual.
            const respuesta = await fetch("./datos_usuarios.json");

            // Con  el json convertimos esa respuesta en un
            // objeto JavaScript , es decir, un array de objetos.
            const datosUsuarios = await respuesta.json();

            // Ahora tenemos un array con todos los registros de alquileres.
            // Necesitamos buscar si alguno tiene el correo y contraseña que el usuario
            // ha escrito. Inicializamos una variable usuarioEncontrado como null.
            let usuarioEncontrado = null;

            // Recorremos todo el array . Para cada elemento (registro),
            // comprobamos si su "correo" coincide con el email y si su 
            // "contraseña" coincide con la contraseña.
            datosUsuarios.forEach(function (registro) {
                if (registro.correo === email && registro.contraseña === password) {
                    // Si coinciden, guardamos el registro completo en usuarioEncontrado.
                    // y si hay vari1os registros del mismo usuario , uno por cada película,
                    // con encontrar uno ya es suficiente.
                    usuarioEncontrado = registro;
                }
            });

            // Si encontramos un usuario que no sea null
            if (usuarioEncontrado) {
                // Guardamos el nombre y el correo en nuestra seccion (sessionStorage).
                // sessionStorage.setItem("clave", valor) guarda un dato.
                // y luego, en las otras páginas, podemos recuperarlo con getItem.
                sessionStorage.setItem("netflix_nombre", usuarioEncontrado.nombre);
                sessionStorage.setItem("netflix_correo", usuarioEncontrado.correo);

                // Redirigimos al usuario a la página "mi_cuenta.html"
                window.location.href = "mi_cuenta.html";
            } else {
                // Si no se encontró ningún usuario, mostramos el mensaje de error.
                errorBox.classList.add("show");
            }
        } catch (error) {
            // Si  no se pudo cargar el JSON,
            // mostramos el error en la consola del navegador
            console.error("Error al leer el archivo JSON:", error);
        }
    });
}

// ============================================================

// Buscamos el botón de cerrar sesión. Este botón puede estar en varias páginas.
const botonCerrar = document.getElementById("btnSignOut");

// Si el botón existe 
if (botonCerrar) {
    // Añadimos un evento de clic.
    botonCerrar.addEventListener("click", function () {
        // sessionStorage.clear() elimina TODOS los datos guardados en sessionStorage.
        sessionStorage.clear();
        // Redirigimos a la página de inicio de sesión.
        window.location.href = "inicio_netflix.html";
    });
}

// ============================================================

// Definimos una función asíncrona para actualizar el total de peliculas en casa .
async function actualizarTotalEnCasa() {
    // Recuperamos el correo del usuario guardado en sessionStorage.
    let correoUsuario = sessionStorage.getItem("netflix_correo");

    // Buscamos en el html el elemento donde se muestra el total "totalEnCasa".
    const elementoTotal = document.getElementById("totalEnCasa");

    // Si el elemento existe en la página, procedemos
    if (elementoTotal) {
        // si no hay usuario logueado se muestra 0 
        if (!correoUsuario) {
            elementoTotal.textContent = "0"
        } else {
            // Si hay usuario, se cargan los alquileres
            try {
                //Pedimos el archivo JSON de alquileres
                let respuesta = await fetch("./datos_usuarios.json");
                let alquileres = await respuesta.json();

                // Filtramos por los alquileres:
                // - que tengan el correo igual al del usuario actual
                // - que tengan estado "en_casa"
                // .filter() recorre el array y devuelve uno nuevo solo con los que cumplen la condición.
                let alquileresEnCasa = alquileres.filter(a => a.correo === correoUsuario && a.estado === "en_casa");

                // Obtenemos la longitud del array
                let total = alquileresEnCasa.length;

                // Mostramos ese número en el elemento html.
                elementoTotal.textContent = total;

            } catch (error) {
                // si no se puede leer el archibo json saltamos al error en consola
                console.error("Error al leer el archivo JSON:", error);
            }

        }

    }
    // si el elemento no existe, no se hace nada 
}
//=======================================================
// Definimos una función asíncrona llamada cargarRentas.
async function cargarRentas() {

    // Obtenemos el nombre del usuario guardado en sessionStorage con la clave "netflix_nombre".
    const nombre = sessionStorage.getItem("netflix_nombre");
    // Obtenemos el correo del usuario guardado en sessionStorage con la clave "netflix_correo".
    const correo = sessionStorage.getItem("netflix_correo");


    // Si no hay no hay usuario logueado), lo redirigimos a la página de inicio de sesión.
    if (!correo) {
        // Cambiamos la ubicación de la página a inicio_netflix.html.
        window.location.href = "inicio_netflix.html";
    } else {
        // Si hay correo, significa que el usuario está logueado, entonces continuamos.

        // Buscamos en la página el elemento HTML que tiene el id "welcomeName".
        const elementoBienvenida = document.getElementById("welcomeName");

        // Si ese elemento existe en la página 
        // entonces le asignamos el nombre del usuario.
        if (elementoBienvenida) {
            // La propiedad textContent cambia el texto dentro del elemento.
            elementoBienvenida.textContent = nombre;
        }

        // Usamos trycatch para gestionar los errores que se puedan presentar
        try {
            // Pedimos los archivos "datos.json" (películas) y "datos_usuarios.json" .
            const respUsuarios = await fetch("./datos_usuarios.json");
            const respPeliculas = await fetch("./datos.json");

            // Convertimos la respuesta del primer archivo a un objeto JavaScript en una array de objetos.
            const alquileres = await respUsuarios.json();
            // Convertimos la respuesta del segundo archivo a un objeto JavaScript.
            const peliculas = await respPeliculas.json();


            // Usamos el método filter() del array para quedarnos solo con los alquileres
            //el campo "correo" sea igual al correo del usuario logueado.
            const misAlquileres = alquileres.filter(a => a.correo === correo);

            // De esos alquileres, filtramos los que tienen estado "en_casa" 
            const enCasa = misAlquileres.filter(a => a.estado === "en_casa");

            // Filtramos los que tienen estado "devuelta" o el historial de alquileres .
            const historial = misAlquileres.filter(a => a.estado === "devuelta");

            // Buscamos el elemento HTML con id "totalEnCasa" (donde se muestra el número total).
            const elementoTotal = document.getElementById("totalEnCasa");
            if (elementoTotal) {
                // Asignamos la cantidad de DVDs en casa la longitud del array enCasa.
                elementoTotal.textContent = enCasa.length;
            }

            // Buscamos el contenedor donde irán las tarjetas de los DVDs en casa id="listEnCasa".
            const contenedorEnCasa = document.getElementById("listEnCasa");
            if (contenedorEnCasa) {
                contenedorEnCasa.innerHTML = "";

                // Si no hay DVDs en casa, mostramos un mensaje.
                if (enCasa.length === 0) {
                    contenedorEnCasa.innerHTML = "<p>No tienes DVDs en casa.</p>";
                } else {
                    // Si hay DVDs, recorremos cada alquiler en casa .
                    enCasa.forEach(r => {
                        // Para cada alquiler, necesitamos encontrar los datos de la película correspondiente.
                        // Buscamos en el array de películas aquella que tenga el mismo id que el alquiler (r.id_pelicula).
                        let peliculaEncontrada = null;

                        for (let i = 0; i < peliculas.length; i++) {
                            // Si el id de la película actual coincide con el id del alquiler
                            if (peliculas[i].id === r.id_pelicula) {
                                // Guardamos esa película en la variable.
                                peliculaEncontrada = peliculas[i];

                            }
                        }
                        // Si después de recorrer todas las películas no encontramos ninguna ,
                        // entonces usamos un objeto con valores por defecto (título "Desconocida" e imagen vacía).
                        if (!peliculaEncontrada) {
                            peliculaEncontrada = { titulo: "Desconocida", imagen: "" };
                        }

                        // Ahora añadimos al contenedor una tarjeta HTML con los datos de la película y el alquiler.
                        // Usamos template strings (con comillas invertidas) para poder insertar variables con ${}.
                        contenedorEnCasa.innerHTML += `
                            <div class="renta-card">
                                <!-- La imagen de fondo se establece con style="background-image:url(...)" -->
                                <div class="renta-poster" style="background-image:url('${peliculaEncontrada.imagen}');"></div>
                                <div class="renta-info">
                                    <div class="renta-titulo">${peliculaEncontrada.titulo}</div>
                                    <div class="renta-meta">Alquilada el: ${r.fecha_renta}</div>
                                    <span class="badge-en-casa">EN CASA</span>
                                </div>
                            </div>
                        `;
                    });
                }
            }


            // Buscamos el contenedor del historial (id="listHistorial").
            const contenedorHistorial = document.getElementById("listHistorial");
            if (contenedorHistorial) {
                contenedorHistorial.innerHTML = "";

                // Si no hay historial, mostramos un mensaje.
                if (historial.length === 0) {
                    contenedorHistorial.innerHTML = "<p>No hay historial de alquileres.</p>";
                } else {
                    // Recorremos cada alquiler del historial.
                    historial.forEach(r => {
                        // Buscamos la película correspondiente de la misma manera que antes .
                        let peliculaEncontrada = null;
                        for (let i = 0; i < peliculas.length; i++) {
                            if (peliculas[i].id === r.id_pelicula) {
                                peliculaEncontrada = peliculas[i];
                            }
                        }
                        if (!peliculaEncontrada) {
                            peliculaEncontrada = { titulo: "Desconocida", imagen: "" };
                        }

                        // Añadimos la tarjeta al historial, incluyendo la fecha de devolución.
                        contenedorHistorial.innerHTML += `
                            <div class="renta-card">
                                <div class="renta-poster" style="background-image:url('${peliculaEncontrada.imagen}');"></div>
                                <div class="renta-info">
                                    <div class="renta-titulo">${peliculaEncontrada.titulo}</div>
                                    <div class="renta-meta">Alquilada: ${r.fecha_renta} | Devuelta: ${r.fecha_devolucion}</div>
                                    <span class="badge-devuelta">DEVUELTA</span>
                                </div>
                            </div>
                        `;
                    });
                }
            }
        } catch (error) {
            console.error("Error al cargar las rentas:", error);
        }
    }
}
// ============================================================
// si ¿existe en la página un elemento con id "totalEnCasa"?
// Si existe, significa que estamos en una página que debe mostrar el contador,
// entonces llamamos a la función actualizarTotalEnCasa().
if (document.getElementById("totalEnCasa")) {
    actualizarTotalEnCasa();
}

// si ¿existe un elemento con id "listEnCasa"?
if (document.getElementById("listEnCasa")) {
    cargarRentas();
}