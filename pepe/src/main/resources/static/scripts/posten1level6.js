
        
        //keyboard_code
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
        let length_count = 0;
        let cur_length = 0;
        let audio_recording = null;

        const pianoSound = document.getElementById("pianoSound");
        const helpButton = document.getElementById("help-button");
        const piano = document.getElementById("keyboard");

        // Create a Recorder instance from Tone.js
        const recorder = new Tone.Recorder();

        // Connect the recorder to the synth
        synth.connect(recorder);


        helpButton.addEventListener("click", function() {
            alert("This is the help message. You can provide instructions or information here.");
        });
        piano.addEventListener("click", pianoClick, false);

        const place_holder = document.getElementById("place-holder");
        place_holder.addEventListener("click",recordClick, false);


        const audio = document.getElementById("recording")
        const speaker = document.getElementById("loudspeaker");
        speaker.addEventListener("click",function(){
            if(recording||cur_length==0){
                return;
            }
            audio.play();
        })

        //notenzeile Code

         const grid = function(leftOffset, topOffset, heightDiff, widthDiff){
                    let outerArr = [];
                    for(let i = 0; i<12;i++){
                        let innerArr = [];
                        for(let j = 0; j<8;j++){
                            let x = leftOffset+j*widthDiff;
                            let y = topOffset+i*heightDiff;
                            innerArr.push([x,y]);
                        }
                        outerArr.push(innerArr);
                    }
                    return outerArr;
                }

                const overlayImage = new Image();
                overlayImage.src = "images/note50.png";
                overlayImage.className = "overlay-image"; // Add a class name for styling
                const zeImageGrid = grid(120,12.5,15.5,60);
                const zeGrid = grid(130,73,15.5,60)

                const state = initialize2DArray(12,8,false);




                const notenZeile = document.getElementById("note-container")




         //programm state logic
         let state_flag = false;
         let toggle_button = document.getElementById("advance-button");
         const required_length = 8;


         toggle_button.addEventListener("click",function(){
             if(!recording&&legal(cur_length)&&!state_flag){
                state_flag = true;
                notenZeile.addEventListener("click", notenZeileClick,false);
                notenZeile.addEventListener("mousemove",notenZeileMouseMove,false);
                place_holder.removeEventListener("click",recordClick);
                piano.removeEventListener("click",pianoClick);
             }
         })


        innit_reset();

//Control flow functions
         function legal(played_length){
            return played_length==required_length
         }

        
