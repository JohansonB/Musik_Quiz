const container = document.getElementById("piano-container");

// Apply the scale factor of 2 to the container
// container.style.transform = "scale(1.5)";

const loudspeaker = document.getElementById("loudspeaker");
const pianoSound = document.getElementById("pianoSound");
const helpButton = document.getElementById("help-button");
const popupContainer = document.getElementById("popup-container");
const closeButton = document.getElementById("close-button");
const popupText = document.getElementById("popup-text");

        
helpButton.addEventListener("click", function() {
    // Überprüfe, ob das Popup geöffnet ist
    if (popupContainer.style.display == "block") {
        // Popup ist bereits geöffnet, schließe es
        popupContainer.style.display = "none";
    } else {
        // Popup ist geschlossen, öffne es und setze den Text
        popupContainer.style.display = "block";
    }
});
    closeButton.addEventListener("click", function() {
    // Schließe das Pop-up, wenn der "Schließen"-Button geklickt wird
    popupContainer.style.display = "none";
});

loudspeaker.addEventListener("click", function() {
    if (pianoSound.paused) {
        pianoSound.play();
    } else {
        pianoSound.pause();
        pianoSound.currentTime = 0;
    }
});
const answerContainers = document.querySelectorAll(".answer-container");
answerContainers.forEach(container => {
    container.addEventListener("click", function() {
        document.getElementById("continue-text").style.visibility = "visible";
        if (container.classList.contains("selected")) {
            container.classList.remove("selected");
            sessionStorage.setItem(document.body.id,"");
        } else {
            answerContainers.forEach(otherC => {
                otherC.classList.remove("selected");
            });
            container.classList.add("selected");
            sessionStorage.setItem(document.body.id,container.getElementsByClassName("answer-description")[0].textContent);
        }
    });
});
innit();

function innit(){
    const state = sessionStorage.getItem(document.body.id);
    if(state!=null&&state!=""){
        const selected = document.getElementById(state);
        if(selected!=null){
            selected.classList.add("selected");
        }
    }
}