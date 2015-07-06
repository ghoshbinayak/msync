var Song = bb.Model.extend({
	defaults: {
		title: 'unknown';
		artist: ['unknown'];
		album: 'unknown';
  		albumartist : ['unknown'],
		year : 'unknown',
  		track : { no : 0, of : 0 },
  		disk : { no : 0, of : 0 },
  		genre : ['unknown'],
  		picture : [ { format : undefined, data : undefined } ],
  		duration : 0 // in seconds 
	}
});

module.export = Song;