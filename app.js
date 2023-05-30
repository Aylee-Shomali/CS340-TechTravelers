// App.js

// Citation for the following code (the entirety of this file):
// Title: Node.js Starter App
// Type: Full program
// Date: 05/25/2023
// Copied and then modified to fit our database structure:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8007;                 // Set a port number at the top so it's easy to change in the future

// app.js
const { engine } = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));         // this is needed to allow for the form to use the css style sheet/javascript
    

// app.js

app.get('/', function(req, res)
{
    return res.render('index');
});

// GET ROUTES 

app.get('/customerReservation', function(req, res)
{
    // Declare Query 1
    let query1 = "SELECT customerReservationId,   CONCAT(Customers.firstName, ' ', Customers.lastName) AS customer, reservationId FROM CustomerReservation JOIN Customers ON CustomerReservation.customerId = Customers.customerId ORDER BY customerReservationId ASC;";

    // Declare Query 2
    let query2 = "SELECT reservationId, CONCAT(Agents.firstName, ' ', Agents.lastName) AS agent, date_format(startDate,'%Y-%m-%d') AS startDate, date_format(endDate, '%Y-%m-%d') AS endDate FROM Reservations JOIN Agents ON Reservations.agentId = Agents.agentId ORDER BY reservationId ASC;";

    // Declare Query 3
    let query3 = "SELECT customerId, CONCAT(Customers.firstName, ' ', Customers.lastName) AS `customer` FROM Customers ORDER BY customerId ASC;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        // Save the records
        let customerReservations = rows; 

        // Run the second query.
        db.pool.query(query2, function(error, rows, fields){

            // Save the records
            let reservations = rows; 

            // Run the third query.
            db.pool.query(query3, function(error, rows, fields){
        
            // Save the records
            let customers = rows; 
    
            return res.render('customerReservation', {customerReservationData: customerReservations, reservationData: reservations, customerData: customers});
            })
        })
    })
});

app.get('/locations', function(req, res)
{
    // Declare Query
    let query = "SELECT locationId, cityName, stateOrProvince, countryName FROM Locations ORDER BY locationId ASC;";

    // Run query
    db.pool.query(query, function(error, rows, fields){
        // Save the records
        let locations = rows; 

        return res.render('locations', {locationData: locations});
    })
});

app.get('/agents', function(req, res)
{
    // Declare Query 1
    let query1 = "SELECT agentId, firstName, lastName, email, phoneNumber, CONCAT(cityName,', ', IF(stateOrProvince IS NOT NULL, CONCAT(stateOrProvince, ', '), ''), countryName) AS `location` FROM Agents LEFT JOIN Locations ON Agents.locationId = Locations.locationId ORDER BY agentId ASC;";

    // Declare Query 2
    let query2 = "SELECT locationId, CONCAT(cityName,', ', IF(stateOrProvince IS NOT NULL, CONCAT(stateOrProvince, ', '), ''), countryName) AS `location` FROM Locations ORDER BY locationId ASC;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        // Save the records
        let agents = rows; 

        // Run the second query.
        db.pool.query(query2, function(error, rows, fields){

            // Save the records
            let locations = rows; 

            return res.render('agents', {agentData: agents, locationData: locations});
        })
    })
});

app.get('/customers', function (req, res) {
    // Declare Query 1
    let query1 = "SELECT * from Customers ORDER BY customerId ASC;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
        // Save the records
        let customers = rows;

        return res.render('customers', { customerData: customers });
        })
});

