const fs = require('fs');

var photo = 0;
var pictureInterval = 1 * 1000;

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
  context.drawImage(video, 0, 0, 1280, 720);
  var sessionID = parseInt(new Date().getTime() / 1000);

  var img = canvas.toDataURL();
  // strip off the data: url prefix to get just the base64-encoded bytes
  var data = img.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');
  fs.writeFile(__dirname + '/timelapse/img_' + photo + '.png', buf, function(err) {
    if (err)
      console.error(err);
    console.log('The file has been saved.');
  });
  photo++;

  if (photo > 5000) {
    window.close();
  }
}

var canvas = document.getElementById('motion');
canvas.width = 1280;
canvas.height = 720;
var context = canvas.getContext('2d');
// context.globalCompositeOperation = 'difference';

setInterval(captureImage, pictureInterval);
// setInterval(capture, 100);

function capture() {
  // context.drawImage(video, 640, 480); // testing for viewing current canvas

  context.drawImage(video, 0, 0, 1280, 720);

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

function fastAbs(value) {
  // equivalent to Math.abs();
  return (value ^ (value >> 31)) - (value >> 31);
}

//function will check if a directory exists, and create it if it doesn't
function checkDirectory(directory, callback) {
  fs.stat(directory, function(err, stats) {
    //Check if error defined and the error code is "not exists"
    if (err && err.errno === 34) {
      //Create the directory, call the callback.
      fs.mkdir(directory, callback);
    } else {
      //just in case there was a different error:
      callback(err)
    }
  });
}
