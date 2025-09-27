const audioElement = document.getElementById("audio-element");
const playPauseButton = document.getElementById("play-pause-button");
const seekBar = document.getElementById("seek-bar");

let isPlaying = false;

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