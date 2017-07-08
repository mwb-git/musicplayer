var aSongIdArr = [];//存放歌曲Id的数组
var aBigSongImgArr = [];//歌曲封面数组
var aSongSrcArr = [];//歌曲Src存放数组
var aDownUrlArr = [];//歌曲下载地址数组
var aSingerNameArr = [];//存放歌取名字Id数组
var aSingerIdArr = [];//存放歌手ID数组
var aSongNameArr = [];//存放歌曲名字的数组 



		var oSongVal = document.getElementById("search");
		var oList = document.getElementById("list");
		var oSearchBtn = document.getElementById("search_btn");
		var oAd = document.getElementById("ad");
		var oSongHtml = document.getElementById("songhtml");
		var oCancel = document.getElementById("cancel");
		oSongVal.focus();
		oCancel.onclick = function(){
			window.history.back();
		}
		oSearchBtn.onclick = function(){
			oList.innerHTML = "";
			$.get("http://mwbweixin.duapp.com/test.php",{
				songname:oSongVal.value,
				page:"1"
			},function(data){
				var a;
				var b;
				for(var i=0;i<data.length;i++){
					if(data[i]=="["){
						a = i;
						break;
					}
				}
				for(var j=data.length;i>0;j--){
					if(data[j] == "]"){
						b = j;
						break;
					}
				}
				var c = data.slice(a,b+1);
				var d = JSON.parse(c);	
				for(var h=0;h<d.length;h++){
					var oLi = document.createElement("li");
					oLi.innerHTML = oSongHtml.innerHTML;
					oList.appendChild(oLi);
				    var oSongCount = $(".songcount");
				    var oSongName = $(".song_name");
				    var oSinger = $(".singer");	 
					oSongCount[h].innerHTML = h;
					oSongName[h].innerHTML = d[h].songname;
					oSinger[h].innerHTML = d[h].singername;
					//数据的存储
					aSongIdArr[h] = d[h].songid;
					aBigSongImgArr[h] = d[h].albumpic_big;
					aSongSrcArr[h] = d[h].m4a;
					aDownUrlArr[h] = d[h].downUrl;
					aSingerIdArr[h] = d[h].singerid;
					aSongNameArr[h] = d[h].songname;
				}
			})
		}
//对localStorage中的字符串进行处理
    function StrsliceArr(str){
    	var aFlagArr = [];
    	var aFlagArrCount = 0;
    	aFlagArr[0] = 0;
    	var aNewArr = [];
    	for(var i=0;i<str.length;i++){
    		if(str[i]=="&"){
    			aFlagArrCount++;
    			aFlagArr[aFlagArrCount] = i;
    		}
    	}
    	for(var j=0;j<aFlagArr.length;j++){
    		 if(j==0){
    		 	aNewArr[j] = str.slice(aFlagArr[j],aFlagArr[j+1]);
    		 }else if(j==aFlagArr.length-1){
    		 	aNewArr[j] = str.slice(aFlagArr[j]+1);	
    		 }else{
    		 	aNewArr[j] = str.slice(aFlagArr[j]+1,aFlagArr[j+1]);
    		 }
    	}
    	return aNewArr;
    }
	
	//对localStorage中的字符串进行比对，判断是否出现于其中存储的相等的src
	function judgeStr(str,localStr){
		var localStrArr= StrsliceArr(localStr);
		var bStrBtn;
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
	
	//对歌曲数据进行本地存储
	function songDataSave(n){
		if(confirm("请确认是否在WLAN环境下运行，非WLAN环境将消耗大量流量！")){
	    var sBigSingerImg = localStorage.getItem("LocalSingerImg");
	    var sSongSrc = localStorage.getItem("LocalSongsrc");
	    var sSongId = localStorage.getItem("LocalSongId");
	    var sSongName = localStorage.getItem("LocalSongName");
	    if(sBigSingerImg){
	    	var oBtn =  judgeStr(aBigSongImgArr[n],sBigSingerImg);
	    	if(oBtn){
	    		sBigSingerImg = sBigSingerImg+"&"+ aBigSongImgArr[n];
	    		sSongSrc = sSongSrc + "&" + aSongSrcArr[n];
	    		sSongId = sSongId + "&" + aSongIdArr[n];
	    		sSongName = sSongName + "&"+ aSongNameArr[n];
	    		
	    		localStorage.setItem("LocalSingerImg",sBigSingerImg);
	    		localStorage.setItem("LocalSongsrc",sSongSrc);
	    		localStorage.setItem("LocalSongId",sSongId);
	    		localStorage.setItem("LocalSongName",sSongName);
	    	}
	    }else{
	    	localStorage.setItem("LocalSingerImg",aBigSongImgArr[n]);
	    	localStorage.setItem("LocalSongsrc",aSongSrcArr[n]);
	    	localStorage.setItem("LocalSongId",aSongIdArr[n]);
	    	localStorage.setItem("LocalSongName",aSongNameArr[n]);
	      }
		}
	}		
		
		
		$("li").live("click",function(){
			var n = $("li").index(this);
		    songDataSave(n);
		}) 
		
