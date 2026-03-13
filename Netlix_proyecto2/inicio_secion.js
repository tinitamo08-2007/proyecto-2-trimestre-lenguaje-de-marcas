// Mostrar el nombre del usuario si ya está logueado
const welcomeNameEl = document.getElementById("welcomeName");
if (welcomeNameEl) {
    welcomeNameEl.textContent = sessionStorage.getItem("netflix_nombre") || "Usuario";
}

// Iniciar sesión (solo si el botón existe)
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
    btnLogin.addEventListener("click", async function () {
        var email = document.getElementById("emailInput").value.trim().toLowerCase();
        var pass = document.getElementById("passInput").value;
        var error = document.getElementById("loginError");
        try {
            const respuesta = await fetch("./datos_usuarios.json");
            const datosUsuarios = await respuesta.json();
            var usuarioEncontrado = null;
            datosUsuarios.forEach(function (usuario) {
                if (usuario.correo === email && usuario.contraseña === pass) {
                    usuarioEncontrado = usuario;
                }
            });
            if (usuarioEncontrado) {
                sessionStorage.setItem("netflix_nombre", usuarioEncontrado.nombre);
                sessionStorage.setItem("netflix_correo", usuarioEncontrado.correo);
                window.location.href = "mi_cuenta.html";
            } else {
                error.classList.add("show");
            }
        } catch (error) {
            console.error("Error al leer el archivo JSON:", error);
        }
    });
}

// Cerrar sesión (solo si el botón existe)
const btnSignOut = document.getElementById("btnSignOut");
if (btnSignOut) {
    btnSignOut.addEventListener("click", function () {
        sessionStorage.clear();
        window.location.href = "inicio_netflix.html";
    });
}

// Función para actualizar el total de DVDs en casa (para catálogo y mi cuenta)
async function actualizarTotalEnCasa() {
    let correoUser = sessionStorage.getItem("netflix_correo");
    const totalEl = document.getElementById("totalEnCasa");
    if (!totalEl) return; // Si no existe el elemento, salir

    if (!correoUser) {
        totalEl.textContent = "0";
        return;
    }
    try {
        const respuesta = await fetch("./datos_usuarios.json");
        const alquileres = await respuesta.json();
        const total = alquileres.filter(a => a.correo === correoUser && a.estado === "en_casa").length;
        totalEl.textContent = total;
    } catch (error) {
        console.error("Error al leer el archivo JSON:", error);
    }
}

// Función para cargar y mostrar los alquileres del usuario (solo en mi_cuenta)
async function cargarRentas() {
    const nombre = sessionStorage.getItem("netflix_nombre");
    const correo = sessionStorage.getItem("netflix_correo");

    if (!correo) {
        window.location.href = "inicio_netflix.html";
        return;
    }

    const welcomeEl = document.getElementById("welcomeName");
    if (welcomeEl) welcomeEl.textContent = nombre;

    try {
        const respUsuarios = await fetch("./datos_usuarios.json");
        const respPeliculas = await fetch("./datos.json");
        const alquileres = await respUsuarios.json();
        const peliculas = await respPeliculas.json();

        const misAlquileres = alquileres.filter(a => a.correo === correo);
        const enCasa = misAlquileres.filter(a => a.estado === "en_casa");
        const historial = misAlquileres.filter(a => a.estado === "devuelta");

        // Actualizar total en casa
        const totalEl = document.getElementById("totalEnCasa");
        if (totalEl) totalEl.textContent = enCasa.length;

        function buscarPelicula(id) {
            return peliculas.find(p => p.id === id) || { titulo: "Desconocida", imagen: "" };
        }

        // Mostrar DVDs en casa
        const contEnCasa = document.getElementById("listEnCasa");
        if (contEnCasa) {
            contEnCasa.innerHTML = "";
            if (enCasa.length === 0) {
                contEnCasa.innerHTML = "<p>No tienes DVDs en casa.</p>";
            } else {
                enCasa.forEach(r => {
                    const peli = buscarPelicula(r.id_pelicula);
                    contEnCasa.innerHTML += `
                        <div class="renta-card">
                            <div class="renta-poster" style="background-image:url('${peli.imagen}');"></div>
                            <div class="renta-info">
                                <div class="renta-titulo">${peli.titulo}</div>
                                <div class="renta-meta">Alquilada el: ${r.fecha_renta}</div>
                                <span class="badge-en-casa">EN CASA</span>
                            </div>
                        </div>
                    `;
                });
            }
        }

        // Mostrar historial
        const contHistorial = document.getElementById("listHistorial");
        if (contHistorial) {
            contHistorial.innerHTML = "";
            if (historial.length === 0) {
                contHistorial.innerHTML = "<p>No hay historial de alquileres.</p>";
            } else {
                historial.forEach(r => {
                    const peli = buscarPelicula(r.id_pelicula);
                    contHistorial.innerHTML += `
                        <div class="renta-card">
                            <div class="renta-poster" style="background-image:url('${peli.imagen}');"></div>
                            <div class="renta-info">
                                <div class="renta-titulo">${peli.titulo}</div>
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

// Ejecutar funciones según la página actual
if (document.getElementById("totalEnCasa")) {
    actualizarTotalEnCasa();
}
if (document.getElementById("listEnCasa")) {
    cargarRentas();
}