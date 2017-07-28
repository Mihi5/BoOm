var currSong = '';
var speed = 150;
var eLoop = {
	none: 0,
	tact: 1,
	song: 2.
};
var currSongLength;
var currSongVoices;
var currSongTimes;

var currTact = 0;
var currTime = 0;
var looping = eLoop.none;
var running = false;

// calculate sizes on screen
var tdSizeNorm;
var tdSizeBigger;
var imgSizeNorm;
var imgSizeBigger;

// calculate offsets
var imgOffsetTopNorm;
var imgOffsetLeftNorm;
var imgOffsetTopBigger;
var imgOffsetLeftBigger;

// redraw the slider on refresh
$(document).ready(function(){
	$('#tempo').val = 85;
	document.querySelector('input[type=range]').value = 85;
	looping = eLoop[getId('looping').value];
	console.log(looping);
});

// set image dimensions based on the song
function set_sizes() {
	currSongLength = currSong.length;
	currSongVoices = currSong[0].length;
	currSongTimes = currSong[0][0].length;

	currTact = 0;
	currTime = 0;
	looping = eLoop.none;

	// calculate sizes on screen
	tdSizeNorm = 1010/currSongTimes;
	tdSizeBigger = 1300/currSongTimes;
	imgSizeNorm = 1000/currSongTimes;
	imgSizeBigger = 1400/currSongTimes;

	// calculate offsets
	imgOffsetTopNorm = '-' + imgSizeNorm/2 + 'px';
	imgOffsetLeftNorm = '-' + imgSizeNorm/2 + 'px';
	imgOffsetTopBigger = '-' + imgSizeBigger/2 + 'px';
	imgOffsetLeftBigger = '-' + imgSizeBigger/2 + 'px';
}

function getId (id){
	return document.getElementById(id);
}

// plays up to 4 sounds simultaneously
function play_sound(s0, s1, s2, s3) {
	var snd0;	var snd1; var snd2; var snd3;

	if (s0 != '') {
		snd0 = new Audio('index_files/sound/PizzStr/' + s0 + '.ogg');
		//console.log('s0: ' + s0 + '.ogg');
		snd0.mediaGroup = 'soundGroup';
		snd0.play();
	}

	if (s1 != '') {
		snd1 = new Audio('index_files/sound/PizzStr/' + s1 + '.ogg');
		//console.log('s1: ' + s1 + '.ogg');
		snd1.mediaGroup = 'soundGroup';
		snd1.play();
	}

	if (s2 != '') {
		snd2 = new Audio('index_files/sound/PizzStr/' + s2 + '.ogg');
		//console.log('s2: ' + s2 + '.ogg');
		snd2.mediaGroup = 'soundGroup';
		snd2.play();
	}

	if (s3 != '') {
		snd3 = new Audio('index_files/sound/PizzStr/' + s3 + '.ogg');
		//console.log('s3: ' + s3 + '.ogg');
		snd3.mediaGroup = 'soundGroup';
		snd3.play();
	}
}

// shows an arrow and grows the respective row
function show(col) {
	getId('arr' + col).style.visibility = 'visible';

	var toBePlayed = ['', '', '', ''];

	for (var i=0; i < currSongVoices; i++)	{
		if (currSong[currTact][i][col] != '') {
			var mId = 'img_t' + currTact + '_r' + i + '_' + col;
			getId(mId).style.width = imgSizeBigger + 'px';
			getId(mId).style.marginTop = imgOffsetTopBigger;
			getId(mId).style.marginLeft = imgOffsetLeftBigger;
			toBePlayed[i] = getId(mId).alt;
		}
	}
	//console.log('will play: ' + toBePlayed);
	play_sound(toBePlayed[0],toBePlayed[1],toBePlayed[2],toBePlayed[3]);
}

// hides an arrow and normalize the respective row
function hide(col, lastTact = false) {
	var mTact = (lastTact == false)? currTact: (currTact -1);
	if (mTact < 0)
		mTact = 0;

	getId('arr' + col).style.visibility = 'hidden';
	for (var i=0; i < currSongVoices; i++)	{
		if (currSong[mTact][i][col] != '') {
			var mId = 'img_t' + mTact + '_r' + i + '_' + col;
			getId(mId).style.width = imgSizeNorm + 'px';
			getId(mId).style.marginTop = imgOffsetTopNorm;
			getId(mId).style.marginLeft = imgOffsetLeftNorm;
		}
	}
}

// redraw the table with the notes
function change_song (song) {
	currSong = window[song];
	set_sizes();
	var filler = '';

	// arrows
	filler = '<table><tr>';
	for (var k = 0; k < currSongTimes; k++)
		filler +=
			'<td style=' +
				'"width:' + tdSizeBigger + 'px" ' +
				/*'onmouseover="show(' + k + ')" ' +
				'onmouseout="hide(' + k + ')"' +*/
				'>' +
					'<img class="not-shown" id="arr' + k + '" ' +
					'src="index_files/pics/arrow.png" />' +
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
					'<td style=' +
						'"width:' + tdSizeBigger + 'px; ' +
						'height:' + tdSizeNorm + 'px" ' +
						'id="t' + t + '_r' + i + '_' + k + '">';
				if (currSong[t][i][k] != '') {
					filler +=
						'<img style=' +
							'"margin-top:' + imgOffsetTopNorm + '; ' +
							'margin-left:' + imgOffsetLeftNorm + '; ' +
							'width:' + imgSizeNorm + 'px" ' +
							'id="img_t' + t + '_r' + i + '_' + k + '" ' +
							'src="index_files/pics/' + currSong[t][i][k] + '.png" ' +
							'alt="' + currSong[t][i][k] + '" />';
				}
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

// advance to the next tact
function next_slide() {
	//window.scrollBy(0, currSongVoices*tdSizeNorm + 100);
	getId('t' + currTact).classList.add("faded");
	currTact++;
	// end of the song reached
	if (currTact == currSongLength) {
		currTact = 0;
		if (looping != eLoop.song) {
			running = false;
			currTact = currSongLength - 1;
			hide(currSongTimes - 1);
			currTact = 0;
			getId('play-pause').innerHTML = "Play";
		}
	}
	$('html, body').animate({
		scrollTop: parseInt($('#t' + currTact).offset().top - 70)
	}, speed);
	 getId('t' + currTact).classList.remove("faded");
}

// recursive play
function play() {
	if (!running) {
		return;
	}
	show(currTime);
	var mHide;
	if ((currTime - 1) < 0) {
		hide(currSongTimes - 1, true);
	} else {
		hide(currTime - 1);
	}
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
	if (currSong === '') {
		change_song(getId('song-name').value);
	}
	getId('play-pause').innerHTML = (running) ? "Pause": "Play";
	play();
}

function vary_speed(value) {
	speed = 700 - (value)*6.5;
	getId('tempo').innerHTML = value;
}

function set_looping (value) {
	looping = eLoop[value];
}

// Sidenav scripts
var sideNavOn = 0;

function openNav() {
  if(sideNavOn === 0){
    getId("mySidenav").style.width = "250px";
    getId("main").style.marginLeft = "250px";
    getId("mHeader").style.marginLeft = "250px";
    sideNavOn = 1;
  }
  else{
    getId("mySidenav").style.width = "0";
    getId("main").style.marginLeft= "0";
    getId("mHeader").style.marginLeft = "0";
    sideNavOn = 0;
  }
}

function closeNav() {
    getId("mySidenav").style.width = "0";
    getId("main").style.marginLeft= "0";
    getId("mHeader").style.marginLeft = "0";
    sideNavOn = 0
}