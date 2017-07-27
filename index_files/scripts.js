var currSong = the_lion_sleeps_tonight;

// song params
var speed = 200;
var currSongLength = currSong.length;
var currSongVoices = currSong[0].length;
var currSongTimes = currSong[0][0].length;

var currTact = 0;
var currTime = 0;
var scrollSpeed = speed;

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

function show(col) {
	getId('arr' + col).style.visibility = 'visible';

	for (var i=0; i < currSongVoices; i++)	{
		if (currSong[currTact][i][col] != '') {
			var mId = 'img_t' + currTact + '_r' + i + '_' + col;
			getId(mId).style.width = imgSizeBigger + 'px';
			getId(mId).style.marginTop = imgOffsetTopBigger;
			getId(mId).style.marginLeft = imgOffsetLeftBigger;
		}
	}
}

function hide(col) {
	getId('arr' + col).style.visibility = 'hidden';
	for (var i=0; i < currSongVoices; i++)	{
		if (currSong[currTact][i][col] != '') {
			var mId = 'img_t' + currTact + '_r' + i + '_' + col;
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
				'onmouseover="show(' + k + ')" ' +
				'onmouseout="hide(' + k + ')">' +
					'<img class="not-shown" id="arr' + k + '" ' +
					'src="index_files/pics/arrow.png" />' +
			'</td>';
	filler += '</tr></table>';
	getId('mArrows').innerHTML = filler;

	filler = '<table id="t0"><tr class="gap"></tr>';
	// imgs current tact
	for (var i = 0; i < currSongVoices; i++) {
		filler += '<tr style="height:' + tdSizeNorm + 'px">';
		for (var k = 0; k < currSongTimes; k++)	{
			filler +=
				'<td style='+
					'"width:' + tdSizeBigger + 'px; ' +
					'height:' + tdSizeNorm + 'px" ' +
					'id="t' + currTact + '_r' + i + '_' + k + '">';
			if (currSong[currTact][i][k] != '') {
				filler +=
					'<img style=' +
						'"margin-top:' + imgOffsetTopNorm + '; ' +
						'margin-left:' + imgOffsetLeftNorm + '; ' +
						'width:' + imgSizeNorm + 'px" ' +
						'id="img_t' + currTact + '_r' + i + '_' + k +
						'" src="index_files/pics/' + currSong[currTact][i][k] + '.png" />';
			}
			filler += '</td>'
		}
		filler += '</tr>';
	}
	filler += '</table>';

	// imgs next tacts
	for (var t = currTact + 1; t < currSongLength; t ++) {
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
							'src="index_files/pics/' + currSong[t][i][k] + '.png" />';
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
}

function next_slide() {
	//window.scrollBy(0, currSongVoices*tdSizeNorm + 100);
	getId('t' + currTact).classList.add("faded");
	currTact++;
	if (currTact == currSongLength) {
		currTact = 0;
	}
	$('html, body').animate({
		scrollTop: parseInt($('#t' + currTact).offset().top -120)
	}, scrollSpeed);
	 getId('t' + currTact).classList.remove("faded");
}

function play() {
	show(currTime);
	var hhide = ((currTime - 1) < 0) ? (currSongTimes -1) : (currTime - 1);
	hide(hhide);
	currTime++;
	if (currTime == currSongTimes) {
		currTime = 0;
		next_slide();
	}
	setTimeout(play, speed);
}

function play_slides() {
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
