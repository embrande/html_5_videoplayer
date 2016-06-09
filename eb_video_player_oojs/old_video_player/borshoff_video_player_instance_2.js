(function( window, document, $) { 
	
		//var video = $('video')[0], 
		var videoControls = $('.videoControls'),	 
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
			this.$videoTag = $(videoTag);
			this.fullScreenToggleButton = $('.fullScreen', videoTag);
			this.playButton = this.$videoTag.closest('.video_container').find('.play');
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
			if(this.videoTag != null){
				this.videoTag.removeAttribute('controls');
				// When meta data is ready, show the controls
				this.videoTag.addEventListener(
					'loadeddata', 
					function(){
						 that.initializeControls();
					},  
					false
				);
			}
	
			if(fullVideo != null){
				fullVideo.removeAttribute('controls');
				fullVideo.addEventListener('loadeddata', this.initializeControlsFullVideo, false);
				fullVideo.addEventListener('loadeddata', this.playAndDetect, false);
			}

			// When play, pause buttons are pressed.
			this.handleButtonPresses();
			
			// When the full screen button is pressed...
			this.fullScreenToggleButton.on("click", function(){
				
				isVideoFullScreen ? that.fullScreenOff(this) : that.fullScreenOn(this);
			
			});
			
			
			this.videoScrubbing();
		},
		
		
		initializeControls : function() {
			// When all meta information has loaded, show controls
			// and set the progress bar.
			var m1 = parseInt((this.videoTag.duration / 60) % 60);
			var s1 = parseInt(this.videoTag.duration % 60);
			this.videoTag.closest('.video_container').find('.timeTotal').html(m1 + ":" + s1);
			this.showHideControls();
		},
		
		initializeControlsFullVideo : function() {
			// When all meta information has loaded, show controls
			// and set the progress bar.
			var m4 = parseInt(($('#fullVideo').get(0).duration / 60) % 60);
			var s4 = parseInt($('#fullVideo').get(0).duration % 60);
			$('#fullVideo').closest('.video_container').find('.timeTotal').html(m4 + ":" + s4);
			videoPlayer.showHideControlsFullVideo();
		},
		
		showHideControls : function() {
			// Shows and hides the video player.
			this.videoTag.addEventListener('mouseover', function() {
				$(this).parent().find('.videoControls').css({"opacity":1});
			}, false);
			
			
			this.videoTag.addEventListener('mouseout', function() {
				$(this).parent().find('.videoControls').css({"opacity":0});
			}, false);
			
			videoControls.on('mouseover', function() {
				$(this).css({"opacity":1});
			});
			
			videoControls.on('mouseout', function() {
				$(this).css({"opacity":0});
			});
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
			this.trackPlayProgress();						
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
		
		
		
		
		handleButtonPresses : function() {
			
			this.playButton.on('click', this.playPause);
			
			var that = this;
			
			// When the play button is pressed, 
			// switch to the "Pause" symbol.
			
			
			
			if(this.videoTag != null){
				// When the video or play button is clicked, play/pause the video1.
				this.videoTag.addEventListener('click', this.playPause, false);
				
				this.videoTag.addEventListener('play', function() {
					//play.title = 'Pause';
					$(this).closest('.video_container').find('.play').html('<span class="icon-pause"></span>')
					that.trackPlayProgress();				
				}, false);
				
				// When the pause button is pressed, 
				// switch to the "Play" symbol.
				this.videoTag.addEventListener('pause', function() {
					//play.title = 'Play';
					$(this).closest('.video_container').find('.play').html('<span class="icon-play"></span>');
					that.stopTrackingPlayProgress();
				}, false);
				
				// When the video has concluded, pause it.
				this.videoTag.addEventListener('ended', function() {
					this.currentTime = 0;
					this.pause();
				}, false);
			}
			
			
			
			
			if(fullVideo != null){
				
				play = $('.play');
				
				play.on('click', this.playPause);
				//play.addEventListener('click', this.playPause, false);
				
				fullVideo.addEventListener('click', this.playPause, false);
				// When the play button is pressed, 
				// switch to the "Pause" symbol.
				fullVideo.addEventListener('play', function() {
					//play.title = 'Pause';
					$(this).closest('.video_container').find('.play').html('<span class="icon-pause"></span>')
					that.trackPlayProgress();				
				}, false);
				// When the pause button is pressed, 
				// switch to the "Play" symbol.
				fullVideo.addEventListener('pause', function() {
					//play.title = 'Play';
					$(this).closest('.video_container').find('.play').html('<span class="icon-play"></span>');
					that.stopTrackingPlayProgress();
				}, false);
				
				
				// When the video has concluded, pause it.
				fullVideo.addEventListener('ended', function() {
					this.currentTime = 0;
					this.pause();
				}, false);
			}
			
		//end of handleButtonPresses
		},
		
		
		
		playPause: function() {		
			
			var id_selector = this.videoTag;
			
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
			
			var that = this;
			
			(function progressTrack() {
				 that.videoTag.updatePlayProgress();
				 playProgressInterval = setTimeout(progressTrack, 50);
			 })();
		},
		
	
		updatePlayProgress : function(){
			
			var videoContainer = $(this.videoTag).closest('.video_container');
			var progressBoxFunction = videoContainer.find('.progress_box')[0];
			var playProgressBarFunction = videoContainer.find('.play_progress')[0];
			var playProgressTime = videoContainer.find('.timeAt')[0];
      		var m = parseInt((this.videoTag.currentTime / 60) % 60);
     		var s = parseInt(this.videoTag.currentTime % 60);
			
			playProgressBarFunction.style.width = ((this.videoTag.currentTime / this.videoTag.duration) * (progressBoxFunction.offsetWidth)) + "px";
			
			if ( s < 10 ) {
				videoContainer.find('.timeAt').html(m + ":0" + s);
			}else{
				videoContainer.find('.timeAt').html(m + ":" + s);
			}
			
		},
		
		
		// Video was stopped, so stop updating progress.
		stopTrackingPlayProgress : function(){
			clearTimeout( playProgressInterval );
		},
		
		
		videoScrubbing : function() {
			
			var that = this,
				videoContainer = $(this.videoTag).closest('.video_container'),
				progressContainer = $(".progress", videoContainer), 
				progressHolder = $(".progress_box", videoContainer), 
				playProgressBar = $(".play_progress", videoContainer); 
				
			progressHolder.on("mousedown", function(){
				var id_selector = that.videoTag;
				
				if(id_selector != null){
					id_selector.pause();
				}
				
				that.videoTag.stopTrackingPlayProgress();
				
				//this.playPause;
				
				document.onmousemove = function(e) {
				  that.videoTag.setPlayProgress( e.pageX );
				}
				
				this.onmouseup = function(e) {
					document.onmouseup = null;
					document.onmousemove = null;
										
					that.videoTag.play();
					that.videoTag.setPlayProgress( e.pageX );
					that.videoTag.trackPlayProgress();
				}
			});
		},
		
		setPlayProgress : function( clickX ) {
			var videoTagSelect = $(this.videoTag).closest('.video_container'),
				progressBoxFunction = videoTagSelect.find('.progress_box')[0],
				progressPlayFunction = videoTagSelect.find('.play_progress')[0];
			
			var newPercent = Math.max( 0, Math.min(1, (clickX - this.findPosX(progressBoxFunction) -  videoTagSelect.find('.progress').offset().left) / progressBoxFunction.offsetWidth) );
			
			this.videoTag.currentTime = newPercent * playing.duration;
			
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