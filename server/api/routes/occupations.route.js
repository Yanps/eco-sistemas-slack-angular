module.exports = app => {

    const controller = require('../controllers/occupations.controller')();

    app.route('/api/v1/occupations')
        .get(controller.getAllOccupations);

}