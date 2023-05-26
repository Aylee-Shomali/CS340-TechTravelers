// ./database/db-connector.js

// Citation for the following code (the entirety of this file):
// Title: Node.js Starter App
// Type: Full program
// Date: 05/25/2023
// Copied and then modified to fit our database structure:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_wahdys', //'cs340_shomalay',
    password        : '2005', //'OSU.Livin_00084',
    database        : 'cs340_wahdys' //cs340_shomalay'// update this!!!
})

// Export it for use in our applicaiton
module.exports.pool = pool;