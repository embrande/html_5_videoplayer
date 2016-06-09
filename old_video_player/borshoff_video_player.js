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
			videoControls = $('.videoControls');
			requiredVideo = true;
		});
		
	/*********
		// THIS IS THE CONSTRUCTOR FUNCTION
	**********/
		var VideoPlayer = function(videoTag){
			this.videoTag = videoTag;
			this.$videoTag = $(videoTag);
			this.videoContainer = this.$videoTag.closest('.video_container');
			this.fullScreenToggleButton = this.videoContainer.find('.fullScreen');
			this.playButton = this.videoContainer.find('.play');
			this.parentElement = this.videoContainer.parent();
			this.init();
		}
			
	
	var videoPlayer = {
		
		//defines full screen for each video to be false on initiation
		isFullScreen: false,
	
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

			// When play, pause buttons are pressed.
			this.handleButtonPresses();
			
			// When the full screen button is pressed...
			this.fullScreenToggleButton.on("click", function(){
				
				that.isFullScreen ? that.fullScreenOff(this) : that.fullScreenOn(this);
			
			});
			
			
			this.videoScrubbing();
		},
		initializeControls : function() {
			// When all meta information has loaded, show controls
			// and set the progress bar.
			if ( isVideoFullScreen ){
				this.videoTag = $(fullVideo).closest('.full-video')[0];
			}
			var m1 = parseInt((this.videoTag.duration / 60) % 60);
			var s1 = parseInt(this.videoTag.duration % 60);
			this.$videoTag.closest('.video_container').find('.timeTotal').html(m1 + ":" + s1);
			this.showHideControls();
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
		
		playAndDetect : function(){
			var fullVideo = $(".full-video video")[0];
			currentlyPlaying = fullVideo;
			fullVideo.play();
			this.trackPlayProgress();						
		},
		
		fullScreenOn : function(t) {
			this.isFullScreen = true;
			this.videoContainer.appendTo('body').addClass('fullScreen');
			this.fullScreenToggleButton.children('span').removeClass('icon-FS').addClass('icon-FS_Filled');
			this.postFullScreenAction();
		},
		
		
		fullScreenOff : function(t) {
			this.isFullScreen = false;
			this.videoContainer.appendTo(this.parentElement).removeClass('fullScreen');
			this.fullScreenToggleButton.children('span').removeClass('icon-FS_Filled').addClass('icon-FS');
			this.postFullScreenAction();
		},
		
		
		postFullScreenAction : function(){
			if ( this.isPlaying ){
				this.play();
			}
		},
		
		
		
		
		handleButtonPresses : function() {
			
			var that = this,
				playPauseCallback = function(){
					that.playPause();
				};
			var videoContainerPlay = $(this).closest('.video_container').find('.play');
			
			this.playButton.on('click', playPauseCallback);
			
			if(this.videoTag != null){
				// When the video or play button is clicked, play/pause the video1.
				this.videoTag.addEventListener('click', playPauseCallback, false);
				
				this.videoTag.addEventListener('play', function() {
					//play.title = 'Pause';
					that.playButton.html('<span class="icon-pause"></span>');
					that.trackPlayProgress();				
				}, false);
				
				// When the pause button is pressed, 
				// switch to the "Play" symbol.
				this.videoTag.addEventListener('pause', function() {
					//play.title = 'Play';
					that.playButton.html('<span class="icon-play"></span>');
					that.stopTrackingPlayProgress();
				}, false);
				
				// When the video has concluded, pause it.
				this.videoTag.addEventListener('ended', function() {
					this.currentTime = 0;
					that.pause();
					that.fullScreenOff();
				}, false);
			}
			
		//end of handleButtonPresses
		},
		
		play: function(){
			this.isPlaying = true;
			this.videoTag.play();
			this.videoContainer.addClass('video-carousel-playing video-carousel-has-played');
		},
		
		pause: function(){
			this.isPlaying = false;
			this.videoTag.pause();
			this.videoContainer.removeClass('video-carousel-playing');
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
				this.play();
			}
			else { 
				this.pause();
				
			}
			return false;
		},
		
		
		
		// Every 50 milliseconds, update the play progress. 
		trackPlayProgress : function(){
			
			var that = this;
			
			(function progressTrack() {
				 that.updatePlayProgress();
				 playProgressInterval = setTimeout(progressTrack, 50);
			 })();
		},
		
	
		updatePlayProgress : function(){
			
			var videoContainer = $(this.videoTag).closest('.video_container');
			var progressBoxFunction = videoContainer.find('.progress_box')[0];
			var playProgressBarFunction = videoContainer.find('.play_progress')[0];
			var playProgressTime = videoContainer.find('.timeAt')[0];
			var videoTag = this.videoTag;
			
			if ( isVideoFullScreen ){
				videoContainer = $(fullVideo).closest('.full-video');
				progressBoxFunction = videoContainer.find('.progress_box')[0];
				playProgressBarFunction = videoContainer.find('.play_progress')[0];
				playProgressTime = videoContainer.find('.timeAt')[0];
				videoTag = fullVideo;
			}
			
      		var m = parseInt((videoTag.currentTime / 60) % 60);
     		var s = parseInt(videoTag.currentTime % 60);
			
			
			playProgressBarFunction.style.width = ((videoTag.currentTime / videoTag.duration) * (progressBoxFunction.offsetWidth)) + "px";
			
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
				
				that.stopTrackingPlayProgress();
				
				//this.playPause;
				
				document.onmousemove = function(e) {
				  that.setPlayProgress( e.pageX );
				}
				
				this.onmouseup = function(e) {
					document.onmouseup = null;
					document.onmousemove = null;
										
					that.play();
					that.setPlayProgress( e.pageX );
					that.trackPlayProgress();
				}
			});
		},
		
		setPlayProgress : function( clickX ) {
			var videoTagSelect = $(this.videoTag).closest('.video_container'),
				progressBoxFunction = videoTagSelect.find('.progress_box')[0],
				progressPlayFunction = videoTagSelect.find('.play_progress')[0];
			
			var newPercent = Math.max( 0, Math.min(1, (clickX - this.findPosX(progressBoxFunction) -  videoTagSelect.find('.progress').offset().left) / progressBoxFunction.offsetWidth) );
			
			this.videoTag.currentTime = newPercent * this.videoTag.duration;
			
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
		
		$('.video_container video').each(function(index, element) {
			new VideoPlayer(this);
		});
		
    });
	
	
	
	
	
	
	
	
	
		
	
	
	
	
	
	
		
}( this, document, jQuery ));	