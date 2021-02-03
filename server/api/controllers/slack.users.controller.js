module.exports = () => {
    const slackWeb = require('../../config/slack.web.config');
    const controller = {};
  
    controller.getUsersList = (req, res) => {
      
      slackWeb.web.users.list().then(users => {
        res.status(200).json(users);
      }).catch(err => {
        res.status(500).json(err);
      })
    
    };


    controller.getUserPresence = (req, res) => {

      slackWeb.web.users.getPresence(req.params['userId']).then(user => {
        res.status(200).json(user);
      });

    };

  
    return controller;
  }