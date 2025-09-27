        let mouseStoppedTimer;
        const titel = document.getElementById("piano-container");
        let white_x = 119.5;
        let black_y = 250;
        let balck_x = 53;
        let offset_x = 4;


        let dWidth = 840.0;
        let dHeight = 374.0;

        var pad_image = document.getElementById("keyboard");
        // Get the dimensions of the SVG element
        var svgRect = pad_image.getBoundingClientRect();
    
        // Retrieve width and height
        var nWidth = svgRect.width;
        var nHeight = svgRect.height;


        rescale(nWidth,nHeight);

        let recording = false;

        const note = {
            0: "C",
            1: "D",
            2: "E",
            3: "F",
            4: "G",
            5: "A",
            6: "B"
        };

        const synth = new Tone.Synth().toDestination();
        Tone.start();
        let current_note;
        let current_attempt = 1;
        const max_tries = 3;



        const pianoSound = document.getElementById("pianoSound");
        const piano = document.getElementById("keyboard-image-wrapper");

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


        piano.addEventListener("click", function (event) {
            let bounds = pad_image.getBoundingClientRect();
            let x = event.clientX - bounds.left;
            let y = event.clientY - bounds.top;
            if(x-offset_x<0||x>=bounds.width-offset_x){
                return;
            }
            let played = get_key(event);
            let marker = document.getElementById("marker");
            if(marker!=null){
                marker.remove();
            }
            add_marker(x,y)
            marker = document.getElementById("marker");
            
            if(recording){
                if(sessionStorage.getItem(document.body.id)==null){
                    sessionStorage.setItem(document.body.id,""+played);
                }
                else{
                    sessionStorage.setItem(document.body.id,sessionStorage.getItem(document.body.id)+played);
                }
            }
            playSound(played);
            current_note = played;

            // Stop the note after a quarter note duration (500 milliseconds at 120 BPM)
            setTimeout(() => {
                if(current_note==played){
                synth.triggerRelease();
            }
            }, 250);
            setTimeout(() => {
                if(current_note==played){
                synth.triggerRelease();
                marker.remove();
            }
            }, 450);
        }
        , false);

        const place_holder = document.getElementById("place-holder");
        place_holder.addEventListener("click",function(e){
            if(recording){
                recording = false;
                if(sessionStorage.getItem(document.body.id)!=null){
                    sessionStorage.setItem(document.body.id,sessionStorage.getItem(document.body.id)+" ");
                    current_attempt = sessionStorage.getItem(document.body.id).trim().split(/\s+/).length+1;
                    document.getElementById("number-attempts").textContent = current_attempt+"/3 Versuche"
                }
                document.getElementById("stop").remove();
                const image = document.createElement("img");
                place_holder.appendChild(image);
                image.alt = "record";
                image.src = "images/record.PNG"
                image.id = "record";


            }
                else{
                if(current_attempt<=max_tries){
                        recording = true;
                        document.getElementById("record").remove();
                        const image = document.createElement("img");
                        place_holder.appendChild(image);
                        image.alt = "stop";
                        image.src = "images/stop.png"
                        image.id = "stop";
                }

            }

        }, false);

        innit();

        function rescale(nWidth,nHeight){
            let width_factor = nWidth/dWidth;
            let height_factor = nHeight/dHeight;
            dWidth = nWidth;
            dHeight = nHeight;

            white_x *= width_factor;
            black_y *= height_factor;
            balck_x *= width_factor;
            offset_x *= width_factor;

           
        }

        function add_marker(x,y){
            const dot_width = 24;
            const dot_height = 18;

            let relative_x = (x-offset_x)%white_x;
            let black = is_black(x,y);
            let count = Math.floor((x-offset_x) / white_x);

            const image = document.createElement("div");
            document.getElementById("keyboard-image-wrapper").appendChild(image);
            image.className = "dot"; // Apply the same class as the overlay image
            image.id = "marker";

            if(black==-1){
                image.setAttribute("style","position: absolute;left: "+(4/3*(offset_x+count*white_x+white_x/2-dot_width/2))+"px;top: "+(4/3*1.05*black_y)+"px;")
            }
            else{
                image.setAttribute("style","position: absolute;left: "+(4/3*(offset_x+(black+1)*white_x-dot_width/2))+"px;top: "+(4/3*0.75*black_y)+"px;")
            }

            
            

        }

        function playSound(note) {
            synth.triggerAttack(`${note}${4}`, "1");
        }

        function get_key(event){

            let bounds = pad_image.getBoundingClientRect();
            let x = event.clientX - bounds.left;
            let y = event.clientY - bounds.top;
            let relative_x = (x-offset_x)%white_x;
            let black = is_black(x,y);
            let count = Math.floor((x-offset_x) / white_x);
            let played_note = note[count];
            if(black!=-1){
                played_note = note[black];
                played_note = played_note+"#";
            }
            return played_note;
        }
        function is_black(x,y){
            let relative_x = (x-offset_x)%white_x;
            let count = Math.floor((x-offset_x)/ white_x);
            if(y<=black_y&&relative_x+balck_x/2>=white_x&&count!=2&&count!=6){
                return count;
            }
            if(y<=black_y&&relative_x<=balck_x/2&&count!=0&&count!=3&&count!=7){
                return count-1
            }
            return -1;

        }
        function print_mouse_pos(event,context){
            let bounds = context.getBoundingClientRect();
            let x = event.clientX - bounds.left;
            let y = event.clientY - bounds.top;
            // Clear the previous timer if it exists
            clearTimeout(mouseStoppedTimer);

            // Start a new timer to detect mouse stop
            mouseStoppedTimer = setTimeout(function () {
                // Mouse has stopped moving, trigger your desired action here
                console.log("x: "+ x);
                console.log("y: "+y);

            }, 1000); // Adjust the timeout as needed (in milliseconds)

        }

        function innit(){
            const state = sessionStorage.getItem(document.body.id);
            if(state!=null&&state!=""){
                current_attempt = state.trim().split(/\s+/).length+1;
                document.getElementById("number-attempts").textContent = current_attempt+"/3 Versuche";
            }
        }