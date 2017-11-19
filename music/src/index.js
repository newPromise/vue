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
	}
];

let lyrics = ["[ti:浮夸][ar:陈奕迅][al:U-87][by:(5nd音乐网)www.5nd.com][offset:500][00:05.00]曲: C.Y. Kong 词: 黄伟文[00:10.00]专辑：U-87[00:29.39]有人问我 我就会讲[00:32.50]但是无人来[00:36.43]我期待 到无奈[00:38.07]有话要讲 得不到装载[00:42.94]我的心情犹像樽盖等被揭开[00:47.14]咀巴却在养青苔[00:50.01]人潮内 愈文静[00:51.49]愈变得 不受理睬[00:53.97]自己要搅出意外[00:56.66]像突然地高歌[01:00.42]任何地方也像开四面[01:04.05]着最闪的衫 扮十分感慨[01:07.63]有人来拍照 要记住插袋[02:34.32][01:12.08]你当我是浮夸吧[02:37.63][01:15.62]夸张只因我很怕[02:41.15][01:19.12]似木头 似石头的话" +
"[02:44.60][01:22.52]得到注意吗[02:46.90][01:24.86]其实怕被忘记[02:48.94][01:26.91]至放大来演吧[02:52.21][01:29.81]很不安 怎去优雅[02:55.40][01:33.32]世上还赞颂沉默吗[02:59.17][01:36.96]不够爆炸[03:01.71][01:39.59]怎么有话题 让我夸[03:04.98][01:42.98]做大娱乐家[03:08.35][01:45.24]欢迎您[01:51.36]那年十八 母校舞会[01:54.59]站着如喽罗[01:58.33]那时候 我含泪[02:00.24]发誓各位 必须看到我[02:04.85]在世间平凡又普通的路太多[02:09.10]无知你住哪一座[02:11.93]情爱中 工作中[02:13.49]受过的忽视太多[02:15.91]自尊已饱经跌堕[02:18.63]重视能治肚饿[02:22.40]未曾获得过 便知我为何[02:25.76]大动作很多 犯下这些错[02:29.63]搏人们看着我 算病态么[03:19.53]幸运儿并不多[03:23.04]若然未当过就知我为何[03:26.41]用十倍苦心 做突出一个[03:30.21]正常人够我 富议论性么[03:34.69]你叫我做浮夸吧[03:38.25]加几声嘘声也不怕[03:41.79]我在场 有闷场的话[03:45.21]表演你看吗 够歇斯底里吗[03:49.46]以眼泪淋花吧[03:52.84]一心只想你惊讶[03:56.05]我旧时似未存在吗[03:59.74]加重注码 青筋也现形" +
"[04:04.36]话我知 现在存在吗[04:09.88]凝视我 别再只看天花[04:17.75]我非你杯茶 也可尽情地喝吧[04:23.84]别遗忘有人在 为你声沙[00:00.05]下歌词www.5nd.Com "];

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
