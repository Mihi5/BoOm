var currSong = drunken_sailor;

// song params
var speed = 150;
var currSongLength = currSong.length;
var currSongVoices = currSong[0].length;
var currSongTimes = currSong[0][0].length;

var currTact = 0;
var currTime = 0;
var scrollSpeed = speed;
var eLoop = {
	none: 0,
	tact: 1,
	song: 2.
};
var looping = eLoop.none;

// calculate sizes on screen
var tdSizeNorm = 1010/currSongTimes;
var tdSizeBigger = 1300/currSongTimes;
var imgSizeNorm = 1000/currSongTimes;
var imgSizeBigger = 1400/currSongTimes;

// calculate offsets
var imgOffsetTopNorm = '-' + imgSizeNorm/2 + 'px';
var imgOffsetLeftNorm = '-' + imgSizeNorm/2 + 'px';
var imgOffsetTopBigger = '-' + imgSizeBigger/2 + 'px';
var imgOffsetLeftBigger = '-' + imgSizeBigger/2 + 'px';

function getId (id){
	return document.getElementById(id);
}

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
	console.log('will play: ' + toBePlayed);
	play_sound(toBePlayed[0],toBePlayed[1],toBePlayed[2],toBePlayed[3]);
}

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

function play_pause_click () {
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
}

function next_slide() {
	//window.scrollBy(0, currSongVoices*tdSizeNorm + 100);
	getId('t' + currTact).classList.add("faded");
	currTact++;
	if (currTact == currSongLength) {
		currTact = 0;
	}
	$('html, body').animate({
		scrollTop: parseInt($('#t' + currTact).offset().top - 70)
	}, scrollSpeed);
	 getId('t' + currTact).classList.remove("faded");
}

function play() {
	if (!looping)
		return;
	show(currTime);
	var mHide;
	if ((currTime - 1) < 0) {
		hide(currSongTimes - 1, true);
	} else {
		hide(currTime - 1)
	}
	currTime++;
	if (currTime == currSongTimes) {
		currTime = 0;
		next_slide();
	}
	setTimeout(play, speed);
}

function play_slides() {
	looping = !looping;
	play();
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
// sidenav scripts end
