// Citation for the following code (the entirety of this file):
// Title: Node.js Starter App
// Type: Full program
// Date: 05/25/2023
// Copied and then modified to fit our database structure:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateCustomerReservationForm = document.getElementById('update-customerReservation-form');

// Modify the objects we need
updateCustomerReservationForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputId = document.getElementById("input-customerReservationId-update");
    let inputCustomerId = document.getElementById("input-customerId-update");
    let inputReservationId = document.getElementById("input-reservationId-update");

    // Get the values from the form fields
    let idValue = inputId.value;
    let customerIdValue = inputCustomerId.value;
    let reservationIdValue = inputReservationId.value;
    
    // Currently the database table for customerReservation does not allow updating values to NULL
    // So we must abort if being passed NULL for any values.

    if (isNaN(idValue) || isNaN(customerIdValue) || isNaN(reservationIdValue)) 
    {
        // We could add an error message here?
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        id: idValue,
        customerId: customerIdValue,
        reservationId: reservationIdValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customerReservation", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, idValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("customerTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == id) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of Customer and reservationId values.
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign customer and reservation to the values we updated to
            td1.innerHTML = parsedData[0].customer; 
            td2.innerHTML = parsedData[0].reservationId; 
       }
    }
}


