
//Global html elements
const classes_obj = document.getElementById("classes");
const buttons = document.getElementById("buttons");
const delete_image = document.getElementById("delete-image")

var selectedClass;

var currentClass;

var cur_level = "";


//keeps track on which of the three result views has been selected
var cur_mode = "";

const toggler = document.getElementById("toggler");
// Schülerdaten (ersetze dies durch deine Daten)
 //currently selected student by the user
 var cur_student = "";
 //metadata object created when the page is loaded
 var students = {};
 //array holding all the classes seen in the metadata
 var classes;
 //flag used for program logic
 var swapped = false;
 //Einsicht specific variables 
 
 //Iframe of the html
 const iframe = document.getElementById("iframe-container");
 let cur_levels = [];

 //Results specific variables

 //list of levels, each element is a triple, index 0 = id, index 1 = points, index 2 =  grade for level
 let cur_uber_levels = [];

 //analysis specific variables
 
 //list of modules holds tuples of (module_id,grade)
 let cur_modules = []
 const toggle = document.getElementById("toggle-button");



 const yesButton = document.getElementById('yesButton');
 const noButton = document.getElementById('noButton');
 const modal = document.querySelector('.modal');
 
 // Event listeners for buttons
 yesButton.addEventListener('click', function() {
     // Action to take on "Yes" button click (e.g., delete profile)
     delete_user(cur_student);
     closeModal();
 });
 toggler.addEventListener('click',function(){
    sessionStorage.clear();
    load_page("/navigation");
 });
 noButton.addEventListener('click', function() {
    closeModal();
 });
 
 // Function to open the modal
 function openModal() {
     modal.classList.add('active');
 }
 
 // Function to close the modal
 function closeModal() {
     modal.classList.remove('active');
 }

 load_meta_data();

  delete_image.addEventListener("click",()=>{
    openModal();
    
  })
  // Füge einen Event Listener hinzu, um die Schülerliste basierend auf der ausgewählten Klasse zu aktualisieren
  document.getElementById("classDropdown").addEventListener("change", ()=>{swapped=true;updateStudentList()});
  document.getElementById("toggle-button").addEventListener("click",()=>{
    if(classes_obj.style.display=="none"){
        classes_obj.style.display="block";
        buttons.style.display="block";
    }
    else{
      classes_obj.style.display="none";
      buttons.style.display="none";

    }
  });
  function removeFocusFromIframe() {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  
    // Set focus to null within the iframe
    iframeDocument.activeElement.blur();
    
     // Get the "help-button" element within the iframe
    const helpButton = iframeDocument.getElementById("popup-container");

    if (helpButton) {
      // Hide the "help-button" element by setting its display to none
      helpButton.style.display = 'none';
    }
  }
  
  
  // Attach the function to the load event of the iframe
  iframe.addEventListener('load', removeFocusFromIframe);
  // Füge das bestehende Skript für die Buttons und Schülerlinks hinzu
  document.getElementById("showPosts").addEventListener("click", function() {
    cur_mode = "einsicht";
    document.getElementById("postContent").style.display = "flex";
    document.getElementById("resultsContent").style.display = "none";
    document.getElementById("analysisContent").style.display = "none";
    toggle.style.visibility = "visible";
    update();
    
    
  });

  document.getElementById("showResults").addEventListener("click", function() {
    cur_mode = "resultate";
    document.getElementById("postContent").style.display = "none";
    document.getElementById("resultsContent").style.display = "flex";
    document.getElementById("analysisContent").style.display = "none";
    toggle.style.visibility = "hidden";
    update();
  });

  document.getElementById("showAnalysis").addEventListener("click", function() {
    cur_mode = "analysis"
    document.getElementById("postContent").style.display = "none";
    document.getElementById("resultsContent").style.display = "none";
    document.getElementById("analysisContent").style.display = "flex";
    toggle.style.visibility = "hidden";
    update();
  });
  function update(){
    if(cur_mode == ""){

    }
    else if(cur_mode == "einsicht"){
      iframe.srcdoc = "";
      cur_levels = [];
      sessionStorage.clear();
      fetch_user_data();
    }
    else if(cur_mode == "resultate"){
      cur_uber_levels = [];
      fetch_user_results();
    }
    else if(cur_mode == "analysis"){
      cur_modules = []
      fetch_user_analysis();
    }
  }
  async function fetch_user_data(){
    
      const response = await fetch("/user_data", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body:cur_student
      });

      if (response.ok) {
          // Load the response data into the sessionStorage
          const responseData = await response.json();
          sessionStorage.clear();
          for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                  const value = responseData[key];
                  sessionStorage.setItem(key, value);
                  cur_levels.push(key);
              }
          }
          updateLevelList();
      } else {
          const errorData = await response.json();
          throw new Error("server did not respond")
      }
  
  }
  async function fetch_user_results(){
    
    const response = await fetch("/user_results", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:cur_student
    });

    if (response.ok) {
        // Load the response data into the sessionStorage
        const responseData = await response.json();
        sessionStorage.clear();
        for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
                let value = responseData[key].split("***");
                cur_uber_levels.push([key].concat(value));
            }
        }
        //updateResultsList();
        update_results();
    } else {
        const errorData = await response.json();
        throw new Error("server did not respond")
    }

}
async function fetch_user_analysis(){
    
  const response = await fetch("/user_analysis", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body:cur_student
  });

  if (response.ok) {
      // Load the response data into the sessionStorage
      const responseData = await response.json();
      sessionStorage.clear();
      for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
              let value = responseData[key];
              cur_modules.push([key,value]);
          }
      }
      //updateAnalysisList();
      update_analysis()
  } else {
      const errorData = await response.json();
      throw new Error("server did not respond")
  }

}

