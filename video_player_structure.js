var html_5_video_player_eb = (function (html_5_video_player_eb) {


	var CreateVideoContainer = function(videoContainerElement){

	};


	html_5_video_player_eb.createVideoContainer = function(elementID){

		//creates video contianer based off of ID
        var element = document.getElementById(elementID);

        // Create new facotry function of video container
        return new CreateVideoContainer(element);
	};


	//return the object created
	return html_5_video_player_eb;

//if the object 
}(html_5_video_player_eb || {}));


// below is what I want the user to be able to do to create the video player
// -> var videoPlayer = html_5_video_player_eb.createVideoPlayer("containerID");