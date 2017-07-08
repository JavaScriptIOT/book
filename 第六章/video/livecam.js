const LiveCam = require('livecam');
const webcam_server = new LiveCam
({
	// address and port of the webcam UI
	'ui_addr' : '127.0.0.1',
	'ui_port' : 11000,

	// address and port of the webcam Socket.IO server
	// this server broadcasts GStreamer's video frames
	// for consumption in browser side.
	'broadcast_addr' : '127.0.0.1',
	'broadcast_port' : 12000,

	// address and port of GStreamer's tcp sink
	'gst_tcp_addr' : '127.0.0.1',
	'gst_tcp_port' : 10000,
	
	// callback function called when server starts
	'start' : function() {
		console.log('WebCam server started!');
	},
	
	// webcam object holds configuration of webcam frames
	'webcam' : {
		
		// should frames be converted to grayscale (default : false)
		'grayscale' : true,
		
		// should width of the frame be resized (default : 0)
		// provide 0 to match webcam input
		'width' : 800,

		// should height of the frame be resized (default : 0)
		// provide 0 to match webcam input
		'height' : 600,
		
		// should a fake source be used instead of an actual webcam
		// suitable for debugging and development (default : false)
		'fake' : true,
		
		// framerate of the feed (default : 0)
		// provide 0 to match webcam input
		'framerate' : 25
	}
});

webcam_server.broadcast();
