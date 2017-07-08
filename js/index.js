//document.addcEventListener('plusready', onPlusReady,false);
//function onPlusReady(){
//	plus.io.resolveLocalFileSystemURL("手机存储/kgmusic/download.ver",function(entry){
//	   var directoryReader = entry.root.createReader();
//		directoryReader.readEntries( function( entries ){
//			var i;
//			for( i=0; i < entries.length; i++ ) {
//				alert( entries[i].name );
//			}
//		})
//	},function(e){
//		alert("读取系统文件失败: " + e.message);
//	})	
//
//}
var aSongId = [];//存放歌曲ID数组
var aSongArr=[]; //存放歌曲src的数组
var aSongNameArr = []; //存放歌曲名字的数组
var oPlayerBtn=true; //播放暂停开关
var oSingerImgArr = []; //存放歌手图片的数组
var iPlayLayout = 1; //歌曲的播放模式
var iSongCount = 0 ; //当前歌曲的索引
var iSongLrcArr = []; //存放歌曲歌词SRC数组
var oSongLrcBtn = true; //歌词开关
var oSongLrcTime = []; //存放歌词时间的数组
var oTimeFlag; // 事件播放标志
var iMusicVolume; //声音的全局变量


var sBigSingerImg = localStorage.getItem("LocalSingerImg");
var sSongSrc = localStorage.getItem("LocalSongsrc");
var sSongId = localStorage.getItem("LocalSongId");
var sSongName = localStorage.getItem("LocalSongName");  

var sloveCount = localStorage.getItem("love"); 
var sloveSingerImgSrc = localStorage.getItem("loveSingerImgSrc");
var sloveSongName = localStorage.getItem("loveSongName");
var sloveSongSrc = localStorage.getItem("loveSongSrc");
var sloveSongId = localStorage.getItem("loveSongId");

if(sloveCount){
var aloveCount = sloveCount.split("&"); 
var aloveSingerImgSrc = sloveSingerImgSrc.split("&"); 
var aloveSongName = sloveSongName.split("&"); 
var aloveSongSrc = sloveSongSrc.split("&"); 
var aloveSongId = sloveSongId.split("&"); 
}
    function getSongLrc(data){
    	var a;
		var b;
		for(var i=0;i<data.length;i++){
			if(data[i]=="{"){
				a = i;
				break;
				}
			}
		for(var j=data.length;i>0;j--){
			if(data[j] == "}"){
				b = j;
				break;
				}
				}
		var c = data.slice(a,b+1);
		var d = JSON.parse(c);
		return d;
    }
    var oInitBtn = false;
	if(sSongSrc){
		aSongArr =sSongSrc.split("&");
		aSongNameArr = sSongName.split("&");
		oSingerImgArr = sBigSingerImg.split("&");
	    aSongIdArr = sSongId.split("&");
  	}else{
  	    oInitBtn = true;
  	}
  	
  	var loveBtn = false;
  	if(sloveCount){
  		loveBtn = true;
  	}
  	//列表添加
    function historyAppendHtml(){
    	var oHistoryHtml = document.getElementById("history_html");
    	var oHistoryList = document.getElementById("history_list");
    	
    	 for(var i=0;i<aSongNameArr.length;i++){
    	        var oLi = document.createElement("li");
    	        oLi.innerHTML = oHistoryHtml.innerHTML;
    	        oHistoryList.appendChild(oLi);
    	        $(".songcount")[i].innerHTML = i+1;
    	        $(".history_songname")[i].innerHTML = aSongNameArr[i];
    	        $(".histry_songid")[i].innerHTML = aSongIdArr[i];
    	        if(loveBtn){
    	        	for(var j=0;j<aloveCount.length;j++){
    	 			if(i ==aloveCount[j]){
    	 			 	$(".addlike").eq(i).css("color","red");	
    	 			}
    	 		}
    	        }
    	        
    		}
    }

	//喜爱列表添加
	function LoveAppendHtml(){
    	var oLikeHtml = document.getElementById("like_html");
    	var oLikeList = document.getElementById("like_list");
    	var iFlag = localStorage.getItem("loveSongName");
		if(iFlag){
			var  aLikeName = localStorage.getItem("loveSongName").split("&");
    	 for(var i=0;i<aLikeName.length;i++){
    	        var oLi = document.createElement("li");
    	        oLi.innerHTML = oLikeHtml.innerHTML;
    	        oLikeList.appendChild(oLi);
    	        $(".like_songcount")[i].innerHTML = i+1;
    	        $(".like_songname")[i].innerHTML = aLikeName[i];
    	        $(".like_songid")[i].innerHTML = localStorage.getItem("loveSongId").split("&")[i];
    		}
    	 }
    }
   
   
  //对字符串进行比较判断 
 function judgeStr(str,localStr){
		var localStrArr= localStr.split("&");
		var bStrBtn = null;
		for(var i=0;i<localStrArr.length;i++){
			if(str == localStrArr[i] ){
				bStrBtn = false;
				break;
			}else{
				bStrBtn = true;
			}
		}
		return bStrBtn;
	} 
  


