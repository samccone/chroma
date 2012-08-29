window.chroma = window.chroma || {};

(function(){
  var defringeStack   = 5;
  var greenValue      = 90;
  var greenCorner     = 70;

  // Takes care of the cutout
  window.chroma.cutout = function (area, height, width, cb) {
    for(var height_index = 0, l = height; height_index < l; ++height_index) {
      for(var width_index = 0, z = width; width_index < z; ++width_index) {
        var index = (height_index * width + width_index) * 4;
        if(area.data[index + 3] != 0 && area.data[index + 1] >= greenValue) {
          area.data[index+3] = 0;
          // deFringe(area, height_index, width_index, width, 0);
        }
      }
    }
    cb(area);
  }

  // Defringes the corners of the key
  function deFringe(area, height_index, width_index, width, stack) {
    if (stack < defringeStack) {
      var index = (height_index * width + width_index) * 4;
      var up    = ((height_index - 1) * width + width_index) * 4;
      var down  = ((height_index + 1) * width + width_index) * 4;
      var left  = (height_index * width + width_index - 1) * 4;
      var right  = (height_index * width + width_index + 1) * 4;
      var step  = 0;
      [left, right, up, down].map(function(location) { dimensionalRecursion(location, area, height_index, width_index, width, step, stack) });
    }
  }

  // checks each corner pixel to the left right top bottom of current pixel
  function dimensionalRecursion(location, area, height_index, width_index, width, step, stack) {
    if (area.data[location + 3] != 0 && area.data[location + 1] > greenCorner) {
      area.data[location + 3] = 0;
      switch (++step) {
        case 0:
          deFringe(area, height_index, width_index - 1, width, stack+1)
        break;
        case 1:
          deFringe(area, height_index, width_index + 1, width, stack+1)
        break;
        case 2:
          deFringe(area, height_index - 1, width_index, width, stack+1)
        break;
        case 3:
          deFringe(area, height_index + 1, width_index, width, stack+1)
        break;
      }
    }
  }
}());