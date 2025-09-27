    state_array = [-1, -1, -1, -1,-1, -1, -1, -1,-1, -1, -1, -1,-1, -1, -1, -1,-1, -1, -1, -1,-1, -1, -1, -1,-1, -1, -1, -1,-1, -1, -1, -1];
     const helpButton = document.getElementById("help-button");
    helpButton.addEventListener("click", function() {
        alert("This is the help message. You can provide instructions or information here.");
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