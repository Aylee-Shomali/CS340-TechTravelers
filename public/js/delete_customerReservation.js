// Citation for the following code (the entirety of this file):
// Title: Node.js Starter App
// Type: Full program
// Date: 05/25/2023
// Copied and then modified to fit our database structure:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// code for deleteCustomerReservation using regular javascript/xhttp
function deleteCustomerReservation(customerReservationId) {
    // Put our data we want to send in a javascript object
    let data = {
        id: customerReservationId
    };
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-customerReservation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table.
            deleteRow(customerReservationId);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(customerReservationId){

    let table = document.getElementById("customerTable");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == customerReservationId) {
            table.deleteRow(i);
            deleteDropDownMenu(customerReservationId);
            break;
       }
    }
}

// TODO: Don't think this is needed for this page, likely for others, though.
function deleteDropDownMenu(customerReservationId){
  let selectMenu = document.getElementById("mySelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(customerReservationId)){
      selectMenu[i].remove();
      break;
    } 

  }
}

