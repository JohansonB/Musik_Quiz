

        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const pianoSound = document.getElementById("pianoSound");
        const answer_containers = Array.from(document.getElementsByClassName("answer-box"));

        answer_containers.forEach(ele=>{
            ele.addEventListener("click",function(){
            if(ele.classList.contains("selected")){
                clear_selected();
                sessionStorage.setItem(document.body.id,"");
                // Clear the canvas before drawing the image (optional)
                ctx.clearRect(0, 0, canvas.width, canvas.height);

            }
            else{
                clear_selected();
                ele.classList.add("selected");
                sessionStorage.setItem(document.body.id,ele.id);
                const imageDataURL = sessionStorage.getItem("Posten3level1version"+ele.id);

                // Step 2: Create an Image object and set its src to the data URL
                const img = new Image();
                img.src = imageDataURL;

                // Step 3: When the image has loaded, draw it onto the canvas
                img.onload = function () {                    
                    // Clear the canvas before drawing the image (optional)
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Draw the image onto the canvas
                    ctx.drawImage(img, 0, 0);

                    // Now, the canvas should display the loaded image
                };

                // Be sure to handle errors, for example:
                img.onerror = function () {
                    console.error("Error loading image");
                };
            }
        },false);
        });

        

        loudspeaker.addEventListener("click", function() {
            if (pianoSound.paused) {
                pianoSound.play();
            } else {
                pianoSound.pause();
                pianoSound.currentTime = 0;
            }
        });

        function clear_selected(){
            Array.from(document.getElementsByClassName("selected")).forEach(ele=>{
                ele.classList.remove("selected");
            })
        }