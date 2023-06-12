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

    // Get form input original fields we need to get data from and don't rename as inputCustomerIdUpdate but assign it to getElementById with "input-customerId-update"
    let inputCustomerId= document.getElementById("input-customerId-update");
    let inputFirstName = document.getElementById("input-firstName-update");
    let inputLastName = document.getElementById("input-lastName-update");
    let inputEmail = document.getElementById("input-email-update");
    let inputPhoneNumber = document.getElementById("input-phoneNumber-update");
    let inputAddress = document.getElementById("input-address-update");

    // Get the input original values (camelCase) from the form fields above
    let customerIdValue = inputCustomerId.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let emailValue = inputEmail.value;
    let phoneNumberValue = inputPhoneNumber.value;
    let addressValue = inputAddress.value;

    // Currently the database table for customer does not allow updating values to NULL
    // So we must abort if being passed NULL for any values.
    // Enforcing that inputs are not empty
    if (customerIdValue == 0
        | firstNameValue == ""
        | lastNameValue == ""
        | emailValue == "" 
        | phoneNumberValue == ""
        | addressValue == "") {
        // Error message here.
        console.log("Null values are not accepted with this input.")
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        customerId: customerIdValue,
        firstName: firstNameValue,
        lastName: lastNameValue,
        email: emailValue,
        phoneNumber: phoneNumberValue,
        address: addressValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table via PK customerIdValue; don't add the other values
            updateRow(xhttp.response, customerIdValue);

            // Clear the input fields for another transaction
            inputFirstName.value = "";
            inputLastName.value = "";
            inputEmail.value = "";
            inputPhoneNumber.value = "";
            inputAddress.value = "";

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

            // Get td for designated elements of updated values.
            // [0] is customerId
            let td1 = updateRowIndex.getElementsByTagName("td")[1];//firstName
            let td2 = updateRowIndex.getElementsByTagName("td")[2];//lastName
            let td3 = updateRowIndex.getElementsByTagName("td")[3];//email
            let td4 = updateRowIndex.getElementsByTagName("td")[4];//phoneNumber
            let td5 = updateRowIndex.getElementsByTagName("td")[5];//address

            // Reassign field inputs to the values we updated to
            // [0] remains the same while adding .parameters for updates
            td1.innerHTML = parsedData[0].firstName;
            td2.innerHTML = parsedData[0].lastName;
            td3.innerHTML = parsedData[0].email;
            td4.innerHTML = parsedData[0].phoneNumber;
            td5.innerHTML = parsedData[0].address;

        }
    }
}

// Enhancement Update
// Additional code for autofilling form values based on selected record in the dropdown. 
// (Original work, but inspired a bit by the updateRow function above)
let recordIdDropdown = document.getElementById('input-customerId-update');
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
    let inputAddress = document.getElementById("input-address-update");
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
            let tdAddress = dataRowIndex.getElementsByTagName("td")[5];
            // Fill fields in the form according to the values in the table.
            inputFirstName.value = tdFirstName.innerHTML;
            inputLastName.value = tdLastName.innerHTML;
            inputEmail.value = tdEmail.innerHTML;
            inputPhoneNumber.value = tdPhoneNumber.innerHTML;
            inputAddress.value = tdAddress.innerHTML;
        }
    }
});
