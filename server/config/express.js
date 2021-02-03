const express    = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')


module.exports = () => {
  const app = express();

  app.use(cors());

  // SETANDO VARIÁVEIS DA APLICAÇÃO
  app.set('port', process.env.PORT || 8888);

  // MIDDLEWARES
  app.use(bodyParser.json());

  require('../api/routes/slack.users.route')(app);
  require('../api/routes/occupations.route')(app);
  require('../api/routes/employees.route')(app);

  return app;
};