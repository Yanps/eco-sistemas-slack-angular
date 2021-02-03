const { doesNotMatch } = require('assert');
const pg = require('pg');
const config = require('../../config/database');
const pool = new pg.Pool(config);


module.exports = () => {

    //const clientPg = require('../../config/postgre.config');
    const controller = {};

    controller.getAllOccupations = (req, res) => {

        pool.connect( (err, client, done) => {

            client.query(`SELECT * FROM occupation`, (error, results) => {
            
                done();

                if (error) {
                    res.status(500).json(error);
                    throw error
                }
    
                res.status(200).json(results.rows)
    
            });

        });

    };

    return controller;

};