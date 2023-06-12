-- Group 6 TechTravelers Project Step 6 Final
-- Group Members: Sajidah Wahdy and Aylee Shomali
-- DML file for TechTravels Database HTML pages.

-- ':' indicates a variable derived from user with JavaScript in a later step.

-- -----------------------------------------------------
-- Select Query for Agents page for Read operation and after successful insert.
-- -----------------------------------------------------
SELECT agentId, 
       firstName, 
       lastName, 
       email, 
       phoneNumber, 
       CONCAT(cityName,', ', IF(stateOrProvince IS NOT NULL, CONCAT(stateOrProvince, ', '), ''), countryName) AS `location`
FROM Agents
LEFT JOIN Locations 
ON Agents.locationId = Locations.locationId
ORDER BY agentId ASC;

-- -----------------------------------------------------
-- Select Query for Agents page to show Location dropdown options.
-- -----------------------------------------------------
SELECT locationId, CONCAT(cityName,', ', IF(stateOrProvince IS NOT NULL, CONCAT(stateOrProvince, ', '), ''), countryName) AS `location`
FROM Locations 
ORDER BY locationId ASC;

-- -----------------------------------------------------
-- Select Query for Agents page to show Agent name dropdown options for Update operation.
-- -----------------------------------------------------
SELECT agentId, CONCAT(Agents.firstName, ' ', Agents.lastName) AS `agent` 
FROM Agents 
ORDER BY agentId ASC;

-- -----------------------------------------------------
-- Insert query for Agents page for Create operation using user input from HTML form.
-- -----------------------------------------------------
INSERT INTO Agents (firstName, lastName, email, phoneNumber, locationId) 
VALUES (:firstName, :lastName, :email, :phoneNumber, :locationIdFromDropdown);

-- -----------------------------------------------------
-- Update query for Agents page for Update operation using user input from HTML form.
-- -----------------------------------------------------
UPDATE Agents 
SET firstName = :firstName, lastName = :lastName, email = :email, phoneNumber = :phoneNumber, locationId = :locationId WHERE agentId = :agentId;

-- -----------------------------------------------------
-- Select query for Agents page for Update operation to show record data dynamically.
-- -----------------------------------------------------
SELECT agentId, 
       firstName, 
       lastName, 
       email, 
       phoneNumber, 
       CONCAT(cityName,', ', IF(stateOrProvince IS NOT NULL, 
       CONCAT(stateOrProvince, ', '), ''), countryName) AS `location` FROM Agents 
       LEFT JOIN Locations ON Agents.locationId = Locations.locationId WHERE agentId = :agentId;

-- -----------------------------------------------------
-- Delete query for Agents page Delete operation.
-- -----------------------------------------------------
DELETE FROM Agents WHERE agentId = :agentId

-- -----------------------------------------------------
-- Select query for Locations page Read operation and after successful insert.
-- -----------------------------------------------------
SELECT locationId, 
       cityName, 
       stateOrProvince, 
       countryName
FROM Locations
ORDER BY locationId ASC;

-- -----------------------------------------------------
-- Insert query for Locations page Create operation using user input from HTML form.
-- -----------------------------------------------------
INSERT INTO Locations (cityName, stateOrProvince, countryName)
VALUES (:cityName, :stateOrProvince, :countryName);

-- -----------------------------------------------------
-- Delete query for Location page Delete operation.
-- -----------------------------------------------------
DELETE FROM Locations WHERE locationId = :locationId

-- -----------------------------------------------------
-- Select query for CustomerReservation page Read operation and after successful insert.
-- -----------------------------------------------------
SELECT customerReservationId, CONCAT(Customers.firstName, ' ', Customers.lastName) AS customer, reservationId 
FROM CustomerReservation 
JOIN Customers ON CustomerReservation.customerId = Customers.customerId 
ORDER BY customerReservationId ASC;

-- -----------------------------------------------------
-- Select query for Reservation page Read operation (Also used in CustomerReservations page for reference).
-- -----------------------------------------------------
SELECT reservationId, CONCAT(Agents.firstName, ' ', Agents.lastName) AS agent, date_format(startDate,'%Y-%m-%d') AS startDate, date_format(endDate, '%Y-%m-%d') AS endDate 
FROM Reservations 
LEFT JOIN Agents ON Reservations.agentId = Agents.agentId 
ORDER BY reservationId ASC;

-- -----------------------------------------------------
-- Select Query for CustomerReservation page to show Customer dropdown options.
-- -----------------------------------------------------
SELECT customerId, CONCAT(Customers.firstName, ' ', Customers.lastName) AS `customer` 
FROM Customers 
ORDER BY customerId ASC;

-- -----------------------------------------------------
-- Insert query for CustomerReservation page Create operation using user input from HTML form.
-- -----------------------------------------------------
INSERT INTO CustomerReservation (customerId, reservationId)
VALUES (:customerIdFromDropdown, :reservationIdFromDropdown);

-- -----------------------------------------------------
-- Select query to show data for existing record for CustomerReservation page Update operation.
-- -----------------------------------------------------
SELECT customerReservationId, CONCAT(Customers.firstName, ' ', Customers.lastName) AS customer, reservationId
FROM CustomerReservation
JOIN Customers ON CustomerReservation.customerId = Customers.customerId
WHERE customerReservationId = :id;

