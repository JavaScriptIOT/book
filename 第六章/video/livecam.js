var LiveCam = require('livecam');
var webcam_server = new LiveCam
({
	'ui_addr' : '127.0.0.1',
	'ui_port' : 8080,

	// address and port of the webcam Socket.IO server
	// this server broadcasts GStreamer's video frames
	// for consumption in browser side.
	'broadcast_addr' : '127.0.0.1',
	'broadcast_port' : 12000,

	'gst_tcp_addr' : '127.0.0.1',
	'gst_tcp_port' : 10000,
	
	'start' : function() {
		console.log('WebCam server started!');
	},
	
	// webcam object holds configuration of webcam frames
	'webcam' : {
		'fake' : true,
	}
});
webcam_server.broadcast();
