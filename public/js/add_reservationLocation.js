// Citation for the following code (the entirety of this file):
// Title: Node.js Starter App
// Type: Full program
// Date: 05/25/2023
// Copied and then modified to fit our database structure:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


// Get the objects we need to modify
let addreservationLocationForm = document.getElementById('add-reservationLocation-form');

// Modify the objects we need
addReservationLocationForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputLocationId = document.getElementById("input-locationId");
    let inputReservationId = document.getElementById("input-reservationId");
    // Get the values from the form fields
    let locationIdValue = inputLocationId.value;
    let reservationIdValue = inputReservationId.value;

    // Put our data we want to send in a javascript object
    let data = {
        locationId: locationIdValue,
        reservationId: reservationIdValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-reservationLocation", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputLocationId.value = 0;
            inputReservationId.value = 0;
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("customerTable");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let locationIdCell = document.createElement("TD");
    let reservationIdCell = document.createElement("TD");
    let deleteCellOuter = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.reservationLocationId;
    locationIdCell.innerText = newRow.location;
    reservationIdCell.innerText = newRow.reservationId;

    // Define the actual delete button element.
    deleteCellInner = document.createElement("button");
    deleteCellInner.innerHTML = "Delete";
    deleteCellInner.onclick = function () {
        deleteReservationLocation(newRow.reservationLocationId);
    };

    // Add delete button to deleteCell.
    deleteCellOuter.appendChild(deleteCellInner);

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(locationIdCell);
    row.appendChild(reservationIdCell);
    row.appendChild(deleteCellOuter);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.reservationLocationId);

    // Add the row to the table
    currentTable.appendChild(row);

    // Add new data to the dropdown menu for updating a record.

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    // let selectMenu = document.getElementById("input-customerReservationId-update");
    // let option = document.createElement("option");
    // option.text = newRow.customerReservationId;
    // option.value = newRow.customerReservationId;
    // selectMenu.add(option);
}