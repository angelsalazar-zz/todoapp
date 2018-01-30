var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
});

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${process.env.MONGODB_URI}`)
});

mongoose.connection.on('disconnected', () => {
  console.log(`Mongoose disconnected`)
});


mongoose.connection.on('error', (err) => {
  console.log('Mongoose error', err)
});

process.on("SIGINT",function(){
  mongoose.connection.close(function(){
    console.log("Mongoose disconnected through app terminantion (SIGINT)");
    process.exit(0);
  })
});

process.on("SIGTERM",function(){
  mongoose.connection.close(function(){
    console.log("Mongoose disconnected through app terminantion (SIGTERM)");
    process.exit(0);
  })
});

process.once("SIGUSR2",function(){
  mongoose.connection.close(function(){
    console.log("Mongoose disconnected through app terminantion (SIGUSR2)");
    process.kill(process.pid,'SIGUSR2');
  })
});

module.exports = {
  mongoose
};
