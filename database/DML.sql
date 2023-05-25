-- Group 6 TechTravelers Project Step 3 Final
-- Group Members: Sajidah Wahdy and Aylee Shomali
-- DML file for TechTravels Database HTML pages.

-- ':' indicates a variable derived from user with JavaScript in a later step.

-- -----------------------------------------------------
-- Select Query for Agents page for Read operation.
-- -----------------------------------------------------
SELECT agentId AS `Agent Id`, 
       firstName AS `First Name`, 
       lastName AS `Last Name`, 
       email AS `Email`, 
       phoneNumber AS `Phone Number`, 
       CONCAT(cityName,', ', IF(stateOrProvince IS NOT NULL, CONCAT(stateOrProvince, ', '), ''), countryName) AS `Location`
FROM Agents
INNER JOIN Locations 
ON Agents.locationId = Locations.locationId
ORDER BY agentId ASC;

-- -----------------------------------------------------
-- Select Query for Agents page to show Location dropdown options.
-- -----------------------------------------------------
SELECT locationId, CONCAT(cityName,', ', IF(stateOrProvince IS NOT NULL, CONCAT(stateOrProvince, ', '), ''), countryName) AS `Location`
FROM Locations 
ORDER BY locationId ASC;

-- -----------------------------------------------------
-- Insert query for Agents page for Create operation using user input from HTML form.
-- -----------------------------------------------------
INSERT INTO agents (firstName, lastName, email, phoneNumber, locationId) 
VALUES (:firstName, :lastName, :email, :phoneNumber, :locationIdFromDropdown);

-- -----------------------------------------------------
-- Select query for Locations page Read operation.
-- -----------------------------------------------------
SELECT locationId AS `Location Id`, 
       cityName AS `City Name`, 
       stateOrProvince AS `State/Province`, 
       countryName AS `Country Name`
FROM Locations
ORDER BY locationId ASC;

-- -----------------------------------------------------
-- Insert query for Locations page Create operation using user input from HTML form.
-- -----------------------------------------------------
INSERT INTO Locations (cityName, stateOrProvince, countryName)
VALUES (:cityName, :stateOrProvince, :countryName);

-- -----------------------------------------------------
-- Select query for CustomerReservation page Read operation.
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
JOIN Agents ON Reservations.agentId = Agents.agentId 
ORDER BY reservationId ASC;

-- -----------------------------------------------------
-- Select Query for CustomerReservation page to show Customer dropdown options.
-- -----------------------------------------------------
SELECT customerId, CONCAT(Customers.firstName, ' ', Customers.lastName) AS `customer` 
FROM Customers 
ORDER BY customerId ASC;

-- -----------------------------------------------------
-- Select Query for CustomerReservation page to show Reservation dropdown options.
-- -----------------------------------------------------
SELECT reservationId
FROM Reservations 
ORDER BY reservationId ASC;

-- -----------------------------------------------------
-- Insert query for CustomerReservation page Create operation using user input from HTML form.
-- -----------------------------------------------------
INSERT INTO CustomerReservation (customerId, reservationId)
VALUES (:customerIdFromDropdown, :reservationIdFromDropdown);

-- -----------------------------------------------------
-- Select query to show data for existing record for CustomerReservation page Update operation. (Also used to show values in DELETE confirmation message)
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
SELECT customerId AS `Customer Id`, 
       firstName AS `First Name`, 
       lastName AS `Last Name`, 
       email AS `Email`, 
       phoneNumber AS `Phone Number`, 
       address AS `Address`
FROM Customers
ORDER BY customerId ASC;

-- -----------------------------------------------------
-- Insert query for Customers page for Create operation using user input from HTML form.
-- -----------------------------------------------------
INSERT INTO customers (firstName, lastName, email, phoneNumber, address) 
VALUES (:firstName, :lastName, :email, :phoneNumber, :address);

