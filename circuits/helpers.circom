pragma circom 2.1.6;

function getX(body) {
    return body[0];
}
function getY(body) {
  return body[1];
}
function getVx(body) {
  return [body[2], body[3]];
}
function getVy(body) {
  return [body[4], body[5]];
}
function getMass(body) {
  return body[6];
}