pragma circom 2.1.6;

function getX(body) {
    return body[0];
}
function getY(body) {
  return body[1];
}
function getVx(body) {
  return body[2];
}
function getVy(body) {
  return body[3];
}
function getMass(body) {
  return body[4];
}

function maxBits(n) {
  var i = 0;
   while(n > 0) {
    i++;
    n = n >> 1;
   }
   return i;
}
function getBiggest(options, len) {
  var biggest = 0;
  for (var i = 0; i < len; i++) {
    if (options[i] > biggest) {
      biggest = options[i];
    }
  }
  return biggest;
}