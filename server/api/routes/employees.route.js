module.exports = app => {

    const controller = require('../controllers/employees.controllers')();

    app.route('/api/v1/employees')
        .get(controller.getAllEmployees);

    app.route('/api/v1/employee/team/:teamId')
        .get(controller.getEmployeesByTeam);

}