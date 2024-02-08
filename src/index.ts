function startGame() {
    const nameInput = <HTMLInputElement>document.getElementById("nameInput");
    const serverInput = <HTMLInputElement>document.getElementById("serverInput");
    const checkbox = <HTMLInputElement>document.getElementById("spectatorCheckbox");

    const username = nameInput.value;
    const server = serverInput.value;
    const spectator = checkbox.checked;

    if (server !== " ") {
        sessionStorage.setItem("server", server);
    }

    sessionStorage.setItem("spectator", spectator.toString());

    if (username !== "" && username !== " ") {
        sessionStorage.setItem("username", username);
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
