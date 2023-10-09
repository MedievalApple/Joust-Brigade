function startGame() {
    const username = document.getElementById("nameInput").value;
    const server = document.getElementById("serverInput").value;
    
    if (!server == " ") {
        localStorage.setItem("server", server);
    }

    if (!username == "" && !username == " ") {
        localStorage.setItem("username", username.toUpperCase());
        window.location.replace("joust.html");
    }

}