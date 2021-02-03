module.exports = app => {

    const controller = require('../controllers/slack.users.controller')();

    app.route('/api/v1/users')
        .get(controller.getUsersList);

    app.route('/api/v1/users/:id')
        .get(controller.getUserPresence);

}