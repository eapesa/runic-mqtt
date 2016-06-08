module.exports = {
  get: function(req, res) {
    async.auto({
      list: function(callback) {
        var query = "SELECT id, username FROM mqtt_user WHERE `id` > ?;"
        Users.query(query, [sails.config.defaults.developer_ids], function(err, users) {
          if (err) {
            return callback({
              status: 503,
              response: {
                code: -2,
                message: "Database Error"
              }
            });
          }

          callback(null, { users: users });
        });
      }
    }, function(error, result) {
      if (error) {
        res.status(error.status).json(error.response);
      } else {
        res.status(200).json({ 
          code: 0,
          message: "Operation Completed Successfully",
          result: result.list.users
        });
      }
    });
  },

  delete: function(req, res) {
    async.auto({
      validate: function(callback) {
        if (!req.query.username) {
          return callback({
            status: 400,
            response: {
              code: -1,
              message: "Bad Request"
            }
          });
        } 
        callback();
      },

      remove: ["validate", function(callback) {
        Users.destroy({
          username: req.query.username
        }, function(err) {
          if (err) {
            return callback({
              status: 503,
              response: {
                code: -2,
                message: "Database Error"
              }
            });
          }
          callback();
        });
      }]
    }, function(error, result) {
      if (error) {
        res.status(error.status).json(error.response);
      } else {
        res.status(200).json({ 
          code: 0,
          message: "Operation Completed Successfully"
        });
      }
    });
  },

  add: function(req, res) {
    async.auto({
      validate: function(callback) {
        if (!req.body.username) {
          return callback({
            status: 400,
            response: {
              code: -1,
              message: "Bad Request"
            }
          });
        } 
        var password = req.body.password || sails.config.defaults.password;
        callback(null, {
          password: password
        })
      },
      generate: ["validate", function(callback, result) {
        Users.create({
          username: req.body.username,
          password: result.validate.password
        }, function(err) {
          if (err) {
            return callback({
              status: 503,
              response: {
                code: -2,
                message: "Database Error"
              }
            });
          }

          callback();
        });
      }]
    }, function(error, result) {
      if (error) {
        res.status(error.status).json(error.response);
      } else {
        res.status(200).json({ 
          code: 0,
          message: "Operation Completed Successfully"
        });
      }
    });
  }
}