// Imports.
var remote = require('remote');
var fs = remote.require('fs');
var events = remote.require('events');
var readChunk = remote.require('read-chunk');
var fileType = remote.require('file-type');

// @util-function: used to convert Buffer returned by fs to arrayBuffer required for WebAudio API
function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

// Get file list
var files = fs.readdirSync('/home/binayak/Music');
var audiofiles = new Array();
var nfiles = files.length;
for (var i = 0; i < nfiles; i++){
    var chunk = readChunk.sync('/home/binayak/Music/' + files[i], 0, 262);
    if(fileType(chunk).mime == 'audio/mpeg'){
        audiofiles.push(files[i]);
    };
};

// Play audio files
var musicForTheEars= null;
var context;
function loadMusicToPlay(path){
    var track;
    try{
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(e){
        console.log('Audio API is broken :\'(');
    }
    try{
        track = fs.readFileSync(path);
        track = toArrayBuffer(track);
    }
    catch(e){
        console.log('Could not read file: ' + path);
        console.log(e);
    }
    context.decodeAudioData(track, function(buffer){
        musicForTheEars = buffer;
    });
};

function letsHitIt(){
    if (musicForTheEars != null) {
        var source = context.createBufferSource();
        source.buffer = musicForTheEars;
        source.connect(context.destination);
        source.start(0);
        console.log("yo yo.. boom shaka");
    }
    else{
        console.log("hit it again..");
        setTimeout(letsHitIt, 500);          
    }
}

loadMusicToPlay('/home/binayak/Music/' + audiofiles[0]);
letsHitIt();