var MusicPlayer = {
	//音乐播放器初始化
	MusciPlayerInit:function(oMyAudio,oSingerImg,oMusicName){
		oSingerImg.src = "img/u=2450100757,137810381&fm=21&gp=0.jpg";
		oMusicName.innerHTML = "爱音乐，爱生活！"
	},
	//得到歌曲的总时长并将它转化为00:00的格式
	getSongEndTime:function(oMyAudio){
		var oMusicTime =  Math.floor(oMyAudio.duration);
		var iMinutes;
		var iSecands;
		if(Math.floor(oMusicTime/60)>10){
			iMinutes = Math.floor(oMusicTime/60);
		}else{
			iMinutes ="0"+ Math.floor(oMusicTime/60);
		}
		if(oMusicTime%60>10){
			iSecands = oMusicTime%60;
		}else{
			iSecands = "0" + oMusicTime%60; 
		}
    	return iMinutes + ":" + iSecands;
	},
	//得到歌曲的当前播放时长，并将它转化为00:00的格式
	getSongStartTime:function(oMyAudio,oTimeInner,oTimeInnerDiv,oTimeBtn,oTimeEnd){
		var oTimeStrat = document.getElementById("time_start");
		var iMinutes;
		var iSecands;
        var iWidth = oTimeInner.offsetWidth;
		setInterval(function(){
			var oMusicStratTime = Math.round(oMyAudio.currentTime);
			//时间得偏移量
			var oLeftOffset = oMusicStratTime/Math.round(oMyAudio.duration); 
			oTimeBtn.style.left = oLeftOffset*iWidth/100 + "rem";
		    oTimeInnerDiv.style.width = oLeftOffset*iWidth/100 + "rem";
		    
			if(Math.floor(oMusicStratTime/60)>9){
				iMinutes = Math.floor(oMusicStratTime/60);
	    	}else{
				iMinutes ="0"+ Math.floor(oMusicStratTime/60);
	   		}
			if(oMusicStratTime%60>9){
				iSecands = oMusicStratTime%60;
			}else{
				iSecands = "0" + oMusicStratTime%60;
			}
			oTimeStrat.innerHTML = iMinutes + ":" + iSecands;
			if(oMyAudio.error){
		       	MusicPlayer.MusicError(oMyAudio);
	          }
	},1000)				
    },
    //当歌曲发生错误时，执行的函数
	MusicError:function(oMyAudio,iPlayLayout,oSingerImg,oMusicName,oPlayerAndPause,oTimeEnd,oNowSong){
		MusicPlayer.MusicDown(oMyAudio,iPlayLayout,oSingerImg,oMusicName,oPlayerAndPause,oTimeEnd,oNowSong)	
	},
	//当歌曲播放结束时
	MusicEnd:function(oMyAudio,iPlayLayout,oSingerImg,oMusicName,oPlayerAndPause,oTimeEnd,oNowSong){
		var oGetAuidoObjTime;
		if(Number(iPlayLayout) === 1){
			iSongCount++;
			if(iSongCount>aSongArr.length-1){
	   	   		iSongCount = 0;
		   	}
			localStorage.setItem("oMusicCount",iSongCount);
	   	   	oMyAudio.src = aSongArr[iSongCount];
	   	   	oNowSong.innerHTML =  Number(iSongCount)+1;;
	   	   	oMyAudio.play();
	   	   	oGetAuidoObjTime = setInterval(function(){
			if(oMyAudio.readyState){
				oTimeEnd.innerHTML = MusicPlayer.getSongEndTime(oMyAudio);
				clearInterval(oGetAuidoObjTime);
			   }
		    },50);
	   	   	oMusicName.innerHTML = aSongNameArr[iSongCount];
			oSingerImg.src = oSingerImgArr[iSongCount];
			oPlayerAndPause.innerHTML = "&#xe607;";
		   	
		}else if(Number(iPlayLayout) === 2){
			localStorage.setItem("oMusicCount",iSongCount);
			oMyAudio.src = aSongArr[iSongCount];
			oNowSong.innerHTML = Number(iSongCount)+1;
			oMyAudio.play();
			oGetAuidoObjTime = setInterval(function(){
			if(oMyAudio.readyState){
				oTimeEnd.innerHTML = MusicPlayer.getSongEndTime(oMyAudio);
				clearInterval(oGetAuidoObjTime);
			   }
		    },50);
			oMusicName.innerHTML = aSongNameArr[iSongCount];
			oSingerImg.src = oSingerImgArr[iSongCount];
			oPlayerAndPause.innerHTML = "&#xe607;";
		}else if(Number(iPlayLayout) === 3){
		    iSongCount = Math.floor(Math.random()*(aSongArr.length-1));
		    localStorage.setItem("oMusicCount",iSongCount);
		    oMyAudio.src = aSongArr[iSongCount];
		    oNowSong.innerHTML =  Number(iSongCount)+1;
		    oMyAudio.play();
		    oGetAuidoObjTime = setInterval(function(){
			if(oMyAudio.readyState){
				oTimeEnd.innerHTML = MusicPlayer.getSongEndTime(oMyAudio);
				clearInterval(oGetAuidoObjTime);
			   }
		    },50);
		    oMusicName.innerHTML = aSongNameArr[iSongCount];
			oSingerImg.src = oSingerImgArr[iSongCount];
			oPlayerAndPause.innerHTML = "&#xe607;";
		}	
	},
	//上一首
	MusicUp:function(oMyAudio,oTimeEnd,oMusicName,oPlayerAndPause,oSingerImg,oNowSong,oSongLrc,oMusicImg){
		clearInterval(oTimeFlag);
		oPlayerBtn=false;
		var oGetAuidoObjTime;
		iSongCount--;
		if(iSongCount<0){
			iSongCount = aSongArr.length-1;
		}
		localStorage.setItem("oMusicCount",iSongCount);
		oMyAudio.src = aSongArr[iSongCount];
		oNowSong.innerHTML = Number(iSongCount)+1;
		oMyAudio.play();
		oMusicName.innerHTML = aSongNameArr[iSongCount];
		oSingerImg.src = oSingerImgArr[iSongCount];
		oPlayerAndPause.innerHTML = "&#xe607;";
		oGetAuidoObjTime = setInterval(function(){
			if(oMyAudio.readyState){
				oTimeEnd.innerHTML = MusicPlayer.getSongEndTime(oMyAudio);
				clearInterval(oGetAuidoObjTime);
			}
		},50)
	},
	//下一首
	MusicDown:function(oMyAudio,oTimeEnd,oMusicName,oPlayerAndPause,oSingerImg,oNowSong,oSongLrc,oMusicImg){
		clearInterval(oTimeFlag);
		oPlayerBtn=false;
		var oGetAuidoObjTime;
		iSongCount++;
		if(iSongCount>aSongArr.length-1){
			iSongCount = 0;
		}
		if(iSongLrcArr[Number(iSongCount)]==1){
			oSingerImg.style.display = "block";
			oSongLrc.innerHTML = "";
			oSongLrc.style.display = "none";
		}
		localStorage.setItem("oMusicCount",iSongCount);
		oMyAudio.src = aSongArr[iSongCount];
		oNowSong.innerHTML = Number(iSongCount)+1;
		oMyAudio.play();
		oMusicName.innerHTML = aSongNameArr[iSongCount];
		oSingerImg.src = oSingerImgArr[iSongCount];
		oPlayerAndPause.innerHTML = "&#xe607;";
		oGetAuidoObjTime = setInterval(function(){
			if(oMyAudio.readyState){
				oTimeEnd.innerHTML = MusicPlayer.getSongEndTime(oMyAudio);
				clearInterval(oGetAuidoObjTime);
			}
		},50)
	},
	//歌曲的音量的加和减
	MusicVolumeAddAndReduce:function(oMyAudio,oVolumeDiv,oVolumeInner,oVolumeBtn,oVolumeShow){
		var ev = ev || window.event;
		var iOffsetX = ev.offsetX;
		var iWidth = oVolumeDiv.offsetWidth;
		var iVolume = parseInt(iOffsetX/oVolumeDiv.offsetWidth*100)/100;
		localStorage.setItem("oVolume",iVolume);//声音的存储	
		oMyAudio.volume = iVolume;
		oVolumeBtn.style.left = iOffsetX/100 + "rem";
		oVolumeInner.style.width = iOffsetX/100 + "rem";
		if(iOffsetX/oVolumeDiv.offsetWidth*100<9){
			oVolumeShow.innerHTML = "0" + parseInt(iOffsetX/oVolumeDiv.offsetWidth*100);
		}else{
			oVolumeShow.innerHTML =  parseInt(iOffsetX/oVolumeDiv.offsetWidth*100);
		}
	},
	//是否静音
	MusicVolumeMuted:function(oMyAudio,oIconVolume,oIconVolumeBtn){
		if(oIconVolumeBtn){
			oMyAudio.muted = false;
			oIconVolume.innerHTML = "&#xe637;";
		}else{
			oMyAudio.muted = true ;
			oIconVolume.innerHTML = "&#xe673;";
		}
	},
	//播放和暂停
	MusciPauseAndPlay:function(oMyAudio,playerBtn,oPlayerAndPause){
		if(playerBtn){
			oMyAudio.play();
			oPlayerAndPause.innerHTML = "&#xe607;";
		}else{
			oMyAudio.pause();
			oPlayerAndPause.innerHTML = "&#xe63b;";
		}
		
	},
	//设置歌曲的播放时间
	setMusicPlayerTime:function(oMyAudio,oTimeInner,oTimeInnerDiv,oTimeBtn){
		var ev = ev || window.event;
		var iOffsetX = ev.offsetX;
		oTimeBtn.style.left = iOffsetX/100 + "rem";
		oTimeInnerDiv.style.width = iOffsetX/100 + "rem";
		var iWidth = oTimeInner.offsetWidth;
        var iNowMusciTime =  Math.round(oMyAudio.duration*(iOffsetX/iWidth));
        //为了兼容谷歌浏览器
        if('fastSeek' in oMyAudio){
           oMyAudio.fastSeek(iNowMusciTime);//改变audio.currentTime的值
         }else{
         	oMyAudio.currentTime = iNowMusciTime;
         }
	},
	//获取歌词
	MusicGetLyric:function(oMusicImg,oSingerImg,oSongLrc,oMyAudio,aLi){
		if(iSongLrcArr[Number(iSongCount)]==1){
			oSingerImg.style.display = "block";
			oSongLrc.innerHTML = "";
		}else{
			oSingerImg.style.display = "none"; 
			oSongLrc.style.display = "block";
            oSongLrc.innerHTML = "";
			$.get("http://mwbweixin.duapp.com/getSongLrc.php",{
				songid:aSongIdArr[iSongCount]
			},function(d){
			    var b = getSongLrc(d);
				var data  = b.showapi_res_body.lyric;
				var onearr = [];
				var twoarr = [];
				var onearrCount=0;
				var twoarrCount=0;
				var songArr = [];
				var songArrCount = 0;
				for(var i=0; i<data.length;i++){
					if(data[i]=="["){
						onearr[onearrCount] = i;
						onearrCount++;
					}
					if(data[i]=="]"){
						twoarr[twoarrCount] = i;
						twoarrCount++;
					}
				}
				for(var j=0; j<twoarr.length;j++){
					if(j<onearr.length){
						songArr[songArrCount] = data.slice(twoarr[j]+1,onearr[j+1]);
						songArrCount++;
					}
					if(j == onearr.length){
						songArr[songArrCount] = data.slice(twoarr[j],data.length);
					}
					//得到当前歌曲歌词的时间
					oSongLrcTime[j] = data.slice(onearr[j]+1,twoarr[j]);
				}
				oTimeFlag = MusicPlayer.MusicSongAndLrc(oMyAudio,aLi,oSongLrc);
				for(var h=0;h<songArr.length;h++){
					var oLi = document.createElement("li");
					oLi.innerHTML = songArr[h];
					oSongLrc.appendChild(oLi);
				}
			})
		}
		
	},
	//获取歌词时间数组
    MusicSongAndLrc:function(oMyAudio,aLi,oSongLrc){
    	var iHeight = 0.3;
    	var oSongLrcTimeArr = [];
    	var x;
    	var y;
    	var z;
    	for(var i=0;i<oSongLrcTime.length;i++){
    		for(var j=0;j<oSongLrcTime[i].length;j++){
    			if(oSongLrcTime[i][j] == ":"){
    				x = oSongLrcTime[i].slice(0,j);
    				y = oSongLrcTime[i].slice(j+1,oSongLrcTime[i].length);
    				z = Number(x)*60 + Math.round(Number(y));
    				oSongLrcTimeArr[i] = z;
    			}
    		}
    	}
    	var iLiCount = 0;
        var oSongLrcTimeInterval = setInterval(function(){
        	for(var h=0;h<oSongLrcTimeArr.length;h++){
        		if(Math.round(oMyAudio.currentTime) == oSongLrcTimeArr[h]){
        			for(var a=0;a<aLi.length;a++){
        				aLi[a].style.color = "#000";
        			}
        			aLi[h].style.color = "red";
        			if(h == oSongLrcTimeArr.length-1){
        				clearInterval(oSongLrcTimeInterval);
        			}
        		}
        	}
        },1000)
        //将强定时器返回，以便于在下一曲与上一曲时将他清除掉
        return oSongLrcTimeInterval;
    }
    
}


