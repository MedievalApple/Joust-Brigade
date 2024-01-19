function startGame() {
    const nameInput = <HTMLInputElement>document.getElementById("nameInput");
    const serverInput = <HTMLInputElement>document.getElementById("serverInput");

    const username = nameInput.value;
    const server = serverInput.value;

    if (server !== " ") {
        localStorage.setItem("server", server);
    }

    if (username !== "" && username !== " ") {
        localStorage.setItem("username", username.toUpperCase());
        window.location.replace("joust.html");
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("next-button");
    button.addEventListener("click", startGame);

    // set server value to localhost:3000
    const serverInput = <HTMLInputElement>document.getElementById("serverInput");
    serverInput.value = "localhost:3000";
});
