var remote = require('remote');
var fs = remote.require('fs');
var events = remote.require('events');
var readChunk = remote.require('read-chunk');
var fileType = remote.require('file-type');
var bb = require('backbone');
var _ = require('underscore');

// @util-function: used to convert Buffer returned by fs to arrayBuffer required for WebAudio API
function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

// Get list of audio files
function getAudioList(path){
    var files = fs.readdirSync(path);
    var audiofiles = new Array();
    var nfiles = files.length;
    var chunk, type;
    for (var i = 0; i < nfiles; i++){
        chunk = readChunk.sync('' + path + files[i], 0, 262);
        type = fileType(chunk).mime;
        if(type == 'audio/mpeg' || type == 'audio/ogg' || type == 'audio/vorbis' || type == 'audio/webm'){
            audiofiles.push(files[i]);
        };
    };
    return audiofiles;
}

// Play audio files
var audiofiles = getAudioList('/home/binayak/Music/');
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