        const container = document.getElementById("piano-container");

        // Apply the scale factor of 2 to the container
        container.style.transform = "scale(2)";


        const pianoSound = document.getElementById("pianoSound");
        const helpButton = document.getElementById("help-button");
        const answerContainers = document.querySelectorAll(".answer-container");

        innit();
        helpButton.addEventListener("click", function() {
            alert("This is the help message. You can provide instructions or information here.");
        });

        answerContainers.forEach(container => {
            container.addEventListener("click", function(event) {
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
                    if (container.classList.contains("selected")) {
                        container.classList.remove("selected");
                        sessionStorage.setItem(document.body.id,"");
                    }
                    else {
                        answerContainers.forEach(otherC => {
                        otherC.classList.remove("selected");
                    });
                    container.classList.add("selected");
                    sessionStorage.setItem(document.body.id,container.getAttribute("index"))
                }
            }
            });
        });

        function innit(){
            const state = sessionStorage.getItem(document.body.id);
            if(state!=null&&state!=""){
                answerContainers.forEach(cont =>{
                    if(cont.getAttribute("index")==state){
                        cont.classList.add("selected");
                    }
                }

                );
            }
        }
