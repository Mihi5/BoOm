var allSounds =
[
	"",
	"C0","Cis0","D0","Dis0","E0","F0","Fis0","G0","Gis0","A0","Ais0","B0",
	"C","Cis","D","Dis","E","F","Fis","G","Gis","A","Ais","B",
	"C1"
];
var allSoundsLen = allSounds.length;

var songObj;
var mNewSong;
var currSong;
var speed = 150;
var eLoop = {
	none: 0,
	tact: 1,
	song: 2
};
var currSongLength;
var currSongVoices;
var currSongTimes;

var currTact = 0;
var currTime = 0;
var looping = eLoop.none;
var running = false;

// to calculate sizes on screen
var tdSizeNorm;
var tdSizeBigger;
var imgSizeNorm;
var imgSizeBigger;

// to calculate offsets
var imgOffsetTopNorm;
var imgOffsetLeftNorm;
var imgOffsetTopBigger;
var imgOffsetLeftBigger;

// redraw the slider on refresh
$(document).ready(function(){
	getId('tempo-slider').value = 85;
	getId('looping').value = "none";
	fill_songs();
	preload_sounds();
});

// export song as downloadable JSON
function download() {
	var currName = getId('song-name').value;
	var dataStr = "data:text/json;charset=utf-8," +
		encodeURIComponent(
			JSON.stringify(getObjects(songObj, 'name', currName)[0])
		);

	var dlAnchorElem = getId('download');
	dlAnchorElem.setAttribute('href',     dataStr     );
	dlAnchorElem.setAttribute('download', currName + '.json');
	dlAnchorElem.click();
}

// read a file
function file_read() {
  var file = getId('mFile').files[0];
  if (file) {
		var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = file_loaded;
  }
}

// gets triggered on the file read event
function file_loaded(evt) {
  var fileString = evt.target.result;
	var newJSON;
	try {
		newJSON = JSON.parse(fileString);
	} catch (e) {
		alert("Not properly formatted or wrong file!");
		return;
	}

	songObj.songs.push(newJSON);

	var filler = '';
	var songName = getId('song-name');
	var orFiller = songName.innerHTML;
	filler += '<option value="' + newJSON.name + '">' +
			newJSON.name + '</option>';

	songName.innerHTML = filler + orFiller;
	change_song(songName.value);
}

// fill the song chooser menu with data from JSON
function fill_songs() {
	//songObj = JSON.parse(songsJSON);
	songObj = songsJSON;
	var filler = '';

	for (var i = 0; i < len; i++) {
		filler += '<option value="' + songObj.songs[i].name + '">' +
			songObj.songs[i].name + '</option>';
	}

	getId('song-name').innerHTML = filler;
	currSong = songObj.songs[0];
	change_song(currSong.name);
}

// set image dimensions based on the song
function set_sizes() {
	currSongLength = (currSong.song).length;
	currSongVoices = (currSong.song[0]).length;
	currSongTimes = (currSong.song[0][0]).length;

	currTact = 0;
	currTime = 0;
	looping = eLoop.none;

	var wH = window.innerHeight;
	var par = 350; // ToDo: bind to window width
	tdSizeNorm = Math.round(0.8 * (wH - par) / (2 * currSongVoices));
	tdSizeBigger = Math.round((wH - par) / (2 * currSongVoices));
	imgSizeNorm = Math.round(0.75 * (wH - par) / (2 * currSongVoices));
	imgSizeBigger = Math.round(0.95 * (wH - par) / (2 * currSongVoices));

	// calculate offsets
	imgOffsetTopNorm = '-' + imgSizeNorm/2 + 'px';
	imgOffsetLeftNorm = '-' + imgSizeNorm/2 + 'px';
	imgOffsetTopBigger = '-' + imgSizeBigger/2 + 'px';
	imgOffsetLeftBigger = '-' + imgSizeBigger/2 + 'px';
	//imgOffsetTopNorm = imgOffsetTopBigger = 0;
}

function getId (id){
	return document.getElementById(id);
}

// plays up to 4 sounds simultaneously
function play_sound(s0, s1, s2, s3) {
	var snd0;	var snd1; var snd2; var snd3;

	if (s0 != '') {
		snd0 = new Audio('sound/PizzStr/' + s0 + '.ogg');
		//console.log('s0: ' + s0 + '.ogg');
		snd0.mediaGroup = 'soundGroup';
		snd0.play();
	}

	if (s1 != '') {
		snd1 = new Audio('sound/PizzStr/' + s1 + '.ogg');
		//console.log('s1: ' + s1 + '.ogg');
		snd1.mediaGroup = 'soundGroup';
		snd1.play();
	}

	if (s2 != '') {
		snd2 = new Audio('sound/PizzStr/' + s2 + '.ogg');
		//console.log('s2: ' + s2 + '.ogg');
		snd2.mediaGroup = 'soundGroup';
		snd2.play();
	}

	if (s3 != '') {
		snd3 = new Audio('sound/PizzStr/' + s3 + '.ogg');
		//console.log('s3: ' + s3 + '.ogg');
		snd3.mediaGroup = 'soundGroup';
		snd3.play();
	}
}