// POST ROUTES
app.post('/add-customerReservation', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO CustomerReservation (customerId, reservationId) VALUES (${data.customerId}, ${data.reservationId});`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, get all records.
            query2 = `SELECT customerReservationId,   CONCAT(Customers.firstName, ' ', Customers.lastName) AS customer, reservationId FROM CustomerReservation JOIN Customers ON CustomerReservation.customerId = Customers.customerId ORDER BY customerReservationId ASC;`;

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-location', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values + Handle additional single quotes.
    let stateOrProvince = data.stateOrProvince;
    if (stateOrProvince == '')
        stateOrProvince = 'NULL';
    else
        stateOrProvince = `'${data.stateOrProvince}'`;

    // Create the query and run it on the database
    query1 = `INSERT INTO Locations (cityName, stateOrProvince, countryName)
    VALUES ('${data.cityName}', ${stateOrProvince}, '${data.countryName}');`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, get all records.
            query2 = "SELECT locationId, cityName, stateOrProvince, countryName FROM Locations ORDER BY locationId ASC;";

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-agent', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values + Handle additional single quotes.
    let locationId = data.locationId;
    if (locationId == 0)
    locationId = 'NULL';

    // Create the query and run it on the database
    query1 = `INSERT INTO Agents (firstName, lastName, email, phoneNumber, locationId) VALUES ('${data.firstName}', '${data.lastName}', '${data.email}', '${data.phoneNumber}', ${locationId})`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, get all records.
            query2 = "SELECT agentId, firstName, lastName, email, phoneNumber, CONCAT(cityName,', ', IF(stateOrProvince IS NOT NULL, CONCAT(stateOrProvince, ', '), ''), countryName) AS `location` FROM Agents LEFT JOIN Locations ON Agents.locationId = Locations.locationId ORDER BY agentId ASC;";

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-customer', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (firstName, lastName, email, phoneNumber, address) VALUES ('${data.firstName}', '${data.lastName}', '${data.email}', '${data.phoneNumber}', '${data.address}')`;

    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, get all records.
            query2 = "SELECT Customers.customerId, Customers.firstName, Customers.lastName, Customers.email, Customers.phoneNumber, Customers.address FROM Customers ORDER BY customerId ASC; ";


            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

// DELETE ROUTES
app.delete('/delete-customerReservation/', function(req,res,next){
  let data = req.body;
  let customerReservationId = parseInt(data.id);
  let query = `DELETE FROM CustomerReservation WHERE customerReservationId = ?`;

        // Run the 1st query
        db.pool.query(query, [customerReservationId], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                res.sendStatus(204);
            }
})});

app.delete('/delete-customer/', function (req, res, next) {
    let data = req.body;
    let customerId = parseInt(data.customerId);
    let query = `DELETE FROM Customers WHERE customerId = ?`;

    // Run the 1st query
    db.pool.query(query, [customerId], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            res.sendStatus(204);
        }
    })
});

// UPDATE ROUTES
app.put('/put-customerReservation', function(req,res,next){                                   
  let data = req.body;

  let id = parseInt(data.id);
  let customerId = parseInt(data.customerId);
  let reservationId = parseInt(data.reservationId);

  queryUpdate = `UPDATE CustomerReservation SET customerId = ?, reservationId = ? WHERE customerReservationId = ?`;
  querySelect = `SELECT customerReservationId, CONCAT(Customers.firstName, ' ', Customers.lastName) AS customer, reservationId FROM CustomerReservation JOIN Customers ON CustomerReservation.customerId = Customers.customerId WHERE CustomerReservationId = ?;`

        // Run the 1st query
        db.pool.query(queryUpdate, [customerId, reservationId, id], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the record.
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(querySelect, [id], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

app.put('/put-customer', function (req, res, next) {
    let data = req.body;

    let customerId = parseInt(data.customerId);

    queryUpdate = `UPDATE Customers SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, address = ? WHERE customerId = ?`;

    querySelect = `SELECT Customers.customerId, Customers.firstName, Customers.lastName, Customers.email, Customers.phoneNumber, Customers.address FROM Customers ORDER BY customerId ASC;`;
    

    // Run the 1st query with passing additional parameters in []
    db.pool.query(queryUpdate, [customerId, firstName, lastName, email, phoneNumber, address], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the record.
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(querySelect, [customerId], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});



/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('DEV SERVER: started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});