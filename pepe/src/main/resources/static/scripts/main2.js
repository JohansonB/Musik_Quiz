let count = sessionStorage.getItem("count");
if(count==null){
    count = 0;
}
let countEle = document.getElementById("count");
let iframe = document.getElementById("iframe-container");
let commit_button = document.getElementById("commit-button");
let sequence = sessionStorage.getItem("sequence").trim().split(/\s+/);
let cur_id = sequence[count];
let popupContainer = document.getElementById("popup-container");
let NEIN_button = document.getElementById("NEIN-button");
let JA_button = document
.getElementById("JA-button");
const tot_questions = 72;




if(count==sequence.length||cur_id==""){
    window.location.href = "/final";
}
else{
    update_countEle();
    if(cur_id.includes("posten1level1")){
        const lastTwoChars = cur_id.slice(-2); // Get the last two characters
        const originalStringWithoutLastTwoChars = cur_id.slice(0, -2); // Remove the last two characters
        sessionStorage.setItem("seed",lastTwoChars);
        load_page("pages/"+originalStringWithoutLastTwoChars+".html");
    }
    else{
        load_page("pages/"+cur_id+".html");
    }
}
// Add click event listeners to each list element
commit_button.addEventListener('click', (event) => {
    if(!interacted()){
        popupContainer.style.display = "flex";
    }
    else{
        commit();
    }
});
NEIN_button.addEventListener("click",()=>{
    popupContainer.style.display = "none";
});
JA_button.addEventListener("click",()=>{
    commit();
    popupContainer.style.display = "none";
});
function update_countEle(){
    countEle.textContent = get_index()+"/"+tot_questions;
}

function get_index(){
    return tot_questions-sequence.length+count;
}

function interacted(){
    if(cur_id.includes("posten3level5")||cur_id.includes("posten3level6")){
        const iframeContentWindow = iframe.contentWindow;

        // Access the input element within the iframe
        const iframeText = iframeContentWindow.document.getElementById("myTextField");

        // Access the canvas content URL using toDataURL()
        const text = iframeText.value;
        return text!=null&&text!="";
    }
    return sessionStorage.getItem(get_cur_id())!=null&&sessionStorage.getItem(get_cur_id());
}

function get_cur_id(){
    if(cur_id.includes("posten1level1")){
        if(sessionStorage.getItem("local_mode")==null){
            return "posten1level1hoeren"+sessionStorage.getItem("seed");
        }
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const nested_frame = iframeDocument.getElementById("iframe"); // Get the iframe's document
        const nestediframeDocument = nested_frame.contentDocument || nested_frame.contentWindow.document;
        return nestediframeDocument.body.id;
        
    }
    else{
        return cur_id;
    }
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
        iframe.srcdoc = html;})
        .catch((error) => {
            console.error('Error loading HTML page:', error);});
    }
}
function commit(){
    if(cur_id.includes("posten1level1")){
        let mode = sessionStorage.getItem("local_mode");
        if(mode==null){
            mode = "hoeren";
            sessionStorage.setItem("p1l1mode",mode);
             location.reload();
             return;
        }
        sessionStorage.setItem("p1l1mode",mode);
        let dic = {};
        dic["p1l1mode"] = mode;
        send_single_state(get_cur_id(),dic);
    }
    else if(cur_id.includes("posten3level1")){
        const iframeContentWindow = iframe.contentWindow;
    
        // Access the canvas element within the iframe
        const iframeCanvas = iframeContentWindow.document.getElementById("canvas");
    
        if (iframeCanvas) {
            // Access the canvas content URL using toDataURL()
            const canvasDataURL = iframeCanvas.toDataURL("image/png");
    
            sessionStorage.setItem(cur_id,canvasDataURL);
            send_single_state(cur_id,null);
    
        }
        else {
             console.log("Canvas element not found in the iframe.");
            return;
        }
    }
    else if(cur_id.includes("posten3level5")||cur_id.includes("posten3level6")){
        const iframeContentWindow = iframe.contentWindow;
    
        // Access the input element within the iframe
        const iframeText = iframeContentWindow.document.getElementById("myTextField");

        // Access the canvas content URL using toDataURL()
        const text = iframeText.value;
    
        sessionStorage.setItem(cur_id,text);
        send_single_state(cur_id,null);
    
    
    }
    else{
        // Get the clicked list item's ID
        send_single_state(cur_id,null);
    }
    if(count+1==sequence.length){
        window.location.href = "/final";
        return;
    }
    cur_id = sequence[++count];
    sessionStorage.setItem("count",count);
    let pageUrl;
    
    if(cur_id.includes("posten1level1")){
        const lastTwoChars = cur_id.slice(-2); // Get the last two characters
        const originalStringWithoutLastTwoChars = cur_id.slice(0, -2); // Remove the last two characters
        sessionStorage.setItem("seed",lastTwoChars);
        pageUrl = "pages/"+originalStringWithoutLastTwoChars+".html";
    }
    else{
        // Get the HTML page URL based on the clicked item's ID
        pageUrl = '/pages/'+cur_id+".html";
    }
    update_countEle();
    load_page(pageUrl)
}