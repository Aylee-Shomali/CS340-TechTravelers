// Citation for the following code (the entirety of this file):
// Title: Node.js Starter App
// Type: Full program
// Date: 05/25/2023
// Copied and then modified to fit our database structure:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// code for deleteCustomer using regular javascript/xhttp
function deleteCustomer(customerId) {
    // Show a confirm dialog box before actually trying to delete.
    // Then, cancel if needed.
    if (!confirm(`Are you sure you would like to delete the record with ID: ${customerId}?`))
        return;

    // Put our data we want to send in a javascript object
    let data = {
        customerId: customerId
    };


    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-customer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table.
            deleteRow(customerId);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(customerId) {

    let table = document.getElementById("customerTable");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == customerId) {
            table.deleteRow(i);
            deleteDropDownMenu(customerId);
            break;
        }
    }
}

function deleteDropDownMenu(customerId) {
    let selectMenu = document.getElementById("input-customerId-update");
    for (let i = 0; i < selectMenu.length; i++) {
        if (Number(selectMenu.options[i].value) === Number(customerId)) {
            selectMenu[i].remove();
            break;
        }

    }
}
