document.getElementById("gameIDSubmit").addEventListener("click", function (event) {
    event.preventDefault();
    const gameID = document.getElementById("gameIDInput").value;
    if (gameID === "") {
        return;
    }
    document.getElementById("gameRoot").src = "https://raymon.musitraynes.com/games/" + gameID + "/index.html";
});
