let points = points_parse();
let selected = null;
let dWidth = 1040.0;
let dHeight = 160.0;
var pad_image = document.getElementById("noten");
let mouseStoppedTimer;
// Get the dimensions of the SVG element
var svgRect = pad_image.getBoundingClientRect();
    
// Retrieve width and height
var nWidth = svgRect.width;
var nHeight = svgRect.height;


rescale(nWidth,nHeight,points);





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



const image_container = document.getElementById("image-container");
const noten =  document.getElementById("noten");
image_container.addEventListener("mousemove",function(event){
    print_mouse_pos(event,pad_image);
},false);
image_container.addEventListener("click", function(event){
    document.getElementById("continue-text").style.visibility = "visible";
    let bounds = noten.getBoundingClientRect();
    let x = event.clientX - bounds.left;
    let y = event.clientY - bounds.top;
    let pos = closest_point(x,y);

    if(selected==pos){
        document.getElementById("grid-point"+pos).remove();
        sessionStorage.setItem(document.body.id,"");
        selected = null;
    }
    else{
        clear_markers();
        selected = pos;
        add_marker();
        sessionStorage.setItem(document.body.id,selected);

    }

},false);
innit();

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

function points_parse(){
    let point_codes = document.body.getAttribute("points").split(" ");
    let ret = [];
    point_codes.forEach(x =>{ret.push(x.split(","))});
    return ret; 
}

function rescale(nWidth,nHeight,points){
    let width_factor = nWidth/dWidth;
    let hight_factor = nHeight/dHeight;
    dWidth = nWidth;
    dHeight = nHeight;

    for(let i = 0; i<points.length;i++){
        points[i][0] *= width_factor;
        points[i][1] *= hight_factor;
    }
}
function clear_markers(){
    let markers = document.getElementsByClassName("dot");
    for(let i = 0; i<markers.length;i++){
        markers[i].remove();
    }
}

function innit(){
    const state = sessionStorage.getItem(document.body.id)
    if(state!=null&&state!=""){
        selected = state;
        add_marker()
    }
}

function add_marker(){const point = points[selected];
    const point_width = 40;
    const point_height = 40;
    const imageContainer = image_container;
    const parentImage = noten;
    
    const image = document.createElement("div");
    image.className = "dot"; // Apply the same class as the overlay image
    image.id = "grid-point" + selected;
    image.draggable = false;

    // Calculate the position relative to the imageContainer
    const parentImageRect = parentImage.getBoundingClientRect();
    const containerRect = imageContainer.getBoundingClientRect();

    
    // Calculate the position relative to the parent image
    const left = point[0] + Math.abs(parentImageRect.left - containerRect.left) + imageContainer.scrollLeft-point_width/2;
    const top = point[1] + Math.abs(parentImageRect.top - containerRect.top) + imageContainer.scrollTop-point_height/2;

    image.setAttribute("style","position: absolute;left: "+left+"px;top: "+top+"px;")
    
   
    
    imageContainer.appendChild(image);

}

function closest_point(x,y){
    let min = 0;
    for(let i = 1; i<points.length;i++){
        if(taxicab_distance([x,y],points[i])<taxicab_distance([x,y],points[min])){
            min = i;
        }

    }
    return min;
}
function taxicab_distance(p1,p2){
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1])
}