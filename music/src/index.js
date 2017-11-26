

const songList = [
	{
		singer: '张杰',
		songName: '勿忘心安'
	},
	{
		singer: '陈奕迅',
		songName: '浮夸'
	},
	{
		singer: '陈奕迅',
		songName: '十年'
	},
	{
		singer: '戴荃',
		songName: '悟空'
	}
];

let lyrics = [];
function Music (song) {
	this.status = 'pause';
	this.audio = $('#audio')[0];
	this.songIndex = 0;
	this.song = song;
	this.lyricCase = [];
	this.alllyrics();
	if (this.song) {
		this.singer = this.song.singer;
		this.time = this.song.time;
		this.songName = this.song.songName;
  }
}

Music.prototype = {
	// 播放
	play: function() {
    let that = this;
		if (that.status === 'pause') {
			that.audio.play();
			that.status = 'play';
		} else {
			that.pause();
		}
		that.refreshSong();
		that.getSong();
	},
	// 停止
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
		nextBtn.onclick = () => {
			that.getSong(true);
			that.audio.src = that.audioSrc();
			that.audio.play();
			this.status = 'play';
			that.playBtnChange();
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
			that.playBtnChange();
		}
	},
	// 侧边栏歌词列表
	alllyrics: function() {
		let that = this;
		let allLyrics = '';
		songList.map((value, index, list) => {
			let singlesong = `<a class="lyricLink" href="javascript:void(0)">${value.songName} - ${value.singer}</a>`;
			allLyrics += singlesong;
		});
		$('.musicCase').html(allLyrics);
	  for (let index = 0; index < $('.lyricLink').length; index++) {
			$(`.lyricLink:eq(${index})`).click(function() {
				that.songIndex = index;
				that.getSong();
				that.audio.src = that.audioSrc();
				that.audio.play();
				that.status = 'play';
				that.playBtnChange();
			})
		}
	},
	// 从歌曲列表中得到歌曲
	// 同时更新歌词以及歌词信息
	getSong: function(isNext) {
		let that = this;
		if (isNext === true) {
			that.songIndex ++;
		} else if (isNext === false){
			that.songIndex --;
		}
		that.songIndex = that.songIndex < 0 ? (songList.length - 1) : (that.songIndex >= songList.length ? 0 : that.songIndex);
		that.song = songList[that.songIndex];
		that.refreshSong();
		that.lyricActions();
	},
	// 更新歌曲名称以及作者
	refreshSong: function() {
		let that = this;
		$('#songMsg').text(`${that.song.songName} - ${that.song.singer}`);
	},
	// 控制音量变化
	volumeBarAct: function() {
		let that = this;
		let isMouseDown = false;
		let startX = 0;
		let moveX = 0;
		let moveLeft = 0;
		let moveWid = 0;
		let left = 0;
		let barWid = 0;
		$('.bar').css('width', $('.volume-bar').css('width'));
		$('.volume-btn').css('left', $('.volume-bar').css('width'));
		$('.volume-btn').mousedown((e) => {
			isMouseDown = true;
			Left = $('.volume-btn').css('left');
			Left = parseInt(Left, 0);
			barWid = $('.bar').css('width');
			barWid = parseInt(barWid);
		})
		$('.volume-bar').mousedown((e) => {
			if (!isMouseDown) return;
			startX = e.clientX;
		})
		$('.controlbar').mousemove((e) => {
			if (!isMouseDown) return;
			moveX = e.clientX;
			moveWid = moveX - startX + barWid;
			$('.bar').css('width', moveWid)
			moveLeft = moveX - startX + Left;
			$('.volume-btn').css('left', moveLeft);
			that.audio.volume = parseInt($('.bar').css('width')) / parseInt($('.volume-bar').css('width'));
		})
		$('.controlbar').mouseup(() => {
			isMouseDown = false;
			moveX = 0;
			startX = 0;
		})
	},
  // 获取到播放歌曲的 地址信息
	audioSrc: function() {
		let that = this;
		return '../data/music/' + this.song.singer + ' - ' + this.song.songName + '.mp3';
  },
  // 歌词处理
  lyricActions: function() {
		let that = this;
		that.lyricCase = [];
		if (!lyrics[that.songIndex]) return;
		let pattern = /\[\d{2}:\d{2}.\d{2}\]/g;
		let result = lyrics[that.songIndex].match(pattern);
		let s;
		// 转化为秒
		function toSecondes(time) {
			let m = time.split(':')[0];
			let se = time.split(':')[1].split('.')[0];
			let ms = time.split(':')[1].split('.')[1];
			return Number(m) * 60 + Number(se) + Number(ms) / 1000;
		}

		// 转化为二维数组 [[时间:歌词]] 的形式
		for (let a of result) {
			let startIndex = lyrics[that.songIndex].indexOf(a);
			let endIndex = lyrics[that.songIndex].indexOf(result[result.indexOf(a) + 1]);
			s = lyrics[that.songIndex].slice(startIndex, endIndex);
			let time = s.slice(s.indexOf('[') + 1, s.indexOf(']'));
			let value = s.replace(pattern, '');
			that.lyricCase.push([toSecondes(time), value]);
		}
		// 当存在两个时间的时候
		that.lyricCase.map((item, index) => {
			if (!item[1]) {
				item[1] = that.lyricCase[index + 1][1];
			}
		})
		// 进行排序
		that.lyricCase.sort(function (a, b) {
			return a[0] - b[0];
		})
	},
	// 改变播放按钮
	playBtnChange: function() {
		if (this.status === 'play') {
			$('#toPlay').removeClass('icon-pcduanbizhixiazaicishutubiao');
      $('#toPlay').addClass('icon-pcduanbizhixiazaicishutubiao1');
    } else {
			$('#toPlay').removeClass('icon-pcduanbizhixiazaicishutubiao1');
			$('#toPlay').addClass('icon-pcduanbizhixiazaicishutubiao')
    }
	},
	// 歌曲时间刷新
	timeRefersh: function() {
		let that = this;
		let lastPauseTime = '';
		let lastLyric = '';
		let lastScrollTop = 0;
		that.audio.ontimeupdate = function () {
			let minute;
      let seconds;
      let scrollIndex = 0;
			let scrollTop;
			if (that.status === 'pause') {
				$('#lyric').html(lastLyric);
				return;
			} else {
				$('#lyric').html(+$('#lyric').html());
			}
      for (let a of that.lyricCase) {
        if (that.audio.currentTime > a[0]) {
          $('#lyric').html($('#lyric').html() + "<span>" + a[1] + "</span>");
          scrollIndex += 1;
        }
			}
			$('#lyric').scrollTop(lastScrollTop + 30);
			lastScrollTop = $('#lyric').scrollTop();
			lastLyric = $('#lyric').html();
			if (that.audio.currentTime >= that.audio.duration) {
				that.status = 'pause';
				that.playBtnChange();
			}
      $('#progressBar').css('width', (that.audio.currentTime / that.audio.duration) * parseInt($('#content').css('width')));
      let getTime = function (time) {
        let m;
        let s;
        m = parseInt(time / 60);
        m = m >= 1 ? `0${m}` : `00`;
        s = parseInt(time - m * 60) || 0;
        s = s < 10 ? `0${s}` : s;
        return {
          s, m
        }
      };
      $('#time').text(getTime(that.audio.currentTime).m + ':' + getTime(that.audio.currentTime).s + ' / ');
			$('#time').text($('#time').text() + getTime(that.audio.duration).m + ':' + getTime(that.audio.duration).s);
		}
	}
}

// ajax 请求
function ajax() {
	$.get('http://localhost:8090/', {}, function (data) {
		lyrics = JSON.parse(data);
	})
}


$(document).ready(function () {
	ajax();
	$('#content').css('width', window.screen.width + 'px');
	$('#content').css('height', window.screen.height + 'px');
	let instance = new Music(songList[0]);
	$('#play').bind('click', function() {
		if (!instance.audio.src) {
			instance.audio.src = instance.audioSrc();
		}
    instance.play();
    instance.playBtnChange();
	});
	instance.nextSong($('#next')[0]);
	instance.preSong($('#pre')[0]);
	instance.timeRefersh();
	instance.volumeBarAct();
	$('.slideLyrics').mouseenter(() => {
		$('.musicCaseWrapper').addClass('musicCaseShow');
	});
	$('.musicCase').mouseleave(() => {
		console.log('this', this);
	  $('.musicCaseWrapper').removeClass('musicCaseShow');
	})
});
