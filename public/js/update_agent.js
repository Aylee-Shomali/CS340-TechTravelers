// Citation for the following code (the entirety of this file):
// Title: Node.js Starter App
// Type: Full program
// Date: 05/25/2023
// Copied and then modified to fit our database structure:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateAgentForm = document.getElementById('update-agent-form');

// Modify the objects we need
updateAgentForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form input original fields we need to get data from.
    let inputAgentId= document.getElementById("input-agentId-update");
    let inputFirstName = document.getElementById("input-firstName-update");
    let inputLastName = document.getElementById("input-lastName-update");
    let inputEmail = document.getElementById("input-email-update");
    let inputPhoneNumber = document.getElementById("input-phoneNumber-update");
    let inputLocationId = document.getElementById("input-locationId-update");

    // Get the input original values (camelCase) from the form fields above
    let agentIdValue = inputAgentId.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let emailValue = inputEmail.value;
    let phoneNumberValue = inputPhoneNumber.value;
    let locationIdValue = inputLocationId.value;


    // Throw error if any values are empty other than the locationId.
    if (isNaN(agentIdValue) 
        | firstNameValue == ""
        | lastNameValue == ""
        | emailValue == "" 
        | phoneNumberValue == "") {
        // Error message here.
        console.log("Null values are not accepted with this input.")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        agentId: agentIdValue,
        firstName: firstNameValue,
        lastName: lastNameValue,
        email: emailValue,
        phoneNumber: phoneNumberValue,
        locationId: locationIdValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-agent", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table via PK agentIdValue; don't add the other values
            updateRow(xhttp.response, agentIdValue);

            // Clear the input fields for another transaction
            inputAgentId.value = 0;
            inputFirstName.value = "";
            inputLastName.value = "";
            inputEmail.value = "";
            inputPhoneNumber.value = "";
            inputLocationId.value = 0;

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, agentId) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("customerTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == agentId) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td for designated elements of updated values.
            // [0] is agentId
            let td1 = updateRowIndex.getElementsByTagName("td")[1];//firstName
            let td2 = updateRowIndex.getElementsByTagName("td")[2];//lastName
            let td3 = updateRowIndex.getElementsByTagName("td")[3];//email
            let td4 = updateRowIndex.getElementsByTagName("td")[4];//phoneNumber
            let td5 = updateRowIndex.getElementsByTagName("td")[5];//location

            // Reassign field inputs to the values we updated to
            // [0] remains the same while adding .parameters for updates
            td1.innerHTML = parsedData[0].firstName;
            td2.innerHTML = parsedData[0].lastName;
            td3.innerHTML = parsedData[0].email;
            td4.innerHTML = parsedData[0].phoneNumber;
            td5.innerHTML = parsedData[0].location;

        }
    }
}

// Enhancement Update
// Additional code for autofilling form values based on selected record in the dropdown. 
// (Original work, but inspired a bit by the updateRow function above)
let recordIdDropdown = document.getElementById('input-agentId-update');
recordIdDropdown.addEventListener("change", function (e) {
    // Get the current record id value from the dropdown.
    let recordId = e.target.value;

    // Get the values in the table related 
    let table = document.getElementById("customerTable");

    // Get elements in the form.
    let inputFirstName = document.getElementById("input-firstName-update");
    let inputLastName = document.getElementById("input-lastName-update");
    let inputEmail = document.getElementById("input-email-update");
    let inputPhoneNumber = document.getElementById("input-phoneNumber-update");

    // Get select element in the form.
    let selectLocation = document.getElementById("input-locationId-update");

    for (let i = 0, row; row = table.rows[i]; i++) {
        // Iterate through rows.
        // Rows would be accessed using the "row" variable assigned in the for loop.
        if (table.rows[i].getAttribute("data-value") == recordId) {
            // Get the location of the row where we found the matching ID.
            let dataRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of all attributes for the record.
            let tdFirstName = dataRowIndex.getElementsByTagName("td")[1];
            let tdLastName = dataRowIndex.getElementsByTagName("td")[2];
            let tdEmail = dataRowIndex.getElementsByTagName("td")[3];
            let tdPhoneNumber = dataRowIndex.getElementsByTagName("td")[4];
            let tdLocation = dataRowIndex.getElementsByTagName("td")[5];

            // Get the location dropdown option that corresponds to the location name.
            let locationValue = document.getElementById(`option-${tdLocation.innerHTML}`);

            // Fill fields in the form according to the values in the table.
            inputFirstName.value = tdFirstName.innerHTML;
            inputLastName.value = tdLastName.innerHTML;
            inputEmail.value = tdEmail.innerHTML;
            inputPhoneNumber.value = tdPhoneNumber.innerHTML;
            // Select corresponding location in the dropdown, select empty option if NULL.
            if (!locationValue)
                selectLocation.value = 0; 
            else
                selectLocation.value = locationValue.value;
        }
    }
});