-- -----------------------------------------------------
-- Select query to show data for existing record for Customer page Update operation. (Also used to show values in DELETE confirmation message)
-- -----------------------------------------------------
SELECT customerId AS `Customer Id`, Customers.firstName AS `First Name`, Customers.lastName AS `Last Name`
FROM Customers
WHERE CustomerId = :id
ORDER BY customerId ASC;

-- -----------------------------------------------------
-- Update query for Customer page Update operation using user input from HTML form.
-- -----------------------------------------------------
UPDATE Customer SET firstName = :firstName, lastName = :lastName, email = :email, phoneNumber = :phoneNumber, address = :address
WHERE CustomerId = :id

-- -----------------------------------------------------
-- Delete a Customer.
-- -----------------------------------------------------
DELETE FROM Customer WHERE customerId = :id


-- -----------------------------------------------------
-- Select query for Reservations page Read operation.
-- -----------------------------------------------------
SELECT reservationId AS `Reservation Id`, 
       CONCAT(Agents.firstName, ' ', Agents.lastName) AS `Agent`,
       startDate AS `Start Date`, 
       endDate AS `End Date`
FROM Reservations
JOIN Agents ON Reservations.agentId = Agents.agentId
ORDER BY reservationId ASC;

-- -----------------------------------------------------
-- Insert query for Reservations page Create operation using user input from HTML form.
-- -----------------------------------------------------
INSERT INTO Reservations (agentId, startDate, endDate)
VALUES (:agentId, :startDate, :endDate);

-- -----------------------------------------------------
-- Select query for ReservationLocations page Read operation.
-- -----------------------------------------------------
SELECT reservationLocationId AS `Reservation Location Id`, CONCAT(cityName,', ', IF(stateOrProvince IS NOT NULL, CONCAT(stateOrProvince, ', '), ''), countryName) AS `Location`, ReservationLocation.reservationId AS `Reservation Id`
FROM ReservationLocation
INNER JOIN Locations ON ReservationLocation.locationId = Locations.locationId
INNER JOIN Reservations ON Reservations.reservationId = ReservationLocation.reservationId
ORDER BY reservationLocationId ASC;

-- -----------------------------------------------------
-- Select query for Reservation page Read operation (Also used in ReservationLocations page for reference).
-- -----------------------------------------------------
SELECT reservationId AS `Reservation Id`, 
       CONCAT(Agents.firstName, ' ', Agents.lastName) AS `Agent`, 
       startDate AS `Start Date`, 
       endDate AS `End Date`
FROM Reservations
JOIN Agents ON Reservations.agentId = Agents.agentId
ORDER BY reservationId ASC;

-- -----------------------------------------------------
-- Select Query for ReservationLocation page to show Location dropdown options.
-- -----------------------------------------------------
SELECT locationId, CONCAT(cityName,', ', IF(stateOrProvince IS NOT NULL, CONCAT(stateOrProvince, ', '), ''), countryName) AS `Location`
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
-- Select query to show data for existing record for ReservationLocation page Update operation. (Also used to show values in DELETE confirmation message)
-- -----------------------------------------------------
SELECT ReservationLocationId, CONCAT(cityName,', ', IF(stateOrProvince IS NOT NULL, CONCAT(stateOrProvince, ', '), ''), countryName) AS `Location`, Reservations.reservationId AS reservationId
FROM ReservationLocation
LEFT JOIN Reservations ON Reservations.reservationId = ReservationLocation.reservationId
LEFT JOIN Locations ON Locations.locationId = ReservationLocation.locationId
WHERE reservationLocationId = :id
ORDER BY reservationLocationId ASC;

-- -----------------------------------------------------
-- Update query for ReservationLocation page Update operation using user input from HTML form.
-- -----------------------------------------------------
UPDATE ReservationLocation SET locationId = :locationIdFromDropdown, reservationId= :reservationIdFromDropdown
WHERE reservationLocationId = :id

-- -----------------------------------------------------
-- Dis-associate a Reservation from a Location by deleting from ReservationLocation (M-to-M relationship deletion)
-- -----------------------------------------------------
DELETE FROM ReservationLocation WHERE reservationLocationId = :id
