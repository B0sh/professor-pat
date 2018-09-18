
// https://stackoverflow.com/questions/46926033/create-seamless-loop-of-audio-web
var actx = new (AudioContext || webkitAudioContext)(),
    // soundtrack file MUST be a wav. 
    // mp3's compression makes it not loop seamlessly
    src = "soundtrack-loopable.wav",
    audioData, audioSourceNode;  // global so we can access them from handlers

// Load some audio (CORS need to be allowed or we won't be able to decode the data)
fetch(src, {mode: "cors"}).then(function(resp) {
    return resp.arrayBuffer()
}).then(decode);

// Decode the audio file, then start the show
function decode(buffer) {
    // automatically start it
    // actx.decodeAudioData(buffer, playAudio);
    actx.decodeAudioData(buffer, initAudio);
}

// Sets up a new source node as needed as stopping will render current invalid
function initAudio(abuffer) {
    if (!audioData) 
        audioData = abuffer;  // create a reference for control buttons
    audioSourceNode = actx.createBufferSource();  // create audio source
    audioSourceNode.buffer = abuffer;             // use decoded buffer
    audioSourceNode.connect(actx.destination);    // create output
    audioSourceNode.loop = true;                  // takes care of perfect looping

    playAudio();
}

function playAudio() {
    audioSourceNode.start();
}

function stopAudio() {
    audioSourceNode.stop();
}