// shows an arrow and grows the respective row
function grow(col) {
	getId('arr' + col).style.visibility = 'visible';

	var toBePlayed = ['', '', '', ''];

	for (var i=0; i < currSongVoices; i++)	{
		if (currSong.song[currTact][i][col] != '') {
			var mId = 'img_t' + currTact + '_r' + i + '_' + col;
			getId(mId).style.width = imgSizeBigger + 'px';
			getId(mId).style.marginTop = imgOffsetTopBigger;
			getId(mId).style.marginLeft = imgOffsetLeftBigger;
			toBePlayed[i] = getId(mId).alt;
		}
	}
	play_sound(toBePlayed[0],toBePlayed[1],toBePlayed[2],toBePlayed[3]);
}

// hides an arrow and normalize the respective row
function shrink(col, lastTact) {
	if (typeof lastTact === 'undefined')
		lastTact = false;
	var mTact = (lastTact == false)? currTact: (currTact -1);
	if (mTact < 0)
		mTact = 0;

	getId('arr' + col).style.visibility = 'hidden';
	for (var i=0; i < currSongVoices; i++)	{
		if (currSong.song[mTact][i][col] != '') {
			var mId = 'img_t' + mTact + '_r' + i + '_' + col;
			getId(mId).style.width = imgSizeNorm + 'px';
			getId(mId).style.marginTop = imgOffsetTopNorm;
			getId(mId).style.marginLeft = imgOffsetLeftNorm;
		}
	}
}

/*
	search in JSON object
	https://stackoverflow.com/a/4992429/6049386
*/
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

// redraw the table with the current song
function change_song (song) {
	currSong = getObjects(songObj, 'name', song)[0];
	set_sizes();
	var filler = '';

	// arrows
	filler = '<table><tr>';
	for (var k = 0; k < currSongTimes; k++)
		filler +=
			'<td style=' +
				'"width:' + tdSizeBigger + 'px" >' +
					'<img class="not-shown" id="arr' + k + '" ' +
					'src="pics/arrow.png" />' +
			'</td>';
	filler += '</tr></table>';
	getId('mArrows').innerHTML = filler;

	// imgs
	filler = '';
	for (var t = currTact; t < currSongLength; t ++) {
		filler += '<table class="faded" id="t' + t + '"><tr class="gap"></tr>';
		for (var i = 0; i < currSongVoices; i++) {
			filler += '<tr>';
			for (var k = 0; k < currSongTimes; k++)	{
				filler +=
					'<td onclick="show(\'sel' + t + '_' + i + '_' + k + '\')" style="' +
						'width:' + tdSizeBigger + 'px; ' +
						'height:' + tdSizeNorm + 'px" ' +
						'id="t' + t + '_r' + i + '_' + k + '">';

				var imgSrc = 'dummy';
				var imgAlt = '';
				if (currSong.song[t][i][k] != '') {
					imgSrc = currSong.song[t][i][k];
					imgAlt = imgSrc;
				}
				filler +=
					'<img style=' +
						'"margin-top:' + imgOffsetTopNorm + '; ' +
						'margin-left:' + imgOffsetLeftNorm + '; ' +
						'width:' + imgSizeNorm + 'px" ' +
						'id="img_t' + t + '_r' + i + '_' + k + '" ' +
						'src="pics/' + imgSrc + '.png" ' +
						'alt="' + imgAlt + '" />';

				filler +=
					'<select id="sel' + t + '_' + i + '_' + k + '" ' +
						'onchange="' +
							'selectorChange(' + t + ',' + i + ',' + k + ',this)">';
					for (var p = 0; p < allSoundsLen; p++) {
						filler += '<option value="' + allSounds[p] + '">' +
												allSounds[p] +
											'</option>';
					}
				filler +=
					'</select>';

				filler += '</td>'
			}
			filler += '</tr>';
		}
		filler += '</table>';
	}

	// leave room for scrolling
	filler += '<div style="height:100vh"></div>';

	getId('mTable').innerHTML = filler;
	getId('t0').classList.remove("faded");
	window.scrollTo(0, 0);
}

// option is selected - set the new image and disappear
function selectorChange(t, i, k, obj) {
	$(obj).click(function(event){
		event.stopPropagation();
	});
	var value = obj.value;
	getId('sel' + t + '_' + i + '_' + k).style.display = 'none';
	var mId = 'img_t' + t + '_r' + i + '_' + k;
	var mImg = new Image();
	var imgSrc = (value == '')? 'dummy':value;
	mImg.src = 'pics/' + imgSrc + '.png';
	getId(mId).src = mImg.src;
	getId(mId).alt = value;
	currSong.song[t][i][k] = value;
}

function show_create() {
	getId('crTable').style.display = "block";
	getId('mTable').innerHTML = '';
}

function show(id) {
	getId(id).style.display = 'block';
}

function hide(id) {
	getId(id).style.display = 'none';
}

