var env = process.env.NODE_ENV || 'development';

console.log('ENV ***********', env);
if (env === 'development' || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  })
}


// heroku config (list env variables)
// heroku config:get NAME (get an env variable)
// heroku config:set NAME=Angel (create an env variable)
// heroku config:unset NAME (remove an env variable)


// heroku config:set JWT_SECRET=superrandomstring
