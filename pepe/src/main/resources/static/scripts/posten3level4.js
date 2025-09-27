const toolbox_elements = document.getElementsByClassName("image-box");
const noten_container = document.getElementById("noten");
const pad_image = document.getElementById("pad-image");

let x_offset = 130;
let y_offset = 67;
let y_step = 12.5;
const max_index = 12;

let dWidth = 300.0;
let dHeight = 240.0;
// Get the dimensions of the SVG element
var svgRect = pad_image.getBoundingClientRect();

// Retrieve width and height
var nWidth = svgRect.width;
var nHeight = svgRect.height;


rescale(nWidth,nHeight);

//index of the pressed note 
let selected_tool = "normal";
let state = -1;

let state_type = null;


Array.from(toolbox_elements).forEach(ele => {
    ele.addEventListener("click",function(){
        if(ele.classList.contains("selected")){
            return;
        }
        else{
            clear_selected();
            ele.classList.add("selected");
            selected_tool = ele.id;
        }
    },false);
});

noten_container.addEventListener("click",function(event){
    if(selected_tool==null||event.clientX - pad_image.getBoundingClientRect().left>x_offset+150){
        return;
    }
    let y = event.clientY - pad_image.getBoundingClientRect().top;;
    let index = closest_note(y);
    if(index == -1){
        return;
    }
    clear_temporal_points();
    if(index == state&&selected_tool==state_type){
        state = -1;
        state_type = null;
        document.getElementById(note_id(index)).remove();
        sessionStorage.setItem(document.body.id,"");

    }
    else{
        if(state != -1){
            document.getElementById(note_id(state)).remove();
        }
        add_note_image(index,selected_tool,false);
        state = index;
        state_type = selected_tool;
        sessionStorage.setItem(document.body.id,state+selected_tool);
    }
});

noten_container.addEventListener("mousemove",function(event){

    let y = event.clientY - pad_image.getBoundingClientRect().top;
    let index = closest_note(y)
    if(index == -1){
        return;
    }
    let zeElement = document.getElementById("temporal-"+note_id(index));
    clear_temporal_points();
    if(zeElement==null){
        add_note_image(index,selected_tool,true);
    }




},false);

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

innit();

function rescale(nWidth,nHeight,points){
    let width_factor = nWidth/dWidth;
    let hight_factor = nHeight/dHeight;
    dWidth = nWidth;
    dHeight = nHeight;

    x_offset *= width_factor;
    y_offset *= hight_factor;
    y_step *= hight_factor;

}

//takes as input the relative y coordinate of the mouse and outputs the index of the closest note in the state array
//if the state array is empty -1 is returned
function closest_note(y){
    index = ((y-y_offset)/y_step) | 0;
    if(index >max_index||index<0){
        return-1;
    }
    return index;
}
function note_id(index){
    return "grid-point"+index;
}
function y_value(index){
    return index*y_step+y_offset;
}

function clear_temporal_points(){
    const elements = document.getElementsByClassName("temporal");
    for(let i = 0;i<elements.length;i++){
        elements[i].remove();
    }
}
function add_note_image(index,tool,is_temporal){
    const imageContainer = noten_container;
    const parentImage = pad_image;
    const note_x_offset = -45+15;
    const note_y_offset = -43-17;
    const image = document.createElement("img");
    image.alt = "note symbol";
    let path = "";
    if(tool=="hashtag"){
        //hashtagnotenpath
        path += "images/p3Viertelhashtag"
    }
    else if(tool=="b"){
        //b notenpath
        path += "images/p3Viertelb"
    }
    else{
        path += "images/p3Viertel";
    }
    if(index == 0||index == 12){
        path += "C";
    }
    path += ".png"
    image.src = path;
    image.draggable = false;
    if(is_temporal){
        image.classList.add("temporal");
    }
    image.id = note_id(index);
    //image.setAttribute("style","position: absolute;left: "+(x_offset+note_x_offset)+"px;top: "+(y_value(index)+note_y_offset)+"px;");
     // Calculate the position relative to the imageContainer
     const parentImageRect = parentImage.getBoundingClientRect();
     const containerRect = imageContainer.getBoundingClientRect();


     // Calculate the position relative to the parent image
     const left = x_offset + Math.abs(parentImageRect.left - containerRect.left) + imageContainer.scrollLeft+note_x_offset;
     const top = y_value(index)+ Math.abs(parentImageRect.top - containerRect.top) + imageContainer.scrollTop+note_y_offset;
     image.classList.add("note");

     image.setAttribute("style","position: absolute;left: "+left+"px;top: "+top+"px;")



     imageContainer.appendChild(image);

}

function add_temporal_note(index){
    const imageContainer = noten_container;
    const parentImage = pad_image;
    const image = document.createElement("div");
    image.className = "temporal-dot"; // Apply the same class as the overlay image
    image.id = "temporal-grid-point"+index;
    image.classList.add("temp-point");
    //image.setAttribute("style","position: absolute;left: "+x_offset+"px;top: "+y_value(index)+"px;");
    // Calculate the position relative to the imageContainer
    const parentImageRect = parentImage.getBoundingClientRect();
    const containerRect = imageContainer.getBoundingClientRect();


    // Calculate the position relative to the parent image
    const left = x_offset + Math.abs(parentImageRect.left - containerRect.left) + imageContainer.scrollLeft;
    const top = y_value(index)+ Math.abs(parentImageRect.top - containerRect.top) + imageContainer.scrollTop ;

    image.setAttribute("style","position: absolute;left: "+left+"px;top: "+top+"px;")



    imageContainer.appendChild(image);

}

function update_storage(){
    sessionStorage.setItem(document.body.id, state);
}
function innit(){
    const zeState = sessionStorage.getItem(document.body.id);
    if(zeState!=null&&zeState!=""){
        const integerPart = parseInt(zeState, 10);
        const stringWithoutInteger = zeState.substring(String(integerPart).length);
        let selected = integerPart;
        let tool = stringWithoutInteger
       add_note_image(selected,tool,false);
       state = selected;
       state_type = tool;
    }
}

function clear_selected(){
    const selecteds = document.getElementsByClassName("selected");
    Array.from(selecteds).forEach(ele=>{
        ele.classList.remove("selected");
    });
}

