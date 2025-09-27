const toolbox_elements = document.getElementsByClassName("image-box");
const taktzeile = document.getElementById("pad-image");
const taktcontainer = document.getElementById("notenlinie");
let selected_tool =  null;
let mouseStoppedTimer;
let cur_highlighted = null;


//configurations for the image hardcoding
const offset_dic = {
    "GanzeNote" : [-12.5,-12.5],
    "GanzeNotePunkt" : [-12.5,-12.5],
    "HalbeNote" : [-25,-50],
    "HalbeNotePunkt" : [-25,-50],
    "ViertelNote" : [-25,-50],
    "ViertelNotePunkt" : [-25,-50],
    "AchtelNote" : [-25,-50],
    "AchtelNotePunkt" : [-25,-50],
    "SechzehntelNote" : [-25,-50],
    "SechzehntelNotePunkt" : [-25,-50],
    "GanzePause" : [-12.5,-9.5],
    "GanzePausePunkt" : [-25,-22],
    "HalbePause" : [-25,-27],
    "HalbePausePunkt" : [-25,-27],
    "ViertelPause" : [-20,-20],
    "ViertelPausePunkt" : [-20,-20],
    "AchtelPause" : [-20,-20],
    "AchtelPausePunkt" : [-20,-20],
    "SechzehntelPause" : [-20,-20],
    "SechzehntelPausePunkt" : [-20,-20]
}
let y_offset = 73;
const note_gap = 35;

let dWidth = 660.0;
let dHeight = 136.0;
// Get the dimensions of the SVG element
var svgRect = taktzeile.getBoundingClientRect();

// Retrieve width and height
var nWidth = svgRect.width;
var nHeight = svgRect.height;


rescale(nWidth,nHeight);


//this array tracks each individual note on the taktzeile
//entry1 -> relative x coordinate, entry2 -> note_type, entry3 -> boolean idicating dotted or not;
let state_array = [];

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


taktcontainer.addEventListener("click",function(e){
    let x = e.clientX -  taktzeile.getBoundingClientRect().left;
    if(selected_tool==null){
        return;
    }
    clear_temporal_points();
    
    let pos = closest_note(x);
    //check if the new note is close to an allready existing note, if this is the case override the existing note with the new note
    //or if the dot tool is selected add a dot to the note instead/ or remove it if its allready dotted.

    if(pos!=-1&&Math.abs(state_array[pos][0]-x)<note_gap){
        document.getElementById("grid-point"+state_array[pos][0]).remove();
        if(state_array[pos][1]==selected_tool){
            state_array.splice(pos,1);  
        }
        else if(selected_tool=="punkt"){
            state_array[pos][2] = !state_array[pos][2];
            
            if(state_array[pos][2]){
                add_note(state_array[pos][1]+"Punkt",state_array[pos][0],false)
            }
            else{
                add_note(state_array[pos][1],state_array[pos][0],false)
            }

        }
        else if(selected_tool=="transparent"){
            state_array.splice(pos,1);
        }
        else{
            state_array[pos][1] = selected_tool;
            state_array[pos][2] = false;
            add_note(selected_tool,state_array[pos][0],false); 
        }
    }
    else{
        if(selected_tool=="punkt"||selected_tool=="transparent"||x<90||x>630){
            return;
        }
        else{
            state_array.push([x,selected_tool,false]);
            add_note(selected_tool,x,false);
        }
    }
    update_storage();

},false);

taktcontainer.addEventListener("mousemove",function(e){
    if(selected_tool==null){
        return;
    }
    clear_temporal_points();
    let x = e.clientX -  taktzeile.getBoundingClientRect().left;
    let pos = closest_note(x);
    if(pos!=-1&&Math.abs(state_array[pos][0]-x)<note_gap){
        const cur = document.getElementById("grid-point"+state_array[pos][0]);
        if(cur == cur_highlighted){
            return;
        }
        else{
            if(cur_highlighted!=null){
                cur_highlighted.classList.remove("selected");
            }
            cur_highlighted = cur;
            cur_highlighted.classList.add("selected");
        }
    }
    else{
        if(cur_highlighted!=null){
            cur_highlighted.classList.remove("selected");
            cur_highlighted = null;
        }
        if(selected_tool!="punkt"&&selected_tool!="transparent"&&x>=90&&x<=630){
            add_note(selected_tool,x,true);
        }
    }

    
},false);

