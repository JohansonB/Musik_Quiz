
        
        //keyboard_code
        let mouseStoppedTimer;
        const titel = document.getElementById("piano-container");
        let white_x = 119.5;
        let black_y = 250;
        let balck_x = 53;
        let offset_x = 4;

        let dWidthKeyboard = 840.0;
        let dHeightKeyboard = 374.0;

        var keyboardPad_image = document.getElementById("keyboard");
        // Get the dimensions of the SVG element
        var svgRect = keyboardPad_image.getBoundingClientRect();
    
        // Retrieve width and height
        var nWidth = svgRect.width;
        var nHeight = svgRect.height;


        rescale_keyboard(nWidth,nHeight);


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
        const piano = document.getElementById("keyboard-image-wrapper");

        // Create a Recorder instance from Tone.js
        const recorder = new Tone.Recorder();


        // Connect the recorder to the synth
        synth.connect(recorder);

        const helpButton = document.getElementById("help-button");
        const popupContainer = document.getElementById("popup-container");
        const closeButton = document.getElementById("close-button");
        const popupText = document.getElementById("popup-text");
        const counterEle = document.getElementById("counter");
    
            
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
        const num_notes = 8;
        const num_tones = 12;

        let dILeftOffset = 120;
        let dITopOffset = 69.5;
        let dIheightDiff = 9;
        let dIWidthDif = 120;

        let dDLeftOffset = 130;
        let dDTopOffset = 11.13;
        let dDheightDiff = 8.87;
        let dDWidthDif = 120;

        let dWidthNoten = 1167.13;
        let dHeightNoten = 134.78;

        var notenPad_image = document.getElementById("pad-image");
        // Get the dimensions of the SVG element
        var svgRect = notenPad_image.getBoundingClientRect();
    
        // Retrieve width and height
        var nWidth = svgRect.width;
        var nHeight = svgRect.height;


        rescale_noten(nWidth,nHeight);


         const grid = function(leftOffset, topOffset, heightDiff, widthDiff){
                    let outerArr = [];
                    for(let i = 0; i<num_tones;i++){
                        let innerArr = [];
                        for(let j = 0; j<num_notes;j++){
                            let x = leftOffset+j*widthDiff;
                            let y = topOffset+i*heightDiff;
                            innerArr.push([x,y]);
                        }
                        outerArr.push(innerArr);
                    }
                    return outerArr;
                }

                const overlayImage = new Image();
                overlayImage.src = "images/ViertelNote.png";
                overlayImage.className = "overlay-image"; // Add a class name for styling
                const zeImageGrid = grid(dILeftOffset,dITopOffset,dIheightDiff,dIWidthDif);
                const zeGrid = grid(dDLeftOffset,dDTopOffset,dDheightDiff,dDWidthDif)

                const state = initialize2DArray(12,8,false);




                const notenZeile = document.getElementById("noten-container");




         //programm state logic
         let state_flag = false;
         let toggle_button = document.getElementById("advance-button");
         const required_length = 8;


         toggle_button.addEventListener("click",function(){
             if(!recording&&legal(cur_length)&&!state_flag){
                state_flag = true;
                document.getElementById("upper-row").style.visibility = "visible";
                notenZeile.addEventListener("click", notenZeileClick,false);
                notenZeile.addEventListener("mousemove",notenZeileMouseMove,false);
                place_holder.removeEventListener("click",recordClick);
                piano.removeEventListener("click",pianoClick);
                toggle_button.textContent = "Level Neustart";
             }
             else if(state_flag){
                window.location.href = window.location.href;
             }
         })
         document.addEventListener("DOMContentLoaded", function() {
            toggle_button.style.visibility = "hidden"
          });
         


        innit_reset();

//Control flow functions
         function legal(played_length){
            return played_length==required_length
         }

        
