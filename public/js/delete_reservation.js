// Citation for the following code (the entirety of this file):
// Title: Node.js Starter App
// Type: Full program
// Date: 05/25/2023
// Copied and then modified to fit our database structure:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// code for deleteReservation using regular javascript/xhttp
function deleteReservation(reservationId) {
    // Show a confirm dialog box before actually trying to delete.
    // Then, cancel if needed.
    if (!confirm(`Are you sure you would like to delete the record with ID: ${reservationId}?`))
        return;

    // Put our data we want to send in a javascript object
    let data = {
        reservationId: reservationId
    };


    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-reservation", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table.
            deleteRow(reservationId);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(reservationId) {

    let table = document.getElementById("customerTable");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == reservationId) {
            table.deleteRow(i);
            break;
        }
    }
}