window.onload = function(){
	alert("请按F12键控制台，将模式转换成手机模式！");
	var oMyAudio = document.getElementById("myaudio");
	var oTimeEnd = document.getElementById("time_end");
	var oTimeStrat = document.getElementById("time_start");
	var oPlayerAndPause = document.getElementById("player_and_pause");
	var oAllSong = document.getElementById("all_song");
	var oNowSong = document.getElementById("now_song");
	var oSongLrc = document.getElementById("songlrc");
	var oNowMusic = document.getElementById("now_music");
    var oMusicImg = document.getElementById("music_img");
	var oSingerImg = document.getElementById("singer_Img");
	var oMusicName = document.getElementById("music_name");
	
	if(localStorage.getItem("LocalSongsrc")){
		MusicPlayer.MusciPlayerInit(oMyAudio,oSingerImg,oMusicName);
	}

	var iMusicCount = localStorage.getItem("oMusicCount");
	if(iMusicCount){
		iSongCount = iMusicCount;
	}
	

	
	oMyAudio.src = aSongArr[iSongCount];
    oAllSong.innerHTML = aSongArr.length;
    oNowSong.innerHTML = Number(iSongCount)+1;
    
    
    oMusicName.innerHTML = aSongNameArr[iSongCount];

    oSingerImg.src = oSingerImgArr[iSongCount];

    //从本地存储内拿到播放格式
    var oPlayLayout = document.getElementById("playlayout");
    var iLayout = localStorage.getItem("oMusicLayout");
    var aLayoutArr = ["&#xe610;","&#xe608;","&#xe638;"];
    if(iLayout){
    	iPlayLayout = iLayout;
    	oPlayLayout.innerHTML = aLayoutArr[iLayout-1];
    }else{	
    	oPlayLayout.innerHTML = aLayoutArr[0];
    }
    //给播放器规定播放模式，并且存储到本地存储内
    	oPlayLayout.onclick = function(){
      	 iPlayLayout++;               
      	 if(iPlayLayout === 2){
            oPlayLayout.innerHTML = "&#xe608;";
            localStorage.setItem("oMusicLayout",iPlayLayout);
      	 }else if(iPlayLayout === 3){
      	 	oPlayLayout.innerHTML = "&#xe638;";
      	 	localStorage.setItem("oMusicLayout",iPlayLayout);
      	 }
      	 if(iPlayLayout>3){
      	 	iPlayLayout = 1;
      	 	oPlayLayout.innerHTML = "&#xe610;";
      	 	localStorage.setItem("oMusicLayout",iPlayLayout);
      	 }
      }
    
      
    //监听歌曲是否结束  
    oMyAudio.addEventListener("ended",function(){
    	MusicPlayer.MusicEnd(oMyAudio,iPlayLayout,oSingerImg,oMusicName,oPlayerAndPause,oTimeEnd,oNowSong)
    })
	var oTimeInnerDiv = document.getElementById("time_inner_div");
    var oTimeBtn = document.getElementById("time_btn");
    var oTimeInner = document.getElementById("time_inner");
    //该定时器是为了获取当音乐就绪的的audio对象，因为当音乐没有就绪时，是不能获取到音乐的总时长的
    var oGetAuidoObjTime = setInterval(function(){
    	if(oMyAudio.readyState){
    	   oTimeEnd.innerHTML = MusicPlayer.getSongEndTime(oMyAudio);
    	   clearInterval(oGetAuidoObjTime);
         }
    },50)
    
	//启动获取即时播放时间函数
    MusicPlayer.getSongStartTime(oMyAudio,oTimeInner,oTimeInnerDiv,oTimeBtn,oTimeEnd);
    

    
    //音乐的上一首与下一首
    var oUpMusic = document.getElementById("up_music");
    var oDownMusic = document.getElementById("down_music");
    oUpMusic.onclick = function(){
    	MusicPlayer.MusicUp(oMyAudio,oTimeEnd,oMusicName,oPlayerAndPause,oSingerImg,oNowSong,oSongLrc,oMusicImg);
    	oSongLrcBtn = true;
    	 oBtn   = true ;
    }
    
    oDownMusic.onclick = function(){
    	MusicPlayer.MusicDown(oMyAudio,oTimeEnd,oMusicName,oPlayerAndPause,oSingerImg,oNowSong,oSongLrc,oMusicImg);
    	oSongLrcBtn = true;
    	oBtn   = true ;
    }
   //音乐的播放与暂停
   oPlayerAndPause.onclick = function(){
   	   MusicPlayer.MusciPauseAndPlay(oMyAudio,oPlayerBtn,oPlayerAndPause);
   	   oPlayerBtn = !oPlayerBtn;
   }
   //点击调整音乐的播放时间
   oTimeInner.onclick = function(){
   	  MusicPlayer.setMusicPlayerTime(oMyAudio,oTimeInner,oTimeInnerDiv,oTimeBtn);
   }
   //拖拽调整音乐播放时间
   
   
   //调整音乐的音量
   var oVolumeDiv = document.getElementById("volume_div");
   var oVolumeInner = document.getElementById("volume_inner");
   var oVolumeBtn = document.getElementById("volume_btn");
   var oVolumeShow = document.getElementById("volume_show");
   //将音量默认设置为50
   var iVolume = localStorage.getItem("oVolume");
   if(iVolume){
   		oMyAudio.volume = iVolume;
   }else{
   	 	oMyAudio.volume = 0.5;
   }
   oVolumeShow.innerHTML = oMyAudio.volume*100;
   oVolumeBtn.style.left = oVolumeDiv.offsetWidth*oMyAudio.volume/100 + "rem";
   oVolumeInner.style.width = oVolumeDiv.offsetWidth*oMyAudio.volume/100 + "rem";
   oVolumeDiv.onclick = function(){
   	MusicPlayer.MusicVolumeAddAndReduce(oMyAudio,oVolumeDiv,oVolumeInner,oVolumeBtn,oVolumeShow);
   }
   //静音设置
   var oIconVolume = $(".volume_icon")[0];
   var oIconVolumeBtn = false;
   oIconVolume.onclick = function(){
   	MusicPlayer.MusicVolumeMuted(oMyAudio,oIconVolume,oIconVolumeBtn);
   	oIconVolumeBtn = !oIconVolumeBtn;
   }
   
   //获取歌词与获取歌手图片之间的转换
   var aLi = oMusicImg.getElementsByTagName("li");
   var oBtn   = true ;
   oMusicImg.onclick = function(){
   	if(oSongLrcBtn){
   		oSongLrc.style.display = "block";
   		oSingerImg.style.display = "none";
   		   if(oBtn){
   		   		MusicPlayer.MusicGetLyric(oMusicImg,oSingerImg,oSongLrc,oMyAudio,aLi);
   		   		oBtn = false;
   		   }
   			oSongLrcBtn = false;
   	}else{
   		oSongLrc.style.display = "none";
   		oSingerImg.style.display = "block";
   		oSongLrcBtn = true;
   		clearInterval(oTimeFlag);
   	}
   	
   }
   
   var oDiscover = document.getElementById("discover");
   oDiscover.onclick = function(){
   	 window.open("search.html","_self");
   }
   var oCancel = document.getElementById("cancel");
   oCancel.onclick = function(){
			window.history.back();
		}
   //对历史添加点击事件
   var oHistoryIcon = document.getElementById("history_icon");
   var History = document.getElementById("history");
   var HistoryBtn = true;
   oHistoryIcon.onclick = function(){
   	if(HistoryBtn){
   		History.style.display = "block";
   	}else{
   		History.style.display = "none";
   	}
   	HistoryBtn = !HistoryBtn;
   }
   
   //对喜欢添加点击事件
   var oLikeIcon = document.getElementById("like_icon");
   var oLike = document.getElementById("like");
   var oLikeList = document.getElementById("like_list");
   var LikeBtn = true;
   oLikeIcon.onclick = function(){
   	if(LikeBtn){
   		oLike.style.display = "block";
   		oLikeList.innerHTML = "";
   		LoveAppendHtml();
   	}else{
   		oLike.style.display = "none";
   	}
   	LikeBtn = !LikeBtn;
   }
   
   //对历史记录获取
   historyAppendHtml();
 
   //对我喜欢添加点击函数
   var oAddLike = $(".addlike");
   oAddLike.live("click",function(){
   	var n = oAddLike.index(this);
   	$(".addlike").eq(n).css("color","red");
   	var sloveCountFlag = localStorage.getItem("love");
	var sloveSingerImgSrcFlag = localStorage.getItem("loveSingerImgSrc");
	var sloveSongNameFlag = localStorage.getItem("loveSongName");
	var sloveSongSrcFlag = localStorage.getItem("loveSongSrc");
	var sloveSongIdFlag = localStorage.getItem("loveSongId");
 	if(sloveCountFlag || sloveCount==0){
 		var oLoveFlagBtn = judgeStr(n,sloveCountFlag);
 		if(oLoveFlagBtn){
   		sloveCountFlag = sloveCountFlag + "&" + n;
   		sloveSingerImgSrcFlag = sloveSingerImgSrcFlag + "&" + oSingerImgArr[n];
   		sloveSongNameFlag = sloveSongNameFlag + "&" + aSongNameArr[n];
   		sloveSongSrcFlag = sloveSongSrcFlag + "&" + aSongArr[n];
   		sloveSongIdFlag =  sloveSongIdFlag + "&" + aSongIdArr[n];
   		
   		localStorage.setItem("love",sloveCountFlag);
   		localStorage.setItem("loveSingerImgSrc",sloveSingerImgSrcFlag);
   		localStorage.setItem("loveSongName",sloveSongNameFlag);
   		localStorage.setItem("loveSongSrc",sloveSongSrcFlag);
   		localStorage.setItem("loveSongId",sloveSongIdFlag);
   	}else{
   		if(confirm("当前歌曲，已加入喜欢列表，再次确认表示从喜欢列表中删除，请选择是否确认！")){
   			$(".addlike").eq(n).css("color","#000");
   			var aLoveArr = sloveCountFlag.split("&");
   			var aSingerFlagArr = sloveSingerImgSrcFlag.split("&");
   			var aSongNameFlag = sloveSongNameFlag.split("&");
   			var aSongSrcFlag = sloveSongSrcFlag.split("&");
   			var aSongIdFlag = sloveSongIdFlag.split("&");
   			for(var i=0;i<aLoveArr.length;i++){
   				if(aLoveArr[i] == n){
   					aLoveArr.splice(i,1);
   					aSingerFlagArr.splice(i,1);
			   		aSongNameFlag.splice(i,1);
			   		aSongSrcFlag.splice(i,1);
			   		aSongIdFlag.splice(i,1);	
			   		localStorage.setItem("love", aLoveArr.join("&"));
			   		localStorage.setItem("loveSingerImgSrc",aSingerFlagArr.join("&"));
			   		localStorage.setItem("loveSongName",aSongNameFlag.join("&"));
			   		localStorage.setItem("loveSongSrc",aSongSrcFlag.join("&"));
			   		localStorage.setItem("loveSongId",aSongIdFlag.join("&"));
   				}
   			}	
   		}
   	}
   	}else{
   		localStorage.setItem("love",n);
   		localStorage.setItem("loveSingerImgSrc",oSingerImgArr[n]);
   		localStorage.setItem("loveSongName",aSongNameArr[n]);
   		localStorage.setItem("loveSongSrc",aSongArr[n]);
   		localStorage.setItem("loveSongId",aSongIdArr[n]);
   		
   	}
   })
  
  //删除歌曲
  var oDelete = $(".delete");
  var oHistoryList = document.getElementById("history_list");
  
  oDelete.live("click",function(){
  	var n = oDelete.index(this);
  	var aHistoryLi = oHistoryList.getElementsByTagName("li");
  	if(confirm("确认删除这首歌曲吗？")){
  		var aDSingerImg = localStorage.getItem("LocalSingerImg").split("&");
		var aDSongSrc = localStorage.getItem("LocalSongsrc").split("&");
		var aDSongId = localStorage.getItem("LocalSongId").split("&");
		var aDSongName = localStorage.getItem("LocalSongName").split("&");
		for(var i=0; i<aDSongId.length;i++){
			if(aDSongId[n]==aDSongId[i]){
				aDSingerImg.splice(i,1);
				aDSongSrc.splice(i,1);
				aDSongId.splice(i,1);
				aDSongName.splice(i,1);
				localStorage.setItem("LocalSingerImg",aDSingerImg.join("&"));
				localStorage.setItem("LocalSongsrc",aDSongSrc.join("&"));
				localStorage.setItem("LocalSongId",aDSongId.join("&"));
				localStorage.setItem("LocalSongName",aDSongName.join("&"));
				if(oAddLike.eq(n)[0].style.color == "red"){
					var aLoveArr = localStorage.getItem("love").split("&");
		   			var aSingerFlagArr = localStorage.getItem("loveSingerImgSrc").split("&");
		   			var aSongNameFlag = localStorage.getItem("loveSongName").split("&");
		   			var aSongSrcFlag = localStorage.getItem("loveSongSrc").split("&");
		   			var aSongIdFlag = localStorage.getItem("loveSongId").split("&");
		   			for(var i=0;i<aLoveArr.length;i++){
		   				if(aLoveArr[i] == n){
		   					aLoveArr.splice(i,1);
		   					aSingerFlagArr.splice(i,1);
					   		aSongNameFlag.splice(i,1);
					   		aSongSrcFlag.splice(i,1);
					   		aSongIdFlag.splice(i,1);	
					   		localStorage.setItem("love", aLoveArr.join("&"));
					   		localStorage.setItem("loveSingerImgSrc",aSingerFlagArr.join("&"));
					   		localStorage.setItem("loveSongName",aSongNameFlag.join("&"));
					   		localStorage.setItem("loveSongSrc",aSongSrcFlag.join("&"));
					   		localStorage.setItem("loveSongId",aSongIdFlag.join("&"));
		   				}
		   			}
				}
			}
		}
  		oHistoryList.removeChild(aHistoryLi[n]);
  	}	
  })
  
 document.getElementById("about").onclick = function(){
 		window.open("about.html","_self");
 	
 }
  
  
//var oHistorySongName =   $(".history_songname");
// 
// oHistorySongName.live("click",function(){
// 		var n = oHistorySongName.index(n);
// 		oMyAudio.src = aSongArr[n];
// 		oMyAudio.play();
// 		oSingerImg.innerHTML = oSingerImgArr[n];
// 		oMusicName.innerHTML = aSongNameArr[n];
// 		iSongCount = n ; 
// })
}
