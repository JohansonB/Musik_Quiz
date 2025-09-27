        let mouseStoppedTimer;
        const titel = document.getElementById("piano-container");
        const white_x = 119;
        const black_y = 250;
        const balck_x = 53;
        const offset_x = 4;

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

        // Apply the scale factor of 2 to the container
        titel.style.transform = "scale(2)";


        const pianoSound = document.getElementById("pianoSound");
        const helpButton = document.getElementById("help-button");
        helpButton.addEventListener("click", function() {
            alert("This is the help message. You can provide instructions or information here.");
        });

        const piano = document.getElementById("keyboard");


        piano.addEventListener("click", function (e) {
            let played = get_key(e);
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
        }
        , false);

        const place_holder = document.getElementById("place-holder");
        place_holder.addEventListener("click",function(e){
            if(recording){
                recording = false;
                if(sessionStorage.getItem(document.body.id)!=null){
                    sessionStorage.setItem(document.body.id,sessionStorage.getItem(document.body.id)+" ");
                    current_attempt = sessionStorage.getItem(document.body.id).trim().split(/\s+/).length+1;
                    document.getElementById("number-attempts").textContent = current_attempt+"/3 Versuchen"
                }
                document.getElementById("stop").remove();
                const image = document.createElement("img");
                place_holder.appendChild(image);
                image.alt = "record";
                image.src = "images/record.png"
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

        function playSound(note) {
            synth.triggerAttack(`${note}${4}`, "1");
        }

        function get_key(event){

            let bounds = event.currentTarget.getBoundingClientRect();
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
        function print_mouse_pos(event){
            let bounds = event.currentTarget.getBoundingClientRect();
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
                document.getElementById("number-attempts").textContent = current_attempt+"/3 Versuchen";
            }
        }