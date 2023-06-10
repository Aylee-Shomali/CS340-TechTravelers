// Citation for the following code (the entirety of this file):
// Title: Node.js Starter App
// Type: Full program
// Date: 05/25/2023
// Copied and then modified to fit our database structure:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addReservationForm = document.getElementById('add-reservation-form');

// Modify the objects we need
addReservationForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAgentId = document.getElementById("input-agentId");
    let inputStartDate = document.getElementById("input-startDate");
    let inputEndDate = document.getElementById("input-endDate");

    // Get the values from the form fields
    let agentIdValue = inputAgentId.value;
    let startDateValue = inputStartDate.value;
    let endDateValue = inputEndDate.value;


    // Put our data we want to send in a javascript object
    let data = {
        agentId: agentIdValue,
        startDate: startDateValue,
        endDate: endDateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-reservation", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputAgentId.value = 0;
            inputStartDate.value = "";
            inputEndDate.value = "";
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
    let agentIdCell = document.createElement("TD");
    let startDateCell = document.createElement("TD");
    let endDateCell = document.createElement("TD");
    let deleteCellOuter = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.reservationId;
    agentIdCell.innerText = newRow.agent;//not agentId so name is displayed
    startDateCell.innerText = newRow.startDate;
    endDateCell.innerText = newRow.endDate;

    // Define the actual delete button element.
    deleteCellInner = document.createElement("button");
    deleteCellInner.innerHTML = "Delete";
    deleteCellInner.onclick = function () {
        deleteReservation(newRow.reservationId);
    };

    // Add delete button to deleteCell.
    deleteCellOuter.appendChild(deleteCellInner);

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(agentIdCell);
    row.appendChild(startDateCell);
    row.appendChild(endDateCell);
    row.appendChild(deleteCellOuter);
    
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.reservationId);

    // Add the row to the table
    currentTable.appendChild(row);
}