-- -----------------------------------------------------
-- Update query for CustomerReservation page Update operation using user input from HTML form.
-- -----------------------------------------------------
UPDATE CustomerReservation SET customerId = :customerIdFromDropdown, reservationId= :reservationIdFromDropdown
WHERE customerReservationId = :id

-- -----------------------------------------------------
-- Dis-associate a Reservation from a Customer (M-to-M relationship deletion)
-- -----------------------------------------------------
DELETE FROM CustomerReservation WHERE customerReservationId = :id


-- -----------------------------------------------------
-- Select Query for Customers page for Read operation.
-- -----------------------------------------------------
SELECT * 
FROM Customers 
ORDER BY customerId ASC;

-- -----------------------------------------------------
-- Select Query for Customers page for update dropdown options.
-- -----------------------------------------------------
SELECT customerId, 
CONCAT(firstName, ' ', lastName) AS customer 
FROM Customers 
ORDER BY customerId ASC;

-- -----------------------------------------------------
-- Insert query for Customers page for Create operation using user input from HTML form.
-- -----------------------------------------------------
INSERT INTO customers (firstName, lastName, email, phoneNumber, address) 
VALUES (:firstName, :lastName, :email, :phoneNumber, :address);

-- -----------------------------------------------------
-- Select query for Customers page to show data after successful Insert operation.
-- -----------------------------------------------------
SELECT customerId, firstName, lastName, email, phoneNumber, address 
FROM Customers 
ORDER BY customerId ASC; 

-- -----------------------------------------------------
-- Update query for Customer page Update operation using user input from HTML form.
-- -----------------------------------------------------
UPDATE Customer SET firstName = :firstName, lastName = :lastName, email = :email, phoneNumber = :phoneNumber, address = :address
WHERE CustomerId = :id

-- -----------------------------------------------------
-- Select query for Customers page to show data for record in Update operation.
-- -----------------------------------------------------
SELECT customerId, firstName, lastName, email, phoneNumber, address FROM Customers WHERE customerId = :customerId;

-- -----------------------------------------------------
-- Delete a Customer.
-- -----------------------------------------------------
DELETE FROM Customers WHERE customerId = :id


-- -----------------------------------------------------
-- Select query for Reservations page Read operation and used after a successful insert.
-- -----------------------------------------------------
SELECT reservationId,
    CONCAT(Agents.firstName,' ', Agents.lastName) AS agent,
    date_format(startDate, '%Y-%m-%d') AS startDate,
    date_format(endDate, '%Y-%m-%d') AS endDate
FROM Reservations
LEFT JOIN Agents ON Reservations.agentId = Agents.agentId
ORDER BY reservationId ASC;

-- -----------------------------------------------------
-- Select query for Reservations page Agents dropdown.
-- -----------------------------------------------------
SELECT agentId, CONCAT(Agents.firstName, ' ', Agents.lastName) AS `agent` FROM Agents ORDER BY agentId ASC;

-- -----------------------------------------------------
-- Insert query for Reservations page Create operation using user input from HTML form.
-- -----------------------------------------------------
INSERT INTO Reservations (agentId, startDate, endDate)
VALUES (:agentId, :startDate, :endDate);

-- -----------------------------------------------------
-- Delete a Reservation.
-- -----------------------------------------------------
DELETE FROM Reservations WHERE reservationId = :reservationId;

-- -----------------------------------------------------
-- Select query for ReservationLocations page Read operation and after successful insert.
-- -----------------------------------------------------
SELECT reservationLocationId,
    CONCAT(cityName, ', ', IF(stateOrProvince IS NOT NULL, CONCAT(stateOrProvince, ', '), ''),
        countryName) AS `location`, ReservationLocation.reservationId
FROM ReservationLocation
INNER JOIN Locations ON ReservationLocation.locationId = Locations.locationId
INNER JOIN Reservations ON Reservations.reservationId = ReservationLocation.reservationId
ORDER BY reservationLocationId ASC;

-- -----------------------------------------------------
-- Select query for Reservation page Read operation (Also used in ReservationLocations page for reference).
-- -----------------------------------------------------
SELECT reservationId, 
        CONCAT(Agents.firstName, ' ', Agents.lastName) AS agent, date_format(startDate,'%Y-%m-%d') AS startDate, 
        date_format(endDate, '%Y-%m-%d') AS endDate 
FROM Reservations 
LEFT JOIN Agents ON Reservations.agentId = Agents.agentId 
ORDER BY reservationId ASC;

-- -----------------------------------------------------
-- Select Query for ReservationLocation page to show Location dropdown options.
-- -----------------------------------------------------
SELECT locationId, CONCAT(cityName,', ', IF(stateOrProvince IS NOT NULL, CONCAT(stateOrProvince, ', '), ''), countryName) AS `location`
FROM Locations 
ORDER BY locationId ASC;

-- -----------------------------------------------------
-- Select Query for ReservationLocation page to show Reservation dropdown options.
-- -----------------------------------------------------
SELECT reservationId
FROM Reservations 
ORDER BY reservationId ASC;

-- -----------------------------------------------------
-- Insert query for ReservationLocation page Create operation using user input from HTML form.
-- -----------------------------------------------------
INSERT INTO ReservationLocation (locationId, reservationId)
VALUES (:locationIdFromDropdown, :reservationIdFromDropdown);

-- -----------------------------------------------------
-- Dis-associate a Reservation from a Location by deleting from ReservationLocation (M-to-M relationship deletion)
-- -----------------------------------------------------
DELETE FROM ReservationLocation WHERE reservationLocationId = :id
