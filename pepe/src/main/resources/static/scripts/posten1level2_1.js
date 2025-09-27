        const container = document.getElementById("piano-container");

        // Apply the scale factor of 2 to the container
        // container.style.transform = "scale(2)";


    const pianoSound = document.getElementById("pianoSound");
    const answerContainers = document.querySelectorAll(".answer-container");
        
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

        answerContainers.forEach(container => {
            container.addEventListener("click", function(event) {
                const text = container.getElementsByClassName("answer-description")[0];
                const clickedElement = event.target;
                if (clickedElement.classList.contains("answer-image")) {
                    var audio;
                    if(container.getAttribute("index") == "1"){
                        audio = document.getElementById("HB1-audio")
                    }
                    if(container.getAttribute("index") == "2"){
                        audio = document.getElementById("HB2-audio")
                    }
                    if(container.getAttribute("index") == "3"){
                        audio = document.getElementById("HB3-audio")
                    }
                    if (audio.paused) {
                        audio.play();
                    }
                    else{
                        audio.currentTime = 0;
                        audio.pause();
                    }
                }
                else {
                    if (clickedElement==text &&text.classList.contains("selected")) {
                        text.classList.remove("selected");
                        sessionStorage.setItem(document.body.id,"");
                    }
                    else {
                        document.querySelectorAll(".answer-description").forEach(otherC => {
                        otherC.classList.remove("selected");
                        });
                        text.classList.add("selected");
                        sessionStorage.setItem(document.body.id,container.getAttribute("index"))
                    }   
                }
            });
        });
        innit();

        function innit(){
            const state = sessionStorage.getItem(document.body.id);
            if(state!=null&&state!=""){
                answerContainers.forEach(cont =>{
                    if(cont.getAttribute("index")==state){
                        cont.getElementsByClassName("answer-description")[0].classList.add("selected");
                    }
                }

                );
            }
        }
