        const container = document.getElementById("piano-container");

        // Apply the scale factor of 2 to the container
        // container.style.transform = "scale(2)";

    const uberContainers = document.querySelectorAll(".uber-container");
    const soundContainer = document.querySelectorAll(".sound-container");

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



    let draggedElement = null;
    let draggableEles = document.querySelectorAll("[draggable='true']");



    let dragstart = function(event) {

           draggedElement = event.currentTarget;
   }
   let dragend = function() {
        draggedElement = null;
    }
    let dragover = function(event) {
        event.preventDefault();
    }
    let drop = function(container) {
        return function(event){
            if(draggedElement!=event.currentTarget){
                event.preventDefault();
                const dragParent = draggedElement.parentNode;
                const targetParent = container.parentNode;
                dragParent.appendChild(container);
                targetParent.appendChild(draggedElement); // Append as a child to the new location
                update_storage();
            }
        }
    }


    // Add dragstart event listener to the draggable elements
    draggableEles.forEach(element => {
        element.addEventListener("dragstart",dragstart );
        element.addEventListener("dragend", dragend);
});

// Add dragover event listener to the uber containers to allow dropping
uberContainers.forEach(container => {
    container.addEventListener("dragover", function(event) {
        event.preventDefault();
    });

    container.addEventListener("drop", function(event) {
        event.preventDefault();
        let image = container.querySelector(".drag-image");
        if(image!=null){
            if(draggedElement.parentNode.classList.contains("place-holder")){
                image.remove(); // Remove the existing drag-image;
            }
            else{
                draggedElement.parentNode.appendChild(image)
            }
        }
        else if(image==null){
            draggedElement.parentNode.appendChild(container.querySelector(".sound-container"))
        }
        container.appendChild(draggedElement); // Append the new drag-image
        update_storage();

    });
});


// Add dragover event listener to the uber containers to allow dropping
draggableEles.forEach(container => {
    container.addEventListener("dragover", dragover);

    container.addEventListener("drop", drop(container));
});

soundContainer.forEach(container => {
            container.addEventListener("click", function(event) {
                console.log(container.index)
                const clickedElement = event.target;
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
                    if(container.getAttribute("index") == "4"){
                        audio = document.getElementById("HB4-audio")
                    }
                    if (audio.paused) {
                        audio.play();
                    }
                    else{
                        audio.currentTime = 0;
                        audio.pause();
                    }


            });
        });
        
        innit();

        function update_storage(){
            var final_string = "";
            uberContainers.forEach(container =>{
                var audio_container = container.getElementsByClassName("sound-container");
                if(audio_container.length == 0){
                    final_string = final_string + " -1";
                }
                else{
                    final_string = final_string+" " + audio_container[0].getAttribute("index");
                }
            })
            sessionStorage.setItem(document.body.id,final_string);
        }
        function innit(){
            const state = sessionStorage.getItem(document.body.id);
            if(state!=null&&state!=""){
                const values = state.trim().split(/\s+/);

                for(let i = 0; i<values.length;i++){
                    if(values[i]!="-1"){
                        const cur_ele = document.getElementById("HB"+values[i]);
                        const charA = 'a';
                        const result_id = String.fromCharCode(charA.charCodeAt(0) + i);
                        const target_ele = document.getElementById(result_id);
                        let image = target_ele.querySelector(".drag-image");
                        image.remove();
                        target_ele.appendChild(cur_ele);
                    }
                }
            }
        }


