// Citation for the following code (the entirety of this file):
// Title: Node.js Starter App
// Type: Full program
// Date: 05/25/2023
// Copied and then modified to fit our database structure:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addLocationForm = document.getElementById('add-location-form');

// Modify the objects we need
addLocationForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCityName = document.getElementById("input-cityName");
    let inputStateOrProvince = document.getElementById("input-stateOrProvince");
    let inputCountryName = document.getElementById("input-countryName");
    // Get the values from the form fields
    let cityNameValue = inputCityName.value;
    let stateOrProvinceValue = inputStateOrProvince.value;
    let countryNameValue = inputCountryName.value;

    // Put our data we want to send in a javascript object
    let data = {
        cityName: cityNameValue,
        stateOrProvince: stateOrProvinceValue,
        countryName: countryNameValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-location", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCityName.value = "";
            inputStateOrProvince.value = "";
            inputCountryName.value = "";
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
    let cityNameCell = document.createElement("TD");
    let stateOrProvinceCell = document.createElement("TD");
    let countryNameCell = document.createElement("TD");
    let deleteCellOuter = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.locationId;
    cityNameCell.innerText = newRow.cityName;
    stateOrProvinceCell.innerText = newRow.stateOrProvince;
    countryNameCell.innerText = newRow.countryName;

    // Define the actual delete button element.
    deleteCellInner = document.createElement("button");
    deleteCellInner.innerHTML = "Delete";
    deleteCellInner.onclick = function () {
        deleteLocation(newRow.locationId);
    };

    // Add delete button to deleteCell.
    deleteCellOuter.appendChild(deleteCellInner);

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(cityNameCell);
    row.appendChild(stateOrProvinceCell);
    row.appendChild(countryNameCell);
    row.appendChild(deleteCellOuter);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.locationId);

    // Add the row to the table
    currentTable.appendChild(row);

}