let iframe = document.getElementById("iframe")
let mode = sessionStorage.getItem("p1l1mode");
let local_mode = sessionStorage.getItem("local_mode");
const iframeDocument = iframe.contentDocument || iframe.contentWindow.document; // Get the iframe's document


// Get the container elements
const mainContainer = document.getElementById("main-container");
const selectionContainer = document.getElementById("selection");
const audi_button = document.getElementById("audi-button");
const visu_button = document.getElementById("visu-button");
const toggle_button = document.getElementById("toggle-button");

toggle_button.addEventListener("click",function(){
    if(local_mode=="hoeren"){
        toggle_button.textContent = "auditiver Test";
        local_mode = "sehen";
        sessionStorage.setItem("local_mode",local_mode);
    }
    else{
        local_mode = "hoeren";
        toggle_button.textContent = "visueller Test";
        sessionStorage.setItem("local_mode",local_mode);
    }
    load_page("/pages/"+document.body.id+local_mode+sessionStorage.getItem("seed"));
    sessionStorage.removeItem(document.body.id);
},false);
audi_button.addEventListener("click",function(){
    local_mode = "hoeren";
    sessionStorage.setItem("local_mode",local_mode);
    change_scene();
},false)

visu_button.addEventListener("click",function(){
    local_mode = "sehen";
    sessionStorage.setItem("local_mode",local_mode);
    change_scene();
},false)

// Display the appropriate container based on local storage
if (mode) {
    local_mode = mode;
    sessionStorage.setItem("local_mode",mode);
    mainContainer.style.display = "flex";
    selectionContainer.style.display = "none";
    // Additional styling for #main-container
    mainContainer.style.flexDirection = "column";
    mainContainer.style.justifyContent = "center";
    mainContainer.style.alignItems = "center";
    mainContainer.style.height = "100%";
    toggle_button.style.display = "none";
    load_page("/pages/"+document.body.id+local_mode+sessionStorage.getItem("seed"));

}
else if(local_mode){
    mainContainer.style.display = "flex";
    selectionContainer.style.display = "none";
    // Additional styling for #main-container
    mainContainer.style.flexDirection = "column";
    mainContainer.style.justifyContent = "center";
    mainContainer.style.alignItems = "center";
    mainContainer.style.height = "100%";
    toggle_button.style.marginTop = "20px";
    if(local_mode=="hoeren"){
            toggle_button.textContent = "visueller Test";
    }
    else{
        toggle_button.textContent = "auditiver Test";
    }
    load_page("/pages/"+document.body.id+local_mode+sessionStorage.getItem("seed"));

} 
else {
    selectionContainer.style.display = "flex";
    mainContainer.style.display = "none";
    // Additional styling for #selection
    selectionContainer.style.flexDirection = "column";
    selectionContainer.style.justifyContent = "center";
    selectionContainer.style.alignItems = "center";
    selectionContainer.style.height = "70%";

}

function change_scene(){
    if(local_mode==null){
        return;
    }
    mainContainer.style.display = "flex";
        selectionContainer.style.display = "none";
        // Additional styling for #main-container
        mainContainer.style.flexDirection = "column";
        mainContainer.style.justifyContent = "center";
        mainContainer.style.alignItems = "center";
        mainContainer.style.height = "100%";
        toggle_button.style.marginTop = "20px";
        if(local_mode=="hoeren"){
                toggle_button.textContent = "visueller Test";
        }
        else{
            toggle_button.textContent = "auditiver Test";
        }

        load_page("/pages/"+document.body.id+local_mode+sessionStorage.getItem("seed")+".html");;
}

 function load_page(pageUrl){
    // Load the HTML page into the HTML container
            if (pageUrl) {
                fetch(pageUrl)
                .then((response) => response.text())
                .then((html) => {

                     // Clear the existing content by setting the iframe's content to an empty string
                iframe.src = 'about:blank';

                // Load the new HTML content into the iframe
                iframe.srcdoc = html;
                })
                .catch((error) => {
                    console.error('Error loading HTML page:', error);
                });
            }
    }