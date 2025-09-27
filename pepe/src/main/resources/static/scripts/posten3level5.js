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
var textField = document.getElementById("myTextField");
var last_input = "";

textField.addEventListener("input", function(event) {
    var inputValue = textField.value.toLowerCase(); // Convert input to lowercase
    if(validate(inputValue)){      
            last_input = inputValue;
    }
    else{
        textField.value = last_input;
    }
    
    

});

document.addEventListener("DOMContentLoaded", function() {
    var textField = document.getElementById("myTextField");
    // Set focus on the text field when the page is loaded
    textField.focus();
});
innit();
function innit(){
    const zeState = sessionStorage.getItem(document.body.id);
    if(zeState!=null&&zeState!=""){
        textField.value = zeState;
        last_input = zeState;
    }
}

function validate(text){
    var allowedWords = ["c","cis","ces","d","dis","des","e","es","eis","f","fis","fes","g","gis","ges","a","ais","as","h","his","hes","b",""];
    for (var i = 0; i < allowedWords.length; i++) {
        if (allowedWords[i].startsWith(text)) {
            return true; // x is the start of at least one word in allowedWords
        }
    }
    return false; // x is not the start of any word in allowedWords

    /*if(text.length==0){
        return true;
    }
    else if(text.length==1){
        return allowedChars.includes(text[0]);
    }
    else if(text.length == 2){
        if((text[0]=="e"||text[0]=="a")&&text[1]=="s"){
            return true;
        }
        else if(text[1] == "i"){
            return text[0]=="c"||text[0]=="d"||text[0]=="f"||text[0]=="g"||text[0]=="a";
        }
        else if(text[1] == "e")
            return text[0]=="d"||text[0]=="g";
        else{
            return false;
        }
    }
    else if(text.length == 3){
        if(text[2]=="s"&&text[1]=="i"){
            return (text[0]=="c"||text[0]=="d"||text[0]=="f"||text[0]=="g"||text[0]=="a");
        }
        else if(text[2]=="s"&&text[1]=="e"){
            return text[0]=="g"||text[0]=="d";
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }*/
}

