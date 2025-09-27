let cake_segments = document.getElementsByClassName("cake-container");

// old const: 1/4, 1/8, 1/16
//const centers = [[200,200],[200,200],[200,200]];
//const radiuses = [100,120,80];
//const num_segments = [4,8,16];

// new const: alles 1/8
const centers = [[100,100],[100,100],[100,100],[100,100],[100,100],[100,100]];
const radiuses = [80,80,80,80,80,80];
const num_segments = [8,8,8,8,8,8];
const states = [innit_array(num_segments[0],false),innit_array(num_segments[1],false),innit_array(num_segments[2],false),innit_array(num_segments[3],false),innit_array(num_segments[4],false),innit_array(num_segments[5],false)];

for(let i = 0; i< cake_segments.length;i++){
     // Draw the 8 pieces
     for (var j = 0; j < num_segments[i]; j++) {
        segment(j,centers[i],radiuses[i],num_segments[i],cake_segments[i].getContext('2d'));
        cake_segments[i].getContext('2d').fillStyle = "rgba(44, 163, 203, 1)";
        cake_segments[i].getContext('2d').fill();
        cake_segments[i].getContext('2d').stroke();
      }
  
    cake_segments[i].addEventListener("click",function(event){
        let cur = cake_segment(event,centers[i],radiuses[i],num_segments[i]);
        if(cur==-1){
          return;
        }
        segment(cur,centers[i],radiuses[i],num_segments[i],cake_segments[i].getContext('2d'));
        if(states[i][cur]){
          cake_segments[i].getContext('2d').fillStyle = "rgba(44, 163, 203, 1)";
        }
        else{
            cake_segments[i].getContext('2d').fillStyle = "black";
        }
        states[i][cur] =!states[i][cur];
        cake_segments[i].getContext('2d').fill();
        cake_segments[i].getContext('2d').stroke();
        update_storage();
    
    });
}

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

function innit(){
    zeState = sessionStorage.getItem(document.body.id);
    if(zeState&&zeState!=""){
        for(let i = 0; i<zeState.length;i++){
            for(let j = 0; j<zeState[i];j++){
                segment(j,centers[i],radiuses[i],num_segments[i],cake_segments[i].getContext('2d'));
                states[i][j] = true;
                cake_segments[i].getContext('2d').fillStyle = "black";
                cake_segments[i].getContext('2d').fill();
                cake_segments[i].getContext('2d').stroke();
        
                
            }
        }
    }
}

function update_storage(){
    let final_string = "";
    for(let i = 0;i<states.length;i++){
        let count = 0;
        for(let j = 0;j<states[i].length;j++){
            if(states[i][j]){
                count++;
            }
            

        }
        final_string+=count;
    }
    sessionStorage.setItem(document.body.id,final_string);
}

function segment(i,center_point,radius,num_segments,ctx){
    const angle = (2 * Math.PI) / num_segments;
    ctx.beginPath();
    ctx.moveTo(center_point[0], center_point[1]);
    ctx.lineTo(
      center_point[0] + radius * Math.cos(i * angle-Math.PI/2),
      center_point[1] + radius * Math.sin(i * angle-Math.PI/2)
    );
    ctx.arc(center_point[0], center_point[1], radius, i*angle-Math.PI/2,(i+1)*angle-Math.PI/2);
    ctx.lineTo(
        center_point[0] ,
        center_point[1]
    );
  }
  function cake_segment(event,center_point,radius,num_segments){
    let segment_length = 2*Math.PI/num_segments;
    let bounds = event.currentTarget.getBoundingClientRect();
    let x = event.clientX - bounds.left;
    let y = event.clientY - bounds.top;
    let v = [x-center_point[0],center_point[1]-y];
    if(Math.sqrt(dot_product(v,v))>radius){
        return -1;
    }
    let deg = dot_product([0,1],v)/Math.sqrt(dot_product(v,v));
    deg = Math.acos(deg);
    index = Math.floor(deg/segment_length);
    if(v[0]<=0){
      return (num_segments-1)-index;
    }
    else{
      return index;
    }
}
function dot_product(a,b){
    return a[0]*b[0]+a[1]*b[1];
}

function innit_array(length, value){
    ret = [];
    for(let i = 0; i<length;i++){
      ret.push(value);
    }
    return ret;
  }