async function delete_user(user){
    
  const response = await fetch("/delete", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body:user
  });


  if (response.ok) {
      var selectedClass = document.getElementById("classDropdown").value;
      let index = students[selectedClass].indexOf(user);
      students[selectedClass].splice(index,1);
      cur_student = "";
      updateStudentList();
  } else {
      const errorData = await response.json();
      throw new Error(errorData)
  }

}


  function set_drop_box(){
    const selectElement = document.getElementById("classDropdown");
    // Loop through the options array and create option elements
    for (let i = 0; i<classes.length;i++) {
      const optionElement = document.createElement("option");
      optionElement.value = classes[i];
      optionElement.text = classes[i];
      selectElement.appendChild(optionElement);
    }
  }
  
  function load_page_to_frame(pageUrl){
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
                console.error('Error loading HTML page:', error);});
        }
    }
    function load_page(pageUrl){
        // Load the HTML page into the HTML container
        window.location.href = pageUrl;
        }



  async function load_meta_data(){
    try {
      const response = await fetch("/auswertung_data", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          }
      });

      if (response.ok) {
          // Load the response data into the sessionStorage
          const responseData = await response.json();
          sessionStorage.clear();
          for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                  const value = responseData[key];
                  sessionStorage.setItem(key, value);
              }
          }
      } else {
          const errorData = await response.json();
          throw new Error("server did not respond")
      }
  } catch (error) {
      throw new Error("server did not respond")
  }
  classes = sessionStorage.getItem("klassen").split("*&**%&");
  for(let i = 0; i<classes.length;i++){
    let cur_class = classes[i];
    students[cur_class] = sessionStorage.getItem(cur_class).split("*&**%&");
  }
  set_drop_box();
  // Initialisiere die Schülerliste
    updateStudentList();
    
  }
   // Funktion zum Aktualisieren der Schülerliste basierend auf der ausgewählten Klasse
   function updateStudentList() {
    selectedClass = document.getElementById("classDropdown").value;
    var studentList = document.getElementById("studentList");
    const delete_img = document.getElementById("delete-image");
    studentList.innerHTML = ""; // Leere die Liste zuerst
    delete_image.style.visibility = "hidden"
    document.body.appendChild(delete_image)
    if (students[selectedClass]) {
      var ul = document.createElement("ul");
      students[selectedClass].forEach(function(student) {
        var li = document.createElement("li");
        var div = document.createElement("div");
        var link = document.createElement("p");
        link.addEventListener("click",()=>{
          if(cur_student&&cur_student!=""&&currentClass==selectedClass){
            document.getElementById(cur_student).parentNode.classList.remove("selected");
          }
          swapped = false;
          currentClass = document.getElementById("classDropdown").value;
          link.parentNode.classList.add("selected");
          const paragraph = div.querySelector('p');
          delete_img.style.visibility = "visible";
          div.appendChild(delete_img);
          if(student!=cur_student){
            cur_student=student
            update();
          }
          
          
        });
        link.textContent = student;
        link.id = student;
        div.classList.add("list-term")
        link.style.display = 'inline';
        div.appendChild(link);
        if(cur_student!=""&&student==cur_student){
          link.parentNode.classList.add("selected");
          delete_img.style.visibility = "visible";
          div.appendChild(delete_image);
        }
        link.classList.add("hover-underline");
        li.appendChild(div);
        ul.appendChild(li);
      });
      studentList.appendChild(ul);
    }


  }
  // Funktion zum Aktualisieren der Schülerliste basierend auf der ausgewählten Klasse
  function updateLevelList() {
    var levelList = document.getElementById("levelList");
    levelList.innerHTML = ""; // Leere die Liste zuerst

    if (cur_levels) {
      cur_level = "";
      cur_levels.sort();
      var ul = document.createElement("ul");
      cur_levels.forEach(function(level) {
        var li = document.createElement("li");
        var link = document.createElement("p");
        link.addEventListener("click",()=>{
          load_page_to_frame("pages/"+level);
          if(cur_level!=""){
            document.getElementById(cur_level).classList.remove("selected");
            
          }
          cur_level = level;
          document.getElementById(level).classList.add("selected");

        });
        link.textContent = level;
        link.id = level;
        link.classList.add("hover-underline");
        li.appendChild(link);
        ul.appendChild(li);
      });
      levelList.appendChild(ul);
    }

  
  }
  function updateAnalysisList() {
    var analysisList = document.getElementById("analysisList");
    analysisList.innerHTML = ""; // Leere die Liste zuerst
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    var link = document.createElement("p");
    link.textContent = "     Module"+"      "+"Grade      ";
    link.id = "titel";
    li.appendChild(link);
    ul.appendChild(li);
    analysisList.appendChild(ul);
    if (cur_uber_levels) {
      ul = document.createElement("ul");
      cur_modules.forEach(function(tuple) {
        li = document.createElement("li");
        link = document.createElement("p");
        link.textContent = tuple[0]+"           "+tuple[1];
        link.id = tuple[0];
        li.appendChild(link);
        ul.appendChild(li);
      });
      analysisList.appendChild(ul);
    }

  
  }
  function populate_analysis_Table() {
    var base = "MU.6.B.1.";
    var y;
    for(var i= 0;i<cur_modules.length;i++){
    if(tripple[0] == "module A"){
        y = base+"a";
    }
    if(tripple[0] == "module B"){
      y = base+"b";
    }
    if(tripple[0] == "module C"){
      y = base+"c";
    } 
    if(tripple[0] == "module D"){
      y = base+"d";
    }
    if(tripple[0] == "module E"){
      y = base+"e";
    }  
    if(tripple[0] == "module F"){
      y = base+"f";
    } 
    if(tripple[0] == "module G"){
      y = base+"g";
    } 
      
    }
    const tableBody = document.getElementById("tableBody");

    data.forEach(rowData => {
        const row = document.createElement("tr");
        
        rowData.forEach(cellData => {
            const cell = document.createElement("td");
            cell.textContent = cellData;
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

  function update_analysis() {
    const d_width = 986;
    const d_height = 802;
    const wrap = document.getElementById("au-wrap"); 
    
    const cur_width = wrap.offsetWidth;
    const cur_height = wrap.offsetHeight;
    
    
    
    const sym_width = 8;
    const sym_height = 16;

    var y_offset = 265+sym_height/2;
    var x_offset = 420+sym_width/2;
    
    var x_step = 220;
    var y_step = 75;


    var x;
    var y;
    delete_xs("au-wrap");
    var backy = document.getElementById("au-wrap");
    if (cur_modules) {
      cur_modules.forEach(function(tripple) {
        if(tripple[0] == "module A"){
            y = 0;
        }
        if(tripple[0] == "module B"){
          y = 1;
        }
        if(tripple[0] == "module C"){
          y = 2;
        } 
        if(tripple[0] == "module D"){
          y = 3;
        }
        if(tripple[0] == "module E"){
          y = 4;
        }  
        if(tripple[0] == "module F"){
          y = 5;
        } 
        if(tripple[0] == "module G"){
          y = 6;
        } 
        if(tripple[1]=="erreicht"){
          x = 0;
        }
        if(tripple[1]=="teilweise erreicht"){
          x = 1;
        }
        if(tripple[1]=="nicht erreicht"){
          x = 2;
        }
        var sym = document.createElement("p");

        // Add a class to the paragraph element
        sym.classList.add("bold-x");

        // Add the 'x' character as text content
        sym.textContent = "x";
        sym.setAttribute("style","position: absolute;left: "+((cur_width/d_width)*(x_offset+x*x_step)-sym_width/2)+"px;top: "+((cur_height/d_height)*(y_offset+y*y_step)-sym_height/2)+"px;")
        backy.appendChild(sym)
        

      });
    }

  
  }
  function updateResultsList() {
    var resultsList = document.getElementById("resultsList");
    resultsList.innerHTML = ""; // Leere die Liste zuerst
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    var link = document.createElement("p");
    link.textContent = "     Level"+"      "+"Points"+"     "+"Grade      ";
    link.id = "titel";
    li.appendChild(link);
    ul.appendChild(li);
    resultsList.appendChild(ul);
    if (cur_uber_levels) {
      ul = document.createElement("ul");
      cur_uber_levels.forEach(function(tripple) {
        li = document.createElement("li");
        link = document.createElement("p");
        link.textContent = tripple[0]+"           "+tripple[1]+"           "+tripple[2];
        link.id = tripple[0];
        li.appendChild(link);
        ul.appendChild(li);
      });
      resultsList.appendChild(ul);
    }

  
  }
  function update_results(){
    var updatys = [];
    const d_widthP1 = 986;
    const d_heightP1 = 802;
    const d_widthP3 = 986;
    const d_heightP3 = 710; 
    const P1 = document.getElementById("P1");
    const P3 = document.getElementById("P3");
    const cur_widthP1 = P1.offsetWidth;
    const cur_heightP1 = P1.offsetHeight;

    const cur_widthP3 = P3.offsetWidth;
    const cur_heightP3 = P3.offsetHeight;
    const sym_width = 8;
    const sym_height = 16;
    var y_offset = 445+sym_height/2;
    var x_offset = 720+sym_width/2;
    var x_step = 100;
    var y_step = 90;
    var x;
    var y;
    var p;
    var backy;

    
    

   
    delete_xs("P1");
    delete_xs("P2");
    delete_xs("P3");
    // Get all child elements with the class "toBeRemoved"
    if (cur_uber_levels) {
      cur_uber_levels.forEach(function(tripple) {
        if(tripple[0].includes("posten1")){
            p = 1;
        }
        if(tripple[0].includes("posten2")){
          p = 2;
        }
      
        if(tripple[0].includes("level1")){
          y = 0;
        }
        if(tripple[0].includes("level2")){
          y = 1;
        }
        if(tripple[0].includes("level3")){
          y = 2;
        }
        if(tripple[0].includes("level4")){
          y = 3;
        }

        if(tripple[0].includes("posten3")){
          p = 3;
          if(tripple[0].includes("level3")){
            y = 0;
          }
          if(tripple[0].includes("level4")){
            y = 1;
          }
          if(tripple[0].includes("level7")){
            y = 1;
          }
          if(tripple[0].includes("level5")){
            y = 2;
          }
          if(tripple[0].includes("level6")){
            y = 2;
          }
        }
        
        if(tripple[2]=="erreicht"){
          x = 0;
        }
        if(tripple[2]=="teilweise erreicht"){
          x = 1;
        }
        if(tripple[2]=="nicht erreicht"){
          x = 2;
        }
        updatys.push([p,x,y]);

      });
      var sumy = summarize(updatys);
      sumy.forEach(ele=>{
        var sym = document.createElement("p");

        // Add a class to the paragraph element
        sym.classList.add("bold-x");

        // Add the 'x' character as text content
        sym.textContent = "x";
        var d_width = ele[0]==3 ? d_widthP3 : d_widthP1;
        var d_height = ele[0]==3 ? d_heightP3 : d_heightP1;

        
        var cur_width = ele[0]==3 ? cur_widthP3 : cur_widthP1;
        var cur_height = ele[0]==3 ? cur_heightP3 : cur_heightP1;
        sym.setAttribute("style","position: absolute;left: "+(((cur_width/d_width)*(x_offset+ele[1]*x_step))-sym_width/2)+"px;top: "+(((cur_height/d_height)*(y_offset+ele[2]*y_step))-sym_height/2)+"px;")
        backy = document.getElementById("P"+ele[0]);
        backy.appendChild(sym)
      });
    }

  }
  function summarize(arr){
    const myHashMap = new Map();
    var key;
    arr.forEach(element => {
      key = element[0]+" "+element[2];
      if (!myHashMap.has(key)) {
        myHashMap.set(key, element); // If key not present, set an empty array
      }
      else{
        const value = myHashMap.get(key);
        if(value==0){
          if(element[1]==2){
            myHashMap.set(key, [value[0],1,value[2]]); // If key not present, set an empty array
          }
        }
        if(value==1){
          if(element[1]==0){
            myHashMap.set(key, [value[0],0,value[2]]); // If key not present, set an empty array
          }
        }
        if(value==2){
          if(element[1]==0){
            myHashMap.set(key, [value[0],1,value[2]]); // If key not present, set an empty array
          }
          if(element[1]==1){
            myHashMap.set(key, [value[0],1,value[2]]); // If key not present, set an empty array
          }
        }
      }
    });
    return Array.from(myHashMap.values());
     
  }
  function delete_xs(id){
    var backy = document.getElementById(id);
    // Get all child elements with the class "toBeRemoved"
    var elementsToRemove = backy.getElementsByClassName("bold-x");

    // Convert the HTMLCollection to an array to iterate safely
    var elementsArray = Array.from(elementsToRemove);

    // Remove each element with the class "toBeRemoved"
    elementsArray.forEach(function(element) {
    element.parentNode.removeChild(element);
    });
  }
  

 