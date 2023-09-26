function startGame() {
    const username = document.getElementById("nameInput").value;
    
    if (!username == "" && !username == " ") {
        localStorage.setItem("username", username.toUpperCase());
        window.location.replace("joust.html");
    }

}