Array.from(toolbox_elements).forEach(ele => {
    ele.addEventListener("click",function(){
        clear_temporal_points();
        if(ele.classList.contains("selected")){
            clear_selected();
            selected_tool = null;
        }
        else{
            clear_selected();
            ele.classList.add("selected");
            selected_tool = ele.id;
        }
    },false);
});

innit();
add_note("ViertelNote",325,true);

function rescale(nWidth,nHeight){
    let height_factor = nHeight/dHeight;
    let width_factor = nWidth/dWidth
    dWidth = nWidth;
    dHeight = nHeight;


    y_offset *= height_factor;
}

function clear_selected(){
    const selecteds = document.getElementsByClassName("selected");
    Array.from(selecteds).forEach(ele=>{
        ele.classList.remove("selected");
    });
}
//takes as input the relative x coordinate of the mouse and outputs the index of the closest note in the state array
//if the state array is empty -1 is returned
function closest_note(x){
    if(state_array.length == 0){
        return -1;
    }
    
    min = 0;
    for(let i = 1; i<state_array.length;i++){
        if(Math.abs(state_array[min][0]-x)>Math.abs(state_array[i][0]-x)){
            min = i;
        }
    }
    return min;
}
function clear_temporal_points(){
    const elements = document.getElementsByClassName("temp-point");
    for(let i = 0;i<elements.length;i++){
        elements[i].remove();
    }
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
function update_storage(){
    let ret = "";
    state_array.sort((a,b)=>a[0]-b[0]);
    state_array.forEach(ele=>{
        ret+=ele[1];
        if(ele[2]){
            ret += "Punkt"
        }
        ret+= " ";
    
    })
    sessionStorage.setItem(document.body.id,ret.trim());
}
function innit(){
    state = sessionStorage.getItem(document.body.id);
    if(state == null||state==""){
        return;
    }
    notes = state.split(/\s+/);
    let x = 300;
    notes.forEach(element =>{
        add_note(element,x,false);
        let cur = [x];
        x += 50;
        if(element.endsWith("Punkt")){
            cur.push(element.slice(0,-5));
            cur.push(true);
            
        }
        else{
            cur.push(element);
            cur.push(false);
        }
        state_array.push(cur);
       
    });
}

function add_note(image_name,x,is_temporal){
    //image x offset
    const imageContainer = taktcontainer;
    const parentImage = taktzeile;
    const image_offset = offset_dic[image_name];
    const img_x_offset = image_offset[0];
    const img_y_offset = image_offset[1];
    const image = document.createElement("img");
    image.draggable = false;
    taktcontainer.appendChild(image);
    image.alt = "note symbol";
    image.src = "images/"+image_name+".png";
    image.id = "grid-point"+x;
    if(is_temporal){
        image.classList.add("temp-point");
    }
    image.draggable = false;
    image.classList.add(image_name);
    //image.setAttribute("style","position: absolute;left: "+(x+img_x_offset)+"px;top: "+(y_offset+img_y_offset)+"px;");

     // Calculate the position relative to the imageContainer
     const parentImageRect = parentImage.getBoundingClientRect();
     const containerRect = imageContainer.getBoundingClientRect();


     // Calculate the position relative to the parent image
     const left = x + Math.abs(parentImageRect.left - containerRect.left) + imageContainer.scrollLeft+img_x_offset;
     const top = y_offset+ Math.abs(parentImageRect.top - containerRect.top) + imageContainer.scrollTop+img_y_offset;

     console.log(left,top)

     image.setAttribute("style","position: absolute;left: "+left+"px;top: "+top+"px;")



     imageContainer.appendChild(image);

}