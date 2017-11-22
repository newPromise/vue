function id (idName) {
	return document.getElementById(idName);
}


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
	this.audio = id('audio');
	this.songIndex = 0;
	this.song = song;
	this.lyricCase = [];
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
      id('toPlay').className = 'icon-pcduanbizhixiazaicishutubiao1 iconfont ';
    } else {
      id('toPlay').className = 'icon-pcduanbizhixiazaicishutubiao iconfont ';
    }
	},
	// 歌曲时间刷新
	timeRefersh: function() {
		let that = this;
		let lastPauseTime = '';
		let lastLyric = '';
		let lastScrollTop = 0;
		console.log('status', that.status);
		that.audio.ontimeupdate = function () {
			if (that.status === 'pause') {
				id('lyric').innerHTML = lastLyric;
				return;
			} else {
				id('lyric').innerHTML = '';
			}
      let minute;
      let seconds;
      let scrollIndex = 0;
			let scrollTop;
      for (let a of that.lyricCase) {
        if (that.audio.currentTime > a[0]) {
          id('lyric').innerHTML += "<span>" + a[1] + "</span>";
          scrollIndex += 1;
        }
			}
			id('lyric').scrollTop = lastScrollTop + 30;
			lastScrollTop = id('lyric').scrollTop;
			console.log(id('lyric').scrollTop);
			lastLyric = id('lyric').innerHTML;
			if (that.audio.currentTime >= that.audio.duration) {
				that.status = 'pause';
				that.playBtnChange();
			}
      id('progressBar').style.width = (that.audio.currentTime / that.audio.duration) * parseInt(id('content').style.width) + 'px';
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
      id('time').innerText = getTime(that.audio.currentTime).m + ':' + getTime(that.audio.currentTime).s + ' / ';
			id('time').innerText +=  getTime(that.audio.duration).m + ':' + getTime(that.audio.duration).s;
		}
	}
}

function request () {
	var ajax = new XMLHttpRequest();
	//步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端
	ajax.open('get', 'http://localhost:8090/');
	//步骤三:发送请求
	ajax.send();
	//步骤四:注册事件 onreadystatechange 状态改变就会调用
	ajax.onreadystatechange = function () {
		 if (ajax.readyState==4 &&ajax.status==200) {
			//步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
	　　　　lyrics = JSON.parse(ajax.responseText);//输入相应的内容
		　}
	}
}




window.onload = function () {
	request();
	id('content').style.width = window.screen.width + 'px';
	id('content').style.height = window.screen.height + 'px';
	let instance = new Music(songList[0]);
	id('play').onclick = function () {
		if (!instance.audio.src) {
			instance.audio.src = instance.audioSrc();
		}
    instance.play();
    instance.playBtnChange();
	};
	instance.nextSong(id('next'));
	instance.preSong(id('pre'));
	instance.timeRefersh();
}
