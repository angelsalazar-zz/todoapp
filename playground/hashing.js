const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const secret = 'somes3cr3t';

var data = {
  id : 10
};

var token = jwt.sign(data, secret);

console.log('token', token)
var decoded = jwt.verify(token, secret)
console.log('decoded', decoded)

// var message = 'I am user # 3';
//
// var hash = SHA256(message).toString();
//
// console.log(`message : ${message}`);
// console.log(`hash : ${hash}`);
//
// var data = {
//   id : 4
// };
//
// var token = {
//   data,
//   hash : SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log("token is right");
// } else {
//   console.log("token is wrong");
// }
