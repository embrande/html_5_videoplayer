(function( window, document, $) { 
	
		//var video = $('video')[0], 
		var video1 = $('.vpv_container video')[0], 
		video2 = $('.vpv_container video')[1], 
		video3 = $('.vpv_container video')[2], 
		video4 = $('.vpv_container video')[3],
		videoControls = $('.videoControls'),	 
		play = $('.play'), 
		
		playProgressInterval,
		isVideoFullScreen = false,

		drag = {
			elem: null,
			x: 0,
			y: 0,
			state: false
		},
		
		progressContainer = $(".progress"), 
		progressHolder = $(".progress_box"), 
		playProgressBar = $(".play_progress"), 
		
		fullScreenToggleButton = $(".fullScreen"),
		
		currentlyPlaying;
		var fullVideo;
		var requiredVideo = false;
		
		var ie = (function() {
			// borrowed from Padolsey
		    var undef,
		        v = 3,
		        div = document.createElement('div'),
		        all = div.getElementsByTagName('i');
		    
		    while (
		        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
		        all[0]
		    );
		    
		    return v > 4 ? v : undef;
		    
		}());
	
		$('.full-video').livequery(function() {
			fullVideo = $('.full-video video')[0];
			videoControls = $('.videoControls');
			requiredVideo = true;
			videoPlayer.init();
		});
			
			
		var VideoPlayer = function(videoTag){
			this.videoTag = videoTag;
			this.init();
		}
			
	
		var videoPlayer = {
	
		init : function() {
			// If IE 8 or less, get outta here. 
			if ( ie < 9 ) return;
			
			// this is equal to the videoPlayer object.
			var that = this;
			
			// Helpful CSS trigger for JS. 
			document.documentElement.className = 'js';
			
			// Get rid of the default controls, because we'll use our own.
			if(video1 != null){
				video1.removeAttribute('controls');
				// When meta data is ready, show the controls
				video1.addEventListener('loadeddata', this.initializeControls1, false);
			}
			
			if(video2 != null){
				video2.removeAttribute('controls');
				video2.addEventListener('loadeddata', this.initializeControls2, false);
			}
			if(video3 != null){
				video3.removeAttribute('controls');
				video3.addEventListener('loadeddata', this.initializeControls3, false);
			}
			if(video4 != null){
				video4.removeAttribute('controls');
				video4.addEventListener('loadeddata', this.initializeControls4, false);
			}
			if(fullVideo != null){
				fullVideo.removeAttribute('controls');
				fullVideo.addEventListener('loadeddata', this.initializeControlsFullVideo, false);
				fullVideo.addEventListener('loadeddata', this.playAndDetect, false);
			}

			// When play, pause buttons are pressed.
			this.handleButtonPresses();
			
			// When the full screen button is pressed...
			fullScreenToggleButton.on("click", function(){
				
				//var selector = $(this).closest('.video_container').find('video').attr('id');
				//var id_selector = document.getElementById(selector);
				
				isVideoFullScreen ? that.fullScreenOff(this) : that.fullScreenOn(this);
			});
			
			
			this.videoScrubbing();
		},
		
		
		initializeControls1 : function() {
			// When all meta information has loaded, show controls
			// and set the progress bar.
			var m1 = parseInt(($('#video1').get(0).duration / 60) % 60);
			var s1 = parseInt($('#video1').get(0).duration % 60);
			$('#video1').closest('.video_container').find('.timeTotal').html(m1 + ":" + s1);
			videoPlayer.showHideControls1();
		},
		initializeControls2 : function() {
			// When all meta information has loaded, show controls
			// and set the progress bar.
			var m2 = parseInt(($('#video2').get(0).duration / 60) % 60);
			var s2 = parseInt($('#video2').get(0).duration % 60);
			$('#video2').closest('.video_container').find('.timeTotal').html(m2 + ":" + s2);
			videoPlayer.showHideControls2();
		},
		initializeControls3 : function() {
			// When all meta information has loaded, show controls
			// and set the progress bar.
			var m3 = parseInt(($('#video3').get(0).duration / 60) % 60);
			var s3 = parseInt($('#video3').get(0).duration % 60);
			$('#video3').closest('.video_container').find('.timeTotal').html(m3 + ":" + s3);
			videoPlayer.showHideControls3();
		},
		initializeControls4 : function() {
			// When all meta information has loaded, show controls
			// and set the progress bar.
			var m4 = parseInt(($('#video4').get(0).duration / 60) % 60);
			var s4 = parseInt($('#video4').get(0).duration % 60);
			$('#video4').closest('.video_container').find('.timeTotal').html(m4 + ":" + s4);
			videoPlayer.showHideControls4();
		},
		initializeControlsFullVideo : function() {
			// When all meta information has loaded, show controls
			// and set the progress bar.
			var m4 = parseInt(($('#fullVideo').get(0).duration / 60) % 60);
			var s4 = parseInt($('#fullVideo').get(0).duration % 60);
			$('#fullVideo').closest('.video_container').find('.timeTotal').html(m4 + ":" + s4);
			videoPlayer.showHideControlsFullVideo();
		},
		
		showHideControls1 : function() {
			// Shows and hides the video player.
			video1.addEventListener('mouseover', function() {
				$(this).parent().find('.videoControls').css({"opacity":1});
			}, false);
			
			
			video1.addEventListener('mouseout', function() {
				$(this).parent().find('.videoControls').css({"opacity":0});
			}, false);
			
			
			
			
			
			videoControls.on('mouseover', function() {
				$(this).css({"opacity":1});
			});
			
			videoControls.on('mouseout', function() {
				$(this).css({"opacity":0});
			});
		},
		showHideControls2 : function() {
			// Shows and hides the video player.
			video2.addEventListener('mouseover', function() {
				$(this).parent().find('.videoControls').css({"opacity":1});
			}, false);
			
			video2.addEventListener('mouseout', function() {
				$(this).parent().find('.videoControls').css({"opacity":0});
			}, false);
			
			
		},
		showHideControls3 : function() {
			// Shows and hides the video player.
			
			video3.addEventListener('mouseover', function() {
				$(this).parent().find('.videoControls').css({"opacity":1});
			}, false);
			
			video3.addEventListener('mouseout', function() {
				$(this).parent().find('.videoControls').css({"opacity":0});
			}, false);
			
			
		},
		showHideControls4 : function() {
			// Shows and hides the video player.
			video4.addEventListener('mouseover', function() {
				$(this).parent().find('.videoControls').css({"opacity":1});
			}, false);
			video4.addEventListener('mouseout', function() {
				$(this).parent().find('.videoControls').css({"opacity":0});
			}, false);
		},
		showHideControlsFullVideo : function() {
			// Shows and hides the video player.
			fullVideo.addEventListener('mouseover', function() {
				$(this).parent().find('.videoControls').css({"opacity":1});
			}, false);
			fullVideo.addEventListener('mouseout', function() {
				$(this).parent().find('.videoControls').css({"opacity":0});
			}, false);
			
			
			
			
			videoControls.on('mouseover', function() {
				$(this).css({"opacity":1});
			});
			
			videoControls.on('mouseout', function() {
				$(this).css({"opacity":0});
			});
		},
		playAndDetect : function(){
			var fullVideo = $(".full-video video").get(0);
			currentlyPlaying = fullVideo;
			fullVideo.play();
			videoPlayer.trackPlayProgress();						
		},
		
		fullScreenOn : function(t) {
			isVideoFullScreen = true;
			var selector = $(t).closest('.video_container').find('video').attr('id');
			var videoURL = $(t).data("bannervideo");
			var id_selector = document.getElementById(selector);
			
			
			$(id_selector).closest('.video_container').find('.fullScreen').addClass( "fs-active" ).html('<span class="icon-FS_Filled"></span>');
			
			
			$('body').prepend('<div class="full-video" id="full-video"><div class="full-video-relative video_container"><div class="ex"><i class="fa fa-times"></i></div><video src="'+videoURL+'" class="video" id="fullVideo"></video><script>document.getElementById("fullVideo").addEventListener("ended",myHandler,false);function myHandler(e) {var vid = document.getElementById( "full-video" );vid.parentNode.removeChild(vid);}</script><div class="videoControls"><button class="play" title="Play"><span class="icon-play"></span></button><div class="progress"><div class="progress_box" id="p_b_1"><span class="play_progress"></span></div></div><div class="timeStamp"><div class="timeAt">0:00</div><div class="separator">&#124;</div><div class="timeTotal"></div></div></div></div></div>');
				
			// Listen for escape key. If pressed, close fullscreen.
			document.addEventListener('keydown', this.checkKeyCode, false);
		},
		
		
		fullScreenOff : function(t) {
			isVideoFullScreen = false;
			
			var selector = $(t).closest('.video_container').find('video').attr('id');
			var id_selector = document.getElementById(selector);
			
			id_selector.style.position = 'static';
			$(id_selector).removeClass('fullsizeVideo');
			id_selector.style.cssText = '';
			$(id_selector).closest('.video_container').find('.videoControls').removeClass('fs-control' );
			$(id_selector).closest('.video_container').find('.fullScreen').removeClass( "fs-active" ).html('<span class="icon-FS"></span>');
		},
		
		
		/*
	
	
	$(document).on('click', '.fullScreen', function( e ){
		var videoURL = $(this).data("bannervideo");
		$('body').prepend('<div class="full-video" id="full-video"><div class="full-video-relative video_container"><div class="ex"><i class="fa fa-times"></i></div><video src="'+videoURL+'" class="video" id="fullVideo"  muted></video><script>document.getElementById("fullVideo").addEventListener("ended",myHandler,false);function myHandler(e) {var vid = document.getElementById( "full-video" );vid.parentNode.removeChild(vid);}</script><div class="videoControls"><button class="play" title="Play"><span class="icon-play"></span></button><div class="progress"><div class="progress_box" id="p_b_1"><span class="play_progress"></span></div></div><div class="timeStamp"><div class="timeAt">0:00</div><div class="separator">&#124;</div><div class="timeTotal"></div></div></div></div></div>');
				
			carousel.carousel_center_video( $('#fullVideo') );
	});
		
		*/
		
		
		
		
		
		
		
		
		
		
		handleButtonPresses : function() {
			
			play.on('click', this.playPause);
			
			// When the play button is pressed, 
			// switch to the "Pause" symbol.
			
			
			
			if(video1 != null){
				// When the video or play button is clicked, play/pause the video1.
				video1.addEventListener('click', this.playPause, false);
				video1.addEventListener('play', function() {
					//play.title = 'Pause';
					$(this).closest('.video_container').find('.play').html('<span class="icon-pause"></span>')
					videoPlayer.trackPlayProgress();				
				}, false);
				// When the pause button is pressed, 
				// switch to the "Play" symbol.
				video1.addEventListener('pause', function() {
					//play.title = 'Play';
					$(this).closest('.video_container').find('.play').html('<span class="icon-play"></span>');
					videoPlayer.stopTrackingPlayProgress();
				}, false);
				
				
				// When the video has concluded, pause it.
				video1.addEventListener('ended', function() {
					this.currentTime = 0;
					this.pause();
				}, false);
			}
			
			
			
			
			if(video2 != null){
				video2.addEventListener('click', this.playPause, false);
				// When the play button is pressed, 
				// switch to the "Pause" symbol.
				video2.addEventListener('play', function() {
					//play.title = 'Pause';
					$(this).closest('.video_container').find('.play').html('<span class="icon-pause"></span>')
					videoPlayer.trackPlayProgress();				
				}, false);
				// When the pause button is pressed, 
				// switch to the "Play" symbol.
				video2.addEventListener('pause', function() {
					//play.title = 'Play';
					$(this).closest('.video_container').find('.play').html('<span class="icon-play"></span>');
					videoPlayer.stopTrackingPlayProgress();
				}, false);
				
				
				// When the video has concluded, pause it.
				video2.addEventListener('ended', function() {
					this.currentTime = 0;
					this.pause();
				}, false);
			}
			
			
			
			
			if(video3 != null){
				video3.addEventListener('click', this.playPause, false);
				// When the play button is pressed, 
				// switch to the "Pause" symbol.
				video3.addEventListener('play', function() {
					//play.title = 'Pause';
					$(this).closest('.video_container').find('.play').html('<span class="icon-pause"></span>')
					videoPlayer.trackPlayProgress();				
				}, false);
				// When the pause button is pressed, 
				// switch to the "Play" symbol.
				video3.addEventListener('pause', function() {
					//play.title = 'Play';
					$(this).closest('.video_container').find('.play').html('<span class="icon-play"></span>');
					videoPlayer.stopTrackingPlayProgress();
				}, false);
				
				
				// When the video has concluded, pause it.
				video3.addEventListener('ended', function() {
					this.currentTime = 0;
					this.pause();
				}, false);
			}
			
			
			
			
			
			if(video4 != null){
				video4.addEventListener('click', this.playPause, false);
				// When the play button is pressed, 
				// switch to the "Pause" symbol.
				video4.addEventListener('play', function() {
					//play.title = 'Pause';
					$(this).closest('.video_container').find('.play').html('<span class="icon-pause"></span>')
					videoPlayer.trackPlayProgress();				
				}, false);
				// When the pause button is pressed, 
				// switch to the "Play" symbol.
				video4.addEventListener('pause', function() {
					//play.title = 'Play';
					$(this).closest('.video_container').find('.play').html('<span class="icon-play"></span>');
					videoPlayer.stopTrackingPlayProgress();
				}, false);
				
				
				// When the video has concluded, pause it.
				video4.addEventListener('ended', function() {
					this.currentTime = 0;
					this.pause();
				}, false);
			}
			
			
			
			
			
			if(fullVideo != null){
				/*
				$('body').on('click', '.play', function(e){
					videoPlayer.playPause();
				});
				*/
				play = $('.play');
				play.on('click', this.playPause);
				//play.addEventListener('click', this.playPause, false);
				
				fullVideo.addEventListener('click', this.playPause, false);
				// When the play button is pressed, 
				// switch to the "Pause" symbol.
				fullVideo.addEventListener('play', function() {
					//play.title = 'Pause';
					$(this).closest('.video_container').find('.play').html('<span class="icon-pause"></span>')
					videoPlayer.trackPlayProgress();				
				}, false);
				// When the pause button is pressed, 
				// switch to the "Play" symbol.
				fullVideo.addEventListener('pause', function() {
					//play.title = 'Play';
					$(this).closest('.video_container').find('.play').html('<span class="icon-play"></span>');
					videoPlayer.stopTrackingPlayProgress();
				}, false);
				
				
				// When the video has concluded, pause it.
				fullVideo.addEventListener('ended', function() {
					this.currentTime = 0;
					this.pause();
				}, false);
			}
		},
		
		
		
		playPause: function() {		
			//var playSelector = $(this).attr('class');
			//var selector = $('.'+playSelector+'').closest('.video_container').find('video').attr('id');
			var selector = $(this).closest('.video_container').find('video').attr('id');
			
			var id_selector = document.getElementById(selector);
			
			if ( ( currentlyPlaying != null) && ( currentlyPlaying != id_selector )){
				currentlyPlaying.pause();
			}
			
			currentlyPlaying = id_selector;
			
			
			if ( id_selector.paused || id_selector.ended ) {				
				if ( id_selector.ended ) {
					 id_selector.currentTime = 0; 
				}
				id_selector.play();
			}
			else { 
				id_selector.pause();
				
			}
			return false;
		},
		
		
		
		
		
		
		
		
		
		
		
		// Every 50 milliseconds, update the play progress. 
		trackPlayProgress : function(){
			
			//video1.addEventListener('click', this.playPause, false);
			//play.on('click', this.playPause);
			//var selector = $(this).closest('.video_container').find('video').attr('id');
			//var id_selector = document.getElementById(selector);
			(function progressTrack() {
				 videoPlayer.updatePlayProgress();
				 playProgressInterval = setTimeout(progressTrack, 50);
			 })();
		},
		
	
		updatePlayProgress : function(){
			var playing = currentlyPlaying;
			var playingID = currentlyPlaying.id;
			var progressBoxFunction = $('#'+playingID).closest('.video_container').find('.progress_box').get(0);
			var playProgressBarFunction = $('#'+playingID).closest('.video_container').find('.play_progress').get(0);
			var playProgressTime = $('#'+playingID).closest('.video_container').find('.timeAt').get(0);
      		var m = parseInt((playing.currentTime / 60) % 60);
     		var s = parseInt(playing.currentTime % 60);
			
			playProgressBarFunction.style.width = ((playing.currentTime / playing.duration) * (progressBoxFunction.offsetWidth)) + "px";
			
			if ( s < 10 ) {
				$('#'+playingID).closest('.video_container').find('.timeAt').html(m + ":0" + s);
			}else{
				$('#'+playingID).closest('.video_container').find('.timeAt').html(m + ":" + s);
			}
			
		},
		
		
		// Video was stopped, so stop updating progress.
		stopTrackingPlayProgress : function(){
			clearTimeout( playProgressInterval );
		},
		
		
		videoScrubbing : function() {
			
		
			progressContainer = $(".progress"), 
			progressHolder = $(".progress_box"), 
			playProgressBar = $(".play_progress"), 
			progressHolder.on("mousedown", function(){
				var selector = $(this).closest('.video_container').find('video').attr('id');
				var id_selector = document.getElementById(selector);
				
				if(currentlyPlaying != null){
					currentlyPlaying.pause();
				}
				
				currentlyPlaying = id_selector;
				
				
				
				videoPlayer.stopTrackingPlayProgress();
				
				//this.playPause;
				
				document.onmousemove = function(e) {
				  videoPlayer.setPlayProgress( e.pageX );
				}
				
				this.onmouseup = function(e) {
					document.onmouseup = null;
					document.onmousemove = null;
										
					currentlyPlaying.play();
					videoPlayer.setPlayProgress( e.pageX );
					videoPlayer.trackPlayProgress();
				}
			});
		},
		
		setPlayProgress : function( clickX ) {
			
			var playing = currentlyPlaying;
			var playingID = currentlyPlaying.id;
			var progressBoxFunction = $('#'+playingID).closest('.video_container').find('.progress_box').get(0);
			var progressPlayFunction = $('#'+playingID).closest('.video_container').find('.play_progress').get(0);
			
			var newPercent = Math.max( 0, Math.min(1, (clickX - this.findPosX(progressBoxFunction) -  $('#'+playingID).closest('.video_container').find('.progress').offset().left) / progressBoxFunction.offsetWidth) );
			
			playing.currentTime = newPercent * playing.duration;
			
			progressPlayFunction.style.width = newPercent * (progressBoxFunction.offsetWidth)  + "px";
			
		},
		
		findPosX : function(progressHolder) {
			
			var progressHolder2 = progressHolder.id;
			
			var curleft = progressHolder.offsetLeft;
			while( progressHolder > progressHolder.offsetParent ) {
				curleft += progressHolder.offsetLeft;
			}
			return curleft;
			
		},
		
		// Determines if the escape key was pressed.
		checkKeyCode : function(e) {
			e = e || window.event;
			if ( (e.keyCode || e.which) === 27 ) videoPlayer.fullScreenOff();
		}
		
	};
	
	//videoPlayer.init();
	VideoPlayer.prototype = videoPlayer;
	$('.vpv_container video').each(function(index, element) {
        new VideoPlayer(this);
    });
	
	
	
	$(window).resize(function(e){
		/*
		var playing = currentlyPlaying;
		var playProgressBarFunction = $('#'+playingID).closest('.video_container').find('.play_progress').get(0);
		
		playProgressBarFunction.style.width = ((playing.currentTime / playing.duration) * (progressBoxFunction.offsetWidth)) + "px";
		*/
	});
	
	$(document).ready(function(e) {
		/*
		*/
  		$(".vpv_container").owlCarousel({
		  slideSpeed : 300,
		  paginationSpeed : 400,
		  singleItem:true,
		});
    });
	
	
	
	
	
	
	
	
	
		
	
	
	
	
	
	
		
}( this, document, jQuery ));	