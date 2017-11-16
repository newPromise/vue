function id (idName) {
	return document.getElementById(idName);
}

const songList = [
	{
		singer: '陈奕迅',
		songName: '浮夸'
	},
	{
		singer: '张杰',
		songName: '勿忘心安'
	},
	{
		singer: '陈奕迅',
		songName: '十年'
	}
];


function Music (song) {
	this.status = 'pause';
	this.audio = id('audio');
	this.songIndex = 0;
	this.song = song;
	if (this.song) {
		this.singer = this.song.singer;
		this.time = this.song.time;
		this.status = this.song.status;
		this.songName = this.song.songName;
	}
}

Music.prototype = {
	play: function() {
		let that = this;
		if (that.status === 'pause') {
			that.audio.play();
			that.status = 'play';
		} else {
			that.pause();
		}
		that.refreshSong();
	},
	pause: function() {
		let that = this;
		if (that.status === 'play') {
			that.audio.pause();
			that.status = 'pause';
		} else {
			that.play();
		}
	},
	// 下一首
	nextSong: function(nextBtn) {
		let that = this;
		console.log(nextBtn);
		nextBtn.onclick = () => {
			that.getSong(true);
			that.audio.src = that.audioSrc();
			that.audio.play();
			this.status = 'play';
		}
	},
	// 上一首
	preSong: function(preBtn) {
		let that = this;
		preBtn.onclick = () => {
			that.getSong(false);
			that.audio.src = that.audioSrc();
			that.audio.play();
			this.status = 'play';
		}
	},
	// 从歌曲列表中得到歌曲
	getSong: function(isNext) {
		let that = this;
		if (isNext) {
			that.songIndex ++;
		} else {
			that.songIndex --;
		}
		that.songIndex = that.songIndex < 0 ? (songList.length - 1) : (that.songIndex >= songList.length ? 0 : that.songIndex);
		that.song = songList[that.songIndex];
		that.refreshSong();
	},
	refreshSong: function() {
		let that = this;
		id('songMsg').innerText = `${that.song.songName} - ${that.song.singer}`;
	},
	volumeAdd: function() {
		let that = this;
		that.audio.volume += 0.1;
	},
	volumePev: function() {
		let that = this;
		that.audio.volume -= 0.1;
	},
	audioSrc: function() {
		let that = this;
		return '../data/music/' + this.song.singer + ' - ' + this.song.songName + '.mp3';
	},
	timeRefersh: function() {
		let that = this;
		that.audio.ontimeupdate = function () {
			id('time').innerText =  '0' + parseInt(that.audio.duration / 60) + ':' + parseFloat(that.audio.duration / 60);
		}
	}
}

window.onload = function () {
	id('content').style.width = window.screen.width + 'px';
	id('content').style.height = window.screen.height + 'px';
	let instance = new Music(songList[0]);
	id('play').onclick = function () {
		instance.audio.src = instance.audioSrc();
		instance.play();
	};
	instance.nextSong(id('next'));
	instance.preSong(id('pre'));
	instance.timeRefersh();
}