//keyboard functions
  function rescale_keyboard(nWidth,nHeight){
            let width_factor = nWidth/dWidthKeyboard;
            let height_factor = nHeight/dHeightKeyboard;
            dWidthKeyboard = nWidth;
            dHeightKeyboard = nHeight;

            white_x *= width_factor;
            black_y *= height_factor;
            balck_x *= width_factor;
            offset_x *= width_factor;

           
    }
    function add_marker(x,y){
        const dot_width = 12;

        const imageContainer = document.getElementById("keyboard-image-wrapper");
        const parentImage = keyboardPad_image;
        const parentImageRect = parentImage.getBoundingClientRect();
        const containerRect = imageContainer.getBoundingClientRect();

        var xShift = Math.abs(parentImageRect.left - containerRect.left) + imageContainer.scrollLeft;
        var yShift = Math.abs(parentImageRect.top - containerRect.top) + imageContainer.scrollTop;

        let relative_x = (x-offset_x)%white_x;
        let black = is_black(x,y);
        let count = Math.floor((x-offset_x) / white_x);

        const image = document.createElement("div");
        imageContainer.appendChild(image);
        image.className = "dot"; // Apply the same class as the overlay image
        image.id = "marker";
        image.draggable = false;

        if(black==-1){
            image.setAttribute("style","position: absolute;left: "+(offset_x+count*white_x+white_x/2-dot_width/2+xShift)+"px;top: "+1.05*(black_y+yShift)+"px;")
        }
        else{
            image.setAttribute("style","position: absolute;left: "+(offset_x+(black+1)*white_x-dot_width/2+xShift)+"px;top: "+(0.75*black_y+yShift)+"px;")
        }

    }    
         async function pianoClick(e) {
            let bounds = keyboardPad_image.getBoundingClientRect();
            let x = e.clientX - bounds.left;
            let y = e.clientY - bounds.top;
            if(x-offset_x<0||x>=bounds.width-offset_x){
                return;
            }
            let played = get_key(e);

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
            counterEle.textContent = length_count+1+"/8";
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
                counterEle.style.visibility = "hidden";
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
                image.src = "images/record.PNG"
                image.id = "record";
                if(legal(cur_length)){
                    toggle_button.style.visibility = "visible";
                    toggle_button.click();
                }
            }
            else{
                counterEle.textContent = "0/8";
                counterEle.style.visibility = "visible";
                toggle_button.style.visibility = "hidden";
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

            let bounds = keyboardPad_image.getBoundingClientRect();
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
        function print_mouse_pos(event,reference){
            let bounds = reference.getBoundingClientRect();
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
        function rescale_noten(nWidth,nHeight){
            let width_factor = nWidth/dWidthNoten;
            let height_factor = nHeight/dHeightNoten;
            dWidthNoten = nWidth;
            dHeightNoten = nHeight;

            dILeftOffset *= width_factor;
            dITopOffset *= height_factor;
            dIheightDiff *= height_factor;
            dIWidthDif *= width_factor;

            dDLeftOffset *= width_factor;
            dDTopOffset *= height_factor;
            dDheightDiff *= height_factor;
            dDWidthDif *= width_factor;
        }   

        function notenZeileMouseMove(event){
            let bounds = notenPad_image.getBoundingClientRect();
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
            let bounds = notenPad_image.getBoundingClientRect();
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
            const noteContainer = document.getElementById("noten-container");
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
                    const imageContainer = document.getElementById("noten-container");
                    const parentImage = document.getElementById("pad-image");
                    const point = zeGrid[row][col];
                    const image = document.createElement("div");
                    image.className = "dot"; // Apply the same class as the overlay image
                    image.id = ("grid-point"+row)+"-"+col;

                    // Calculate the position relative to the imageContainer
                    const parentImageRect = parentImage.getBoundingClientRect();
                    const containerRect = imageContainer.getBoundingClientRect();

            
                    // Calculate the position relative to the parent image
                    const left = point[0] + Math.abs(parentImageRect.left - containerRect.left) + imageContainer.scrollLeft;
                    const top = point[1] + Math.abs(parentImageRect.top - containerRect.top) + imageContainer.scrollTop;

                    image.setAttribute("style","position: absolute;left: "+left+"px;top: "+top+"px;")
            
           
            
                    imageContainer.appendChild(image);
                }
                function add_note_image(row,col,zeGrid){
                    //image x offset
                    const x_offset = -10;
                    const y_offset = -35;
                    const imageContainer = document.getElementById("noten-container");
                    const parentImage = document.getElementById("pad-image");
                    const point = zeGrid[row][col];
                    const image = document.createElement("img");
                    image.alt = "note symbol";
                    image.draggable = false;
                    if(row+1 == num_tones){
                        image.src = "images/ViertelNoteStrich.png"
                    }
                    else{
                        image.src = "images/ViertelNote.png"
                    }
                    image.classList.add("overlay-image");
                    image.id = ("grid-point"+row)+"-"+col;

                    // Calculate the position relative to the imageContainer
                    const parentImageRect = parentImage.getBoundingClientRect();
                    const containerRect = imageContainer.getBoundingClientRect();

            
                    // Calculate the position relative to the parent image
                    const left = point[0] + Math.abs(parentImageRect.left - containerRect.left) + imageContainer.scrollLeft+x_offset;
                    const top = point[1] + Math.abs(parentImageRect.top - containerRect.top) + imageContainer.scrollTop+y_offset-2;

                    // Apply CSS styling
                    image.style.position = "absolute";
                    image.style.left = left + "px";
                    image.style.top = top + "px";

           
            
                    imageContainer.appendChild(image);


                }
                function add_temporal_note(row,col,zeGrid){
                    const imageContainer = document.getElementById("noten-container");
                    const parentImage = document.getElementById("pad-image");
                    const point = zeGrid[row][col];
                    const image = document.createElement("img");
                    const width = 48;
                    const height = 54;  
                    if(row+1 == num_tones){
                        image.src = "images/ViertelNoteStrich.png"
                    }
                    else{
                        image.src = "images/ViertelNote.png"
                    } 
                    image.draggable = false;                 
                    image.className = "temporal-dot"; // Apply the same class as the overlay image
                    image.id = ("temporal-grid-point"+row)+"-"+col;
                    image.classList.add("temp-point");

                     // Calculate the position relative to the imageContainer
                     const parentImageRect = parentImage.getBoundingClientRect();
                     const containerRect = imageContainer.getBoundingClientRect();
 
             
                     // Calculate the position relative to the parent image
                     const left = point[0] + Math.abs(parentImageRect.left - containerRect.left) + imageContainer.scrollLeft-width/2+13;
                     const top = point[1] + Math.abs(parentImageRect.top - containerRect.top) + imageContainer.scrollTop-height/4*3;
 
                     image.setAttribute("style","position: absolute;left: "+left+"px;top: "+top+"px;")
             
            
             
                     imageContainer.appendChild(image); 

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