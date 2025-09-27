let countEle = document.getElementById("count");
let count = sessionStorage.getItem("count");
let cur_seleceted;
const tot_questions = 72;
const toggler = document.getElementById("toggler");

if(count==null){
    count = 0;
}
else{
    count = parseInt(count,10);
}


let iframe = document.getElementById("iframe-container");
let commit_button = document.getElementById("commit-button");
let back_button = document.getElementById("back-button");
let sequence = sessionStorage.getItem("sequence");
let cur_id;


toggler.addEventListener('click',function(){
    sessionStorage.clear();
    window.location.href = "/auswertung";;
 });
setup();
async function setup(){
    if(sequence==null){
        await get_sequence();
    }
    else{
        sequence = sequence.trim().split(/\s+/)
        //await get_sequence();

    }
    cur_id = sequence[count];
    updateLevelList();

    
    
    
    
    if(count==sequence.length||cur_id==""){
        window.location.href = "/final";
    }
    else{
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
            commit();
    });
    back_button.addEventListener("click",(event)=>{
        back();
    });
}
async function get_sequence(){
    try {
        const response = await fetch('/load_view');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Assuming the response is in JSON format
        // Access the retrieved data
        sequence = data.sequence.trim().split(/\s+/);
        console.log(sequence);
        sessionStorage.setItem("sequence", data.sequence.trim()); // Store sequence in sessionStorage
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function updateLevelList() {
    var levelList = document.getElementById("levelList");
    levelList.innerHTML = ""; // Leere die Liste zuerst

    if (sequence) {
      sequence.sort();
      cur_id = sequence[count];
      var ul = document.createElement("ul");
      sequence.forEach(function(level) {
        var li = document.createElement("li");
        var link = document.createElement("p");
        link.addEventListener("click",()=>{
            cur_id = level;
            count = sequence.indexOf(cur_id);
            if(cur_id.includes("posten1level1")){
                const lastTwoChars = cur_id.slice(-2); // Get the last two characters
                const originalStringWithoutLastTwoChars = cur_id.slice(0, -2); // Remove the last two characters
                sessionStorage.setItem("seed",lastTwoChars);
                load_page("pages/"+originalStringWithoutLastTwoChars+".html");
            }
            else{
                load_page("pages/"+cur_id+".html");
            }
        });
        link.textContent = level;
        link.id = level;
        link.classList.add("list-element");
        li.appendChild(link);
        ul.appendChild(li);
      });
      levelList.appendChild(ul);
    }

  
}
function update_countEle(){
    countEle.textContent = get_index()+"/"+tot_questions;
}

function get_index(){
    return sequence.indexOf(cur_seleceted.id);
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
        if(cur_seleceted){
            cur_seleceted.classList.remove("selected");
        }
        cur_seleceted = document.getElementById(sequence[count]);
        cur_seleceted.classList.add("selected")

        update_countEle();
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
    if(cur_id.includes("posten3level5")||cur_id.includes("posten3level6")){
        const iframeContentWindow = iframe.contentWindow;

        // Access the input element within the iframe
        const iframeText = iframeContentWindow.document.getElementById("myTextField");

        // Access the canvas content URL using toDataURL()
        const text = iframeText.value;

        sessionStorage.setItem(cur_id,text);


    }
    else{
        // Get the clicked list item's ID
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
    load_page(pageUrl)
}
function back(){
    if(cur_id.includes("posten3level5")||cur_id.includes("posten3level6")){
        const iframeContentWindow = iframe.contentWindow;

        // Access the input element within the iframe
        const iframeText = iframeContentWindow.document.getElementById("myTextField");

        // Access the canvas content URL using toDataURL()
        const text = iframeText.value;

        sessionStorage.setItem(cur_id,text);


    }
    else{
        // Get the clicked list item's ID
    }
    if(count-1<0){
        return;
    }
    cur_id = sequence[--count];
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
    load_page(pageUrl)
}