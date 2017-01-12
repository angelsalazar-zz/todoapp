const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = 'somes3cr3t';

var password = '123456';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   })
// });

var hashedPassword = '$2a$10$x/Ixrdam52Q4sNQsHj1uRewsKyz8Pvu8MVgSc8BgZSxJVsIHoJ2Ze';

bcrypt.compare(password, hashedPassword, (err, result) => {
  console.log(result);
})

// var data = {
//   id : 10
// };
//
// var token = jwt.sign(data, secret);
//
// console.log('token', token)
// var decoded = jwt.verify(token, secret)
// console.log('decoded', decoded)

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
