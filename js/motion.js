const fs = require('fs');
const BrowserWindow = require('electron').remote.BrowserWindow;
var logger = require('winston');

logger.add(logger.transports.File, {filename: './somefile.log'});
logger.level = 'debug';

// var logger = new(winston.Logger)({
//   transports: [
//     new(winston.transports.Console)({level: 'error'}),
//     new(winston.transports.File)({filename: './somefile.log', level: '5'})
//   ]
// });

// logger.transports.console.level = 'debug';
// logger.transports.file.level = 'debug';

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
  this.video = document.getElementById('live-video');
  video.srcObject = stream;
  logger.log(video);
  logger.info('oy');

  logger.log('silly', "127.0.0.1 -asd f asdfa sdf there's no place like home");
  logger.log('debug', "127.0.0.1 -aaaa there's no place like home");
  logger.log('verbose', "127.0.0.1 - there's no place like home");
  logger.log('info', "127.0.0.1 - there's no place like home");
  logger.log('warn', "127.0.0.1 - there's no place like home");
  logger.log('error', "127.0.0.1 - there's no place like home");
  logger.info("127.0.0.1 - there's no place like home");
  logger.warn("127.0.0.1 - there's no place like home");
  logger.error("127.0.0.1 - there's no place like home");

}

function error(error) {
  logger.error(error);
}

function captureImage() {
  context.drawImage(video, 0, 0, 1280, 720);
  var sessionID = parseInt(new Date().getTime() / 1000);

  var img = canvas.toDataURL();
  // strip off the data: url prefix to get just the base64-encoded bytes
  var data = img.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');

  checkDirectory("./timelapse/", function(error) {
    if (error) {
      logger.log("oh no!!!", error);
    } else {
      //Carry on, all good, directory exists / created.
      fs.writeFile(__dirname + '/timelapse/img_' + sessionID + '.png', buf, function(err) {
        if (err)
          logger.error(err);
        logger.log('The file has been saved.');
      });
    }
  });

  //   fs.writeFile(__dirname + '/timelapse/img_' + photo + '.png', buf, function(err) {
  //   if (err)
  //     logger.error(err);
  //   logger.log('The file has been saved.');
  // });
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
logger.log(canvas);

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
    if (err && err.code === 'ENOENT') {
      //Create the directory, call the callback.
      fs.mkdir(directory, callback);
    } else {
      //just in case there was a different error:
      callback(err)
    }
  });
}

function difference(target, data1, data2) {
  // blend mode difference
  if (data1.length != data2.length)
    return null;
  var i = 0;
  while (i < (data1.length * 0.25)) {
    target[4 * i] = data1[4 * i] == 0
      ? 0
      : fastAbs(data1[4 * i] - data2[4 * i]);
    target[4 * i + 1] = data1[4 * i + 1] == 0
      ? 0
      : fastAbs(data1[4 * i + 1] - data2[4 * i + 1]);
    target[4 * i + 2] = data1[4 * i + 2] == 0
      ? 0
      : fastAbs(data1[4 * i + 2] - data2[4 * i + 2]);
    target[4 * i + 3] = 0xFF;
    ++i;
  }
}
