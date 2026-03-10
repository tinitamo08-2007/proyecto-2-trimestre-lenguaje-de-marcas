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
