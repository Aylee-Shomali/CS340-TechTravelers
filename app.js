// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 9002;                 // Set a port number at the top so it's easy to change in the future

// app.js
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
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

app.get('/customerReservation', function(req, res)
{
    // Declare Query 1
    let query1 = "SELECT customerReservationId,   CONCAT(Customers.firstName, ' ', Customers.lastName) AS customer, reservationId FROM CustomerReservation JOIN Customers ON CustomerReservation.customerId = Customers.customerId ORDER BY customerReservationId ASC;";

    // Declare Query 2
    let query2 = "SELECT reservationId, CONCAT(Agents.firstName, ' ', Agents.lastName) AS agent, startDate, endDate FROM Reservations JOIN Agents ON Reservations.agentId = Agents.agentId ORDER BY reservationId ASC;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        // Save the records
        let customerReservations = rows; 

        // Run the second query.
        db.pool.query(query2, function(error, rows, fields){
        
            // Save the records
            let reservations = rows; 
            console.log(rows);
    
            return res.render('customerReservation', {customerReservationData: customerReservations, reservationData: reservations});
        })
    })
});


app.post('/add-person-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let homeworld = parseInt(data['input-homeworld']);
    if (isNaN(homeworld))
    {
        homeworld = 'NULL'
    }

    let age = parseInt(data['input-age']);
    if (isNaN(age))
    {
        age = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO bsg_people (fname, lname, homeworld, age) VALUES ('${data['input-fname']}', '${data['input-lname']}', ${homeworld}, ${age})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/');
        }
    })
});

app.post('/add-person-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let homeworld = parseInt(data.homeworld);
    if (isNaN(homeworld))
    {
        homeworld = 'NULL'
    }

    let age = parseInt(data.age);
    if (isNaN(age))
    {
        age = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO bsg_people (fname, lname, homeworld, age) VALUES ('${data.fname}', '${data.lname}', ${homeworld}, ${age})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT bsg_people.id, bsg_people.fname, bsg_people.lname, bsg_people.homeworld, bsg_people.age, bsg_planets.name 
FROM bsg_people 
LEFT JOIN bsg_planets ON bsg_people.homeworld = bsg_planets.id;`;
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

app.delete('/delete-person-ajax/', function(req,res,next){
  let data = req.body;
  let personID = parseInt(data.id);
  let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`;
  let deleteBsg_People= `DELETE FROM bsg_people WHERE id = ?`;


        // Run the 1st query
        db.pool.query(deleteBsg_Cert_People, [personID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deleteBsg_People, [personID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
})});

app.put('/put-person-ajax', function(req,res,next){                                   
  let data = req.body;

  let homeworld = parseInt(data.homeworld);
  let person = parseInt(data.fullname);

  queryUpdateWorld = `UPDATE bsg_people SET homeworld = ? WHERE bsg_people.id = ?`;
  selectWorld = `SELECT * FROM bsg_planets WHERE id = ?`

        // Run the 1st query
        db.pool.query(queryUpdateWorld, [homeworld, person], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectWorld, [homeworld], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});



/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});