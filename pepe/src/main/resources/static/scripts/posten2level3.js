    state_array = [-1, -1, -1, -1,-1, -1, -1, -1,-1, -1, -1, -1,-1, -1, -1, -1,-1, -1, -1, -1,-1, -1, -1, -1,-1, -1, -1, -1,-1, -1, -1, -1];
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

    const numberContainers = document.querySelectorAll(".number-box");
    numberContainers.forEach(container => {
        container.addEventListener("click", function() {
            index = parseInt(container.id.substring(2),10)-1;
            if (container.classList.contains("selected")) {
                container.classList.remove("selected");
                state_array[index] = -1;
            } else {
                container.classList.add("selected");
                state_array[index] = 1;
            }
            update_storage();
        });
    });
    innit();
    //update the entry at teh given index;
    function update_storage(){
        let temp = "";
        for(let i = 0; i<state_array.length;i++){
            temp = temp+state_array[i]+" ";
        }
        temp = temp.trim();
        sessionStorage.setItem(document.body.id,temp);
    }
    function innit(){
        let state = sessionStorage.getItem(document.body.id);
        if(state!=null&&state!=""){
            states = state.split(/\s+/);
            for(let i = 0; i<states.length;i++){
                state_array[i] = states[i];
                if(states[i] == 1){
                    let id = "nb"+(i+1);
                    document.getElementById(id).classList.add("selected");
                }
            }
        }
    }