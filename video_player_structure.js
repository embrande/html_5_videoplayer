var html_5_video_player_eb = (function (html_5_video_player_eb) {


	var CreateVideoControls = function(singleVideo){
		//hide controls
		//get or create video controls: play, pause, playbar, timestamp, videoclick, fullscreen.
	};
	Object.defineProperties(CreateVideoControls.prototype, {
   		//register control events
   			//make sure it counters with the other objects. Ex. if play is press all videos in said object are paused.
	});


	var RegisterControl = function(videoControl){
		
	};
	Object.defineProperties(RegisterControl.prototype, {
   		
	});


	var CreateSingleVideo = function(videoContainerElement){
		//	get all video tag dependancies (direct children)
		//  var selectionCount = document.querySelectorAll("#window > section").length;
		//	get all direct children divs and add class and id
		//	add to array and loop through array
	};
	Object.defineProperties(CreateSingleVideo.prototype, {
		//	add each video to the object and pass it to CreateVideoControls
        __wrapVideoTagInDiv: {
        	get: function(){
	        },
	        set: function(value){
	        }
        },
        __addClassID: {
        	get: function(){
	        },
	        set: function(value){
	        }
        }
   	});


	var AddVideo = function(videoCodecArray){

        CreateSingleVideo.call(this);
		// take array passed and place it into responsible video tag and div tag.
	};
	AddVideo.prototype = Object.create(CreateSingleVideo.prototype, {
		// inherit singleVideo prototype to add video
   	});


	html_5_video_player_eb.createVideoContainer = function(elementID){

		//creates video contianer based off of ID
        var element = document.getElementById(elementID);
        
        if (!element) {
            element = document.createElement("DIV");
            element.id = elementID;
            element.className = elementID;
            document.body.appendChild(element);
        }

        // Create new facotry function of video container
        return new CreateSingleVideo(element);
	};


	//return the object created
	return html_5_video_player_eb;

//if the object 
}(html_5_video_player_eb || {}));


// below is what I want the user to be able to do to create the video player
// -> var videoPlayer = html_5_video_player_eb.createVideoPlayer("containerID");

//	Need to add code to support below.
// -> videoPlayer.AddVideo(["src1","src2","src3"]);