// advance to the next tact
function next_slide() {
	//window.scrollBy(0, currSongVoices*tdSizeNorm + 100);
	mFade();
	currTact++;
	// end of the song reached
	if (currTact == currSongLength) {
		currTact = currSongLength - 1;
		shrink(currSongTimes - 1);
		currTact = 0;
		if (looping != eLoop.song) {
			running = false;
			$('#play-pause').toggleClass('glyphicon-play')
				.toggleClass('glyphicon-pause');
			//getId('play-pause').innerHTML = "Play";
		}
	}
	 mUnfadeAndScrollTo();
}

// shrink helper for for- and backward
function mShrink() {
	if ((currTime - 1) < 0) {
		shrink(currSongTimes - 1, true);
	} else {
		shrink(currTime - 1);
	}
}

// helper for fading a tact
function mFade() {
	getId('t' + currTact).classList.add("faded");
}

// helper for unfading a tact and scrolling to it
function mUnfadeAndScrollTo() {
	getId('t' + currTact).classList.remove("faded");
	$('html, body').animate({
		scrollTop: parseInt($('#t' + currTact).offset().top - 70)
	}, speed);
}

// recursive play
function play() {
	if (!running) {
		return;
	}
	grow(currTime);
	var mHide;
	mShrink();
	currTime++;
	if (currTime == currSongTimes) {
		currTime = 0;
		if (looping != eLoop.tact) {
			next_slide();
		}
	}
	setTimeout(play, speed);
}

// start/stop the playback
function play_slides() {
	running = !running;
	$('#play-pause').toggleClass('glyphicon-play')
		.toggleClass('glyphicon-pause');
	//getId('play-pause').innerHTML = (running) ? "Pause": "Play";
	play();
}

// one tact back
function rewind() {
	if (currTact == 0) {
		return;
	}
	mShrink();
	currTime = 0;
	mFade();
	currTact--;
	mUnfadeAndScrollTo();
}

// one tact forward
function forward() {
	mShrink();
	currTime = 0;
	mFade();
	currTact++;
	// end of the song reached
	if (currTact == currSongLength) {
		currTact = 0;
	}
	mUnfadeAndScrollTo();
}

// this get called from the tempo slider
function vary_speed(value) {
	speed = 700 - (value)*6.5;
	getId('tempo').innerHTML = value;
}

function set_looping (value) {
	looping = eLoop[value];
}

// create mode - sets parameters for a new song and create a base json for it
function go_create() {
	var crName = getId('crName').value;
	var crTimes = parseInt(getId('crTimes').value);
	var crTacts = parseInt(getId('crTacts').value);
	var crVoices = parseInt(getId('crVoices').value);

	if (crName.length > 20) {
		alert("Name too long!");
		return;
	}
	if (isNaN(crTimes) || crTimes < 1) {
		alert("Invalid times!");
		return;
	}
	if (isNaN(crTacts) || crTacts < 1) {
		alert("Invalid tacts!");
		return;
	}
	if (isNaN(crVoices) || crVoices < 1 || crVoices > 4) {
		alert("Invalid voices!");
		return;
	}

	var i,l,k;
	var mNewSongStr = '{"name":"' + crName + '", "song": [';

	for (i = 0; i < crTacts; i++) {
		// create tact
		mNewSongStr += '[';
		for (k = 0; k < (crVoices); k++) {
			// create voices
			mNewSongStr += '[';
			for (l = 0; l < (crTimes); l++) {
				// create times
				mNewSongStr += '""';
				if (l != (crTimes-1)) {
					mNewSongStr += ',';
				}
			}
			mNewSongStr += ']';
			if (k != (crVoices-1)) {
				mNewSongStr += ',';
			}
		}
		mNewSongStr += ']';
		if (i != (crTacts-1)) {
			mNewSongStr += ',';
		}
	}

	mNewSongStr += ']}';
	mNewSong = JSON.parse(mNewSongStr);

	var oldFill = getId('song-name').innerHTML;
	getId('song-name').innerHTML = '<option value="' + mNewSong.name + '">' +
		mNewSong.name + '</option>' + oldFill;

	songObj.songs.push(mNewSong);

	change_song(mNewSong.name);

	currSong = songObj.songs[songObj.songs.length - 1];
}

// preload all ogg in the browser
// https://stackoverflow.com/a/31351186/6049386
function preload_sounds() {
	for (var i = 1; i < allSoundsLen; i++) {
    var audio = new Audio();
    // once this file loads, it will call loadedAudio()
    // the file will be kept by the browser as cache
    audio.addEventListener('canplaythrough', loadedAudio, false);
    audio.src = 'sound/PizzStr/' + allSounds[i] + '.ogg';
	}
}

var snd_loaded = 1;
function loadedAudio() {
    // this will be called every time an audio file is loaded
    // we keep track of the loaded files vs the requested files
    snd_loaded++;
    if (snd_loaded == allSoundsLen){
    	// all have loaded
    	init_menu();
    }
}

// shows the menu
function init_menu() {
	getId('loading').style.display = "none";
	getId('menu').style.display = "block";
}
