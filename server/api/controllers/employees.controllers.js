const pg = require('pg');
const config = require('../../config/database');
const pool = new pg.Pool(config);

module.exports = () => {

    // const client = require('../../config/postgre.config');
    const controller = {};

    controller.getAllEmployees = (req, res) => {

        pool.connect( (err, client, done) => {

            client.query(`SELECT * FROM employee`, (error, results) => {
                
                done();

                if (error) {
                    res.status(500).json(error);
                    throw error
                }
    
                res.status(200).json(results.rows)    

            });

        }); 

    };

    controller.getEmployeesByTeam = (req, res) => {

        const query = `SELECT * FROM employee WHERE occupation_id = ${req.params['teamId']}`

        pool.connect( (err, client, done) => {

            client.query(query, (error, results) => {

                done();
            
                if (error) {
                    res.status(500).json(error);
                    throw error
                }
    
                res.status(200).json(results.rows);
            
            });

        });

    };

    return controller;

};