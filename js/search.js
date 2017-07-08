/*
 * 这里定义的是全局变量，存储歌曲必要数据的
 */
var aSongIdArr = [];//存放歌曲Id的数组
var aBigSongImgArr = [];//歌曲封面数组
var aSongSrcArr = [];//歌曲Src存放数组
var aDownUrlArr = [];//歌曲下载地址数组
var aSingerNameArr = [];//存放歌手名字Id数组
var aSingerIdArr = [];//存放歌手ID数组
var aSongNameArr = [];//存放歌曲名字的数组 



		var oSongVal = document.getElementById("search");
		var oAd = document.getElementById("ad");
		var oSearchBtn = document.getElementById("search_btn");
		var oSongHtml = document.getElementById("songhtml");
		//var oFooter = document.getElementById("footer");
		var oCancel = document.getElementById("cancel");
		
		oSongVal.onfocus = function(){
			window.open("newsearch.html","_self");
			if(oSongVal.value == "海量音乐任你搜索"){
				oSongVal.value = "";
			}
		}
		oSongVal.onblur = function(){
			if(oSongVal.value == ""){
				oSongVal.value = "海量音乐任你搜索";
			}
		}
		oCancel.onclick = function(){
			window.history.back();
		}
		
    function getHotData(hotid,bigObj,oCount,oSongName,oHtml){
    	   $.ajax({
				  type: "GET",
				  url: "http://mwbweixin.duapp.com/getHotSong.php",
				  data:"hotId="+hotid,
				  success:function(data){
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
							oLi.innerHTML = oHtml.innerHTML;
							bigObj.appendChild(oLi);
						    var oSongCount = $(oCount);
						    var oSongN = $(oSongName); 
							oSongCount[h].innerHTML = h+1;
							oSongN[h].innerHTML = d[h].songname;
							//数据的存储
							if(hotid == 5){
								aSongNameArr[h]= d[h].songname;
								aSongIdArr[h] = d[h].songid;
								aBigSongImgArr[h] = d[h].albumpic_big;
								aSongSrcArr[h] = d[h].url;
								aDownUrlArr[h] = d[h].downUrl;
								aSingerIdArr[h] = d[h].singerid;
							}else if(hotid == 3){
								aSongNameArr[h+100]= d[h].songname;
								aSongIdArr[h+100] = d[h].songid;
								aBigSongImgArr[h+100] = d[h].albumpic_big;
								aSongSrcArr[h+100] = d[h].url;
								aDownUrlArr[h+100] = d[h].downUrl;
								aSingerIdArr[h+100] = d[h].singerid;
							}else if(hotid == 6){
								aSongNameArr[h+200]= d[h].songname;
								aSongIdArr[h+200] = d[h].songid;
								aBigSongImgArr[h+200] = d[h].albumpic_big;
								aSongSrcArr[h+200] = d[h].url;
								aDownUrlArr[h+200] = d[h].downUrl;
								aSingerIdArr[h+200] = d[h].singerid;
							}
							
						}
		        }
    	   });
		}
    var oInlandCon = document.getElementById("inland_content");
	var oEaCon = document.getElementById("ea_content");
	var oHongkCon = document.getElementById("hongk_content");
	
	var oIhtml = document.getElementById("i_html");
	var oEhtml = document.getElementById("e_html");
	var oHhtml = document.getElementById("h_html");
	
	getHotData(5,oInlandCon,".i_songcount",".i_songname",oIhtml); 
	getHotData(3,oEaCon,".e_songcount",".e_songname",oEhtml);
	getHotData(6,oHongkCon,".h_songcount",".h_songname",oHhtml);

	//对localStorage中的字符串进行比对，判断是否出现于其中存储的相等的src
	function judgeStr(str,localStr){
		var localStrArr= localStr.split("&");
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
	function songDataSave(n,start,end){
		if(confirm("请确认是否在WLAN环境下运行，非WLAN环境将消耗大量流量！")){
		var songSrc = aSongSrcArr.slice(start,end);
		var aBigSongImg = aBigSongImgArr.slice(start,end);
		var aSongId = aSongIdArr.slice(start,end);
		var aSongName =  aSongNameArr.slice(start,end);
		
	    var sBigSingerImg = localStorage.getItem("LocalSingerImg");
	    var sSongSrc = localStorage.getItem("LocalSongsrc");
	    var sSongId = localStorage.getItem("LocalSongId");
	    var sSongName = localStorage.getItem("LocalSongName");
	    
	    if(sBigSingerImg){
	    	var oBtn =  judgeStr(aBigSongImg[n],sBigSingerImg);
	    	if(oBtn){
	    		sBigSingerImg = sBigSingerImg+"&"+aBigSongImg[n];
	    		sSongSrc = sSongSrc + "&" + songSrc[n];
	    		sSongId = sSongId + "&" + aSongId[n];
	    		sSongName = sSongName + "&"+ aSongName[n];
	    		
	    		localStorage.setItem("LocalSingerImg",sBigSingerImg);
	    		localStorage.setItem("LocalSongsrc",sSongSrc);
	    		localStorage.setItem("LocalSongId",sSongId);
	    		localStorage.setItem("LocalSongName",sSongName);
	    	}
	    }else{
	    	localStorage.setItem("LocalSingerImg",aBigSongImg[n]);
	    	localStorage.setItem("LocalSongsrc",songSrc[n]);
	    	localStorage.setItem("LocalSongId",aSongId[n]);
	    	localStorage.setItem("LocalSongName",aSongName[n]);
	    }
		}
	}
	
	$(".i_addsong").live("click",function(){
		var n = $(".i_addsong").index(this);
		songDataSave(n,0,100);
	})
	
	$(".e_addsong").live("click",function(){ 
		var n = $(".e_addsong").index(this);
		songDataSave(n,100,200);
	})
	
	$(".h_addsong").live("click",function(){
		var n = $(".h_addsong").index(this);
		songDataSave(n,200,300);
	})
	
	var oPlayer = document.getElementById("player");
	oPlayer.onclick = function(){
		window.open("index.html","_self");
		
	}
