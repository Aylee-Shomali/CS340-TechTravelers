// Citation for the following code (the entirety of this file):
// Title: Node.js Starter App
// Type: Full program
// Date: 05/25/2023
// Copied and then modified to fit our database structure:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerId = document.getElementById("input-customerId-update");

    // Get the values from the form fields
    let customerIdValue = inputCustomerId.value;

    // Currently the database table for customer does not allow updating values to NULL
    // So we must abort if being passed NULL for any values.

    if (isNaN(customerIdValue)) {
        // Error message here?
        console.log("Null values are not accepted with this input.")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        customerId: customerIdValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, customerIdValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, customerId) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("customerTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == customerId) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of customerId values.
            let td = updateRowIndex.getElementsByTagName("td")[0];

            // Reassign customer to the values we updated to
            td.innerHTML = parsedData[0].customer;
        }
    }
}
