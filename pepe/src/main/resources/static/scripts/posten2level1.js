		const notenbild = document.getElementById("notenbild");
		const notenbild_audio = document.getElementById("notenbild-audio");
		const audio = document.getElementById("notenbild-audio");
		const answers = document.getElementsByClassName("answer-container");
		const audioElement = document.getElementById("audio-element");
		const playPauseButton = document.getElementById("play-pause-button");
		const seekBar = document.getElementById("seek-bar");

	let isPlaying = false;

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


	// Play or pause audio when the play/pause button is clicked
	playPauseButton.addEventListener("click", function() {
  	if (isPlaying) {
    	audioElement.pause();
    	playPauseButton.className = "play";
  	} else {
    	audioElement.play();
    	playPauseButton.className = "pause";
  	}
  	isPlaying = !isPlaying;
	});

	// Update the seek bar as audio plays
	audioElement.addEventListener("timeupdate", function() {
  	const currentTime = audioElement.currentTime;
  	const duration = audioElement.duration;
  	seekBar.value = (currentTime / duration) * 100;
	});

	// Allow users to seek within the audio by dragging the seek bar
	seekBar.addEventListener("input", function() {
  		const seekTime = (seekBar.value / 100) * audioElement.duration;
  		audioElement.currentTime = seekTime;
	});
		
		Array.from(answers).forEach(
			answer => {
				answer.addEventListener("click",function(){
					if(answer.classList.contains("selected")){
						remove_selected();
						sessionStorage.setItem(document.body.id,"");	
					}
					else{
						remove_selected();
						answer.classList.add("selected")
						sessionStorage.setItem(document.body.id,answer.id);
					}
				},false);
			}
		);
		
	innit();
        function remove_selected(){
            const selecteds = document.getElementsByClassName("selected");
            Array.from(selecteds).forEach(ele =>{
                ele.classList.remove("selected");
            })
        }
		function innit(){
			let zeState = sessionStorage.getItem(document.body.id)
			if(zeState!=null&&zeState!=""){
				document.getElementById(zeState).classList.add("selected");
			}
		}