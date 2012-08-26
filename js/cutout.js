(function(){
  var frameInterval;
  var frameRate     = 24;
  var holder        = document.createElement('canvas');
  var output        = document.createElement('canvas');
  var videoElm      = document.createElement('video');
  var setup         = false;
  var debug         = false;

  document.body.appendChild(output);

  videoElm.addEventListener('loadedmetadata', metaLoadeds);
  videoElm.src = "video.mp4";
  videoElm.load();

  // once video meta has been loaded kick off this sucker
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
    imageData = holder.getContext('2d').getImageData(0, 0, holder.width, holder.height);
    window.chroma.cutout(imageData, holder.height, holder.width, function(cleaned) {
      imageData.data.set(cleaned);
      output.getContext('2d').putImageData(cleaned, 0, 0);
    });
  }

  // takes care of the basic scene setup
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
}());