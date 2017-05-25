var constraints = {
  audio: false,
  video: {
    width: 1920,
    height: 1080
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

var canvas = document.getElementById('motion');
canvas.width = 640;
canvas.height = 480;
var context = canvas.getContext('2d');
context.globalCompositeOperation = 'difference';

setInterval(capture, 100);

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
