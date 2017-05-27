fs = require('fs');
sys = require('sys');
var photo = 0;
var fullscreenButton = document.querySelector('.fullscreen-btn');
fullscreenButton.addEventListener('click', function(evt) {
  var focusWin = BrowserWindow.getFocusedWindow();
  var isFull = focusWin.isFullScreen();

  BrowserWindow.getFocusedWindow().setFullScreen(!isFull);
});

var loadVideoButton = document.querySelector('.timelapse-btn');
loadVideoButton.addEventListener('click', function(evt) {
  var timeVideo = document.getElementById('time-lapse');

  // attempt to clear the previous video
  timeVideo.pause();
  timeVideo.setAttribute('src', '');
  timeVideo.load();

  // re set to the current video
  timeVideo.pause();
  timeVideo.setAttribute('src', 'timelapse\\timelapse.mp4');
  timeVideo.load();
  timeVideo.play();
});

var constraints = {
  audio: false,
  video: {
    width: 1280,
    height: 720
  }
};
navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);

function success(stream) {
  var video = document.getElementById('video');
  video.srcObject = stream;
}

function error(error) {
  console.log(error);
}

function captureImage() {
  context.drawImage(video, 0, 0, 640, 480);
  var sessionID = parseInt(new Date().getTime() / 1000);

  var img = canvas.toDataURL();
  // strip off the data: url prefix to get just the base64-encoded bytes
  var data = img.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');
  fs.writeFile(__dirname + '/timelapse/img_' + photo + '.png', buf);
  photo++;

  if (photo > 5000) {
    window.close();
  }
}

var canvas = document.getElementById('motion');
canvas.width = 640;
canvas.height = 480;
var context = canvas.getContext('2d');
// context.globalCompositeOperation = 'difference';

setInterval(captureImage, 1000);
// setInterval(capture, 100);

function capture() {
  // context.drawImage(video, 640, 480); // testing for viewing current canvas

  context.drawImage(video, 0, 0, 640, 480);

  // do other stuff

}
console.log(canvas);

// var imageData = canvas.getImageData();
// var imageScore = 0;
//
// for (var i = 0; i < imageData.data.length; i += 4) {
//   var r = imageData.data[i] / 3;
//   var g = imageData.data[i + 1] / 3;
//   var b = imageData.data[i + 2] / 3;
//   var pixelScore = r + g + b;
//
//   if (pixelScore >= PIXEL_SCORE_THRESHOLD) {
//     imageScore++;
//   }
// }
//
// if (imageScore >= IMAGE_SCORE_THRESHOLD) {
//   // we have motion!
// }

navigator.mediaDevices.enumerateDevices().then(function(devices) {
  devices.forEach(function(device) {
    console.log(device);
    $('#tester').append("<p>" + device.kind + ": " + device.label + " id = " + device.deviceId + "</p>");
  });
})