//keyboard functions
         async function pianoClick(e) {
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
            if(recording&&++length_count>=required_length){
                // Disable user interaction
                document.body.style.pointerEvents = "none";
                await new Promise(resolve => setTimeout(resolve, 500));
                document.body.style.pointerEvents = "auto";

                place_holder.click();

            }
        }
        async function recordClick(e){
            if(recording){
                cur_length = length_count;
                length_count = 0;
                let recording_obj = await recorder.stop();
                audio.src = URL.createObjectURL(recording_obj);
                // Store the Blob in local storage
                localStorage.setItem('recording_obj', JSON.stringify(recording_obj));
                recording = false;
                if(sessionStorage.getItem(document.body.id)!=null){
                    sessionStorage.setItem(document.body.id,sessionStorage.getItem(document.body.id)+" ");
                }
                document.getElementById("stop").remove();
                const image = document.createElement("img");
                place_holder.appendChild(image);
                image.alt = "record";
                image.src = "images/record.png"
                image.id = "record";
            }
            else{
                sessionStorage.setItem(document.body.id,"");
                recorder.start();
                recording = true;
                document.getElementById("record").remove();
                const image = document.createElement("img");
                place_holder.appendChild(image);
                image.alt = "stop";
                image.src = "images/stop.png"
                image.id = "stop";
               

            }

        }
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

        function innit_reset(){
            sessionStorage.setItem(document.body.id,"");
        }

        function innit_reload(){
            const zeState = sessionStorage.getItem(document.body.id);
            const recording_obj = sessionStorage.getItem("recording_obj")
            if(zeState!=null){
                let spliter = zeState.trim().split(/\s+/);
                if(spliter.length>1){
                    note_array = spliter[1].split(",");
                    cur_length = required_length;
                    toggle_button.click();
                    for(let i = 0; i<note_array.length;i++){
                        if(note_array[i]!="-1"){
                            state[note_array[i]][i] = true;
                            add_note_image(note_array[i],i,zeGrid);
                        }
                    }

                }
                else if(spliter.length==1){
                    cur_length = piece_length(spliter[0])

                }
            }
            if(recording_obj!=null){

                audio.src = URL.createObjectURL(recording_obj);;
            }
        }
        function piece_length(seq){
            let count = 0;
            for(let i = 0; i<seq.length;i++){
                if(seq[i]!="#"){
                    count++;
                }
            }
            return count;
        }

        //notenZeile Functions

        function notenZeileMouseMove(event){
            let bounds = event.currentTarget.getBoundingClientRect();
            let x = event.clientX - bounds.left;
            let y = event.clientY - bounds.top;
            let pos = getTargetSlot(x,y,zeGrid);
            let zeElement = document.getElementById(("temporal-grid-point"+pos[0])+"-"+pos[1]);
            if(state[pos[0]][pos[1]]){
                clear_temporal_points();
            }
            else if(zeElement==null){
                clear_temporal_points();
                add_temporal_note(pos[0],pos[1],zeGrid);

            }


        }

        function notenZeileClick(event){
            let bounds = event.currentTarget.getBoundingClientRect();
            let x = event.clientX - bounds.left;
            let y = event.clientY - bounds.top;
            let pos = getTargetSlot(x,y,zeGrid);
            clear_temporal_points();
            if(state[pos[0]][pos[1]]){
                state[pos[0]][pos[1]] = false;
                document.getElementById(("grid-point"+pos[0])+"-"+pos[1]).remove();
            }
            else{
                clear_column(pos[1],state);
                state[pos[0]][pos[1]] = true;
                add_note_image(pos[0],pos[1],zeGrid);

            }
            update_storage_notenZeile();
        }

        function update_storage_notenZeile(){
            const zeState = sessionStorage.getItem(document.body.id);
            let sections = zeState.trim().split(/\s+/);
            let keeper = sections[0];
            
            let arr = [-1,-1,-1,-1,-1,-1,-1,-1];
            const noteContainer = document.getElementById("note-container");
            for (const element of noteContainer.children) {
                if(element.id.substring(0,10)=="grid-point"){
                    const remainder = element.id.substring(10); // Get the remainder of the string after the first 10 characters
                    const splitArray = remainder.split('-'); // Split the remainder by "-"
                    arr[splitArray[1]] = splitArray[0];
                }

            }
            let final_string = "";
            arr.forEach(element => {
                if(final_string==""){
                    final_string+=element;
                }
                else{
                    final_string = final_string+","+element;
                }
            });
            sessionStorage.setItem(document.body.id, keeper+" "+final_string);
        }


         function addAbsolutePositionGrid(){
                    for (let i = 0; i < zeGrid.length; i++) {
                        for (let j = 0; j < zeGrid[i].length; j++) {
                            add_note(i,j,zeGrid);
                        }
                    }

                }
                //this function takes as input a klick coordinate and a 2d grid and returns the indices of the closest grid-element
                function getTargetSlot(x,y,grid){
                    let lastX = grid[0][0][0];
                    let lastY = grid[0][0][1];
                    let retI;
                    let retJ;
                    for(let i = 1; i<grid.length;i++){
                        let curY = grid[i][0][1];
                        if(curY>=y){
                            if(curY-y<y-lastY){
                                retI = i;

                            }
                            else{
                                retI = i-1;
                            }
                            break;
                        }
                        if(i == grid.length-1){
                            retI = i;
                        }
                        lastY = curY;
                    }
                    for(let i = 1; i<grid[0].length;i++){
                        let curX = grid[0][i][0];
                        if(curX>=x){
                            if(curX-x<x-lastX){
                                retJ = i;

                            }
                            else{
                                retJ = i-1;
                            }
                            break;
                        }
                        if(i == grid[0].length-1){
                            retJ = i;
                        }
                        lastX = curX;
                    }
                    return [retI,retJ];
                }
                function add_note(row,col,zeGrid){
                    const point = zeGrid[row][col];
                        const image = document.createElement("div");
                        document.getElementById("note-container").appendChild(image);
                        image.className = "dot"; // Apply the same class as the overlay image
                        image.id = ("grid-point"+row)+"-"+col;
                        image.setAttribute("style","position: absolute;left: "+point[0]+"px;top: "+point[1]+"px;");

                }
                function add_note_image(row,col,zeGrid){
                    //image x offset
                    const x_offset = -10;
                    const y_offset = -55;
                    const point = zeGrid[row][col];
                    const image = document.createElement("img");
                    document.getElementById("note-container").appendChild(image);
                    image.alt = "note symbol";
                    image.src = "images/note50.png"
                    image.id = ("grid-point"+row)+"-"+col;
                    image.setAttribute("style","position: absolute;left: "+(point[0]+x_offset)+"px;top: "+(point[1]+y_offset)+"px;");


                }
                function add_temporal_note(row,col,zeGrid){
                    const point = zeGrid[row][col];
                        const image = document.createElement("div");
                        document.getElementById("note-container").appendChild(image);
                        image.className = "temporal-dot"; // Apply the same class as the overlay image
                        image.id = ("temporal-grid-point"+row)+"-"+col;
                        image.classList.add("temp-point");
                        image.setAttribute("style","position: absolute;left: "+point[0]+"px;top: "+point[1]+"px;");

                }

                function initialize2DArray(rows, cols, value) {
                    const array2D = [];
                    for (let i = 0; i < rows; i++) {
                        const innerArray = [];
                        for (let j = 0; j < cols; j++) {
                            innerArray.push(value);
                        }
                        array2D.push(innerArray);
                    }
                    return array2D;
                }
                function clear_column(col,state){
                    for(let i = 0; i<state.length;i++){
                        if(state[i][col]){
                            state[i][col] = false;
                            document.getElementById(("grid-point"+i)+"-"+col).remove();
                        }
                    }
                }
                function clear_temporal_points(){
                    const elements = document.getElementsByClassName("temp-point");
                    for(let i = 0;i<elements.length;i++){
                        elements[i].remove();
                    }
                }