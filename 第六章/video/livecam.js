var LiveCam = require('livecam');
var webcam_server = new LiveCam
({
	// 网络摄像头UI网页地址与端口
	'ui_addr' : '127.0.0.1',
	'ui_port' : 8080,

	// address and port of the webcam Socket.IO server
	// this server broadcasts GStreamer's video frames
	// for consumption in browser side.
	// 基于Socket.IO的视频数据流websocket广播地址与端口
	'broadcast_addr' : '127.0.0.1',
	'broadcast_port' : 12000,

	// GStreamer的TCP视频流端口与地址
	'gst_tcp_addr' : '127.0.0.1',
	'gst_tcp_port' : 10000,
	
	// 服务器启动的回调函数
	'start' : function() {
		console.log('WebCam server started!');
	},
	
	// webcam object holds configuration of webcam frames
	'webcam' : {
		// 是否使用测试源，否则使用真实摄像头
		'fake' : true,
	}
});
webcam_server.broadcast();
