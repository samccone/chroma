var frameInterval;
var frameRate     = 24;
var holder        = document.createElement('canvas');
var output        = document.createElement('canvas');
var videoElm      = document.createElement('video');
var setup         = false;
var debug         = false;
var defringeDepth = 0;

document.body.appendChild(output);

videoElm.addEventListener('loadedmetadata', metaLoadeds);
videoElm.src = "video.mp4";
videoElm.load();

function metaLoadeds() {
  if (!setup) {
    setupEnv();
    setup = true;
  }
  videoElm.play();
}

// places image data onto the dummy canvas and then into the display one
function placeOntoCanvas() {
  holder.getContext('2d').drawImage(videoElm, 0, 0);
  data = holder.getContext('2d').getImageData(0, 0, holder.width, holder.height);
  cleanData(data, function(cleaned) {
    output.getContext('2d').putImageData(cleaned, 0, 0);
  });
}

// Takes care of the cutout
function cleanData(area, cb) {
  for(var i = 0, l = area.data.length; i < l; i += 4) {
    if(area.data[i + 3] != 0 && area.data[i + 1] >= 170) {
      area.data[i+3] = 0;
      deFringe(area, i, 0);
    }
  }
  cb(area);
}


// Defringes the corners of the key
function deFringe(area, i, stack) {
  if (stack < defringeDepth) {
    var left  = i - 4;
    var right = i + 4;
    [(i - 4), (i + 4)].map(function(k) {
      if (area.data[k + 3] != 0 && area.data[k + 1] > 50 ){
        area.data[k + 3] = 0;
        deFringe(area, k, stack+1);
      }
    });
  }
}

function setupEnv() {
  holder.setAttribute('width', videoElm.videoWidth);
  holder.setAttribute('height', videoElm.videoHeight);
  output.setAttribute('width', videoElm.videoWidth);
  output.setAttribute('height', videoElm.videoHeight);

  videoElm.addEventListener('play', function() {
    frameInterval = setInterval(placeOntoCanvas, 1000 / frameRate);
  });

  videoElm.addEventListener('pause', function() { debug && console.log("pause"); clearInterval(frameInterval); });
  videoElm.addEventListener('ended', function() { debug && console.log("ended"); clearInterval(frameInterval); videoElm.load(); });
  videoElm.addEventListener('error', function() { debug && console.log("error"); clearInterval(frameInterval); });
  videoElm.addEventListener('suspend', function() { debug && console.log("suspend"); clearInterval(frameInterval); });
  videoElm.addEventListener('emptied', function() { debug && console.log("emptied"); clearInterval(frameInterval); });
}