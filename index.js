var url = require('url');

module.exports.createClient = module.exports.connect = function(redis_url, cb) {
  var password, database;
  var parsed_url  = url.parse(redis_url || process.env.REDIS_URL || 'redis://localhost:6379');
  var parsed_auth = (parsed_url.auth || '').split(':');

  var redis = require('redis').createClient(parsed_url.port, parsed_url.hostname);

  if (password = parsed_auth[1]) {
    redis.auth(password, function(err) {
      if (err) throw err;
    });
  }

  if (database = parsed_auth[0]) {
    redis.select(database, cb);
    redis.on('connect', function() {
      redis.send_anyways = true
      redis.select(database);
      redis.send_anyways = false;
    });
  }
  else {
    if (typeof(cb) === 'function') {
      cb();
    }
  }


  return(redis);
}
