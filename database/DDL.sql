-- Group 6 TechTravelers Project Step 4 Draft
-- Group Members: Sajidah Wahdy and Aylee Shomali
-- DDL + Insert statements for TechTravels Database.

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Table `Locations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Locations` ;

CREATE TABLE IF NOT EXISTS `Locations` (
  `locationId` INT(50) NOT NULL AUTO_INCREMENT,
  `cityName` VARCHAR(50) NOT NULL,
  `stateOrProvince` VARCHAR(50),
  `countryName` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`locationId`),
  UNIQUE KEY location (cityName, countryName));
  
-- -----------------------------------------------------
-- Table `Customers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Customers` ;

CREATE TABLE IF NOT EXISTS `Customers` (
  `customerId` INT(50) NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(50) NOT NULL,
  `lastName` VARCHAR(80) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phoneNumber` VARCHAR(15) NOT NULL,
  `address` VARCHAR(700) NOT NULL,
  PRIMARY KEY (`customerId`),
  UNIQUE KEY full_name (firstName, lastName));

-- -----------------------------------------------------
-- Table `Agents`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Agents` ;

CREATE TABLE IF NOT EXISTS `Agents` (
  `agentId` INT(50) NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(50) NOT NULL,
  `lastName` VARCHAR(80) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phoneNumber` VARCHAR(15) NOT NULL,
  `locationId` INT(50),
  PRIMARY KEY (`agentId`),
  UNIQUE KEY full_name (firstName, lastName),
  CONSTRAINT `locationId`
    FOREIGN KEY (`locationId`)
    REFERENCES `Locations` (`locationId`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE);

-- -----------------------------------------------------
-- Table `Reservations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Reservations` ;

CREATE TABLE IF NOT EXISTS `Reservations` (
  `reservationId` INT(50) NOT NULL AUTO_INCREMENT,
  `agentId` INT(50) NOT NULL,
  `startDate` DATE NULL,
  `endDate` DATE NULL,
  PRIMARY KEY (`reservationId`),
  CONSTRAINT `agentId`
    FOREIGN KEY (`agentId`)
    REFERENCES `Agents` (`agentId`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table `CustomerReservation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CustomerReservation` ;

CREATE TABLE IF NOT EXISTS `CustomerReservation` (
  `customerReservationId` INT(50) NOT NULL AUTO_INCREMENT,
  `customerId` INT(50),
  `reservationId` INT(50),
  PRIMARY KEY (`customerReservationId`),
  CONSTRAINT `customerId`
    FOREIGN KEY (`customerId`)
    REFERENCES `Customers` (`customerId`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `reservationId`
    FOREIGN KEY (`reservationId`)
    REFERENCES `Reservations` (`reservationId`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `ReservationLocation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ReservationLocation` ;

CREATE TABLE IF NOT EXISTS `ReservationLocation` (
  `reservationLocationId` INT(50) NOT NULL AUTO_INCREMENT,
  `locationId` INT(50) NOT NULL,
  `reservationId` INT(50) NOT NULL,
  PRIMARY KEY (`reservationLocationId`),
  FOREIGN KEY (`locationId`)
  REFERENCES `Locations` (`locationId`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION,
  FOREIGN KEY (`reservationId`)
  REFERENCES `Reservations` (`reservationId`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION);

-- Insert statements. --

-- Add location data.
INSERT INTO Locations(cityName, stateOrProvince, countryName) VALUES
('Cairo', NULL, 'Egypt'),
('Istanbul', NULL, 'Turkey'),
('Rome', 'Lazio', 'Italy'),
('Milan', 'Lombardia', 'Italy'),
('London', NULL, 'England');

-- Add travel agents data.
INSERT INTO Agents (firstName, lastName, email, phoneNumber, locationId) VALUES
('Bob', 'Nelson', 'bnelson@techtravelers.com', '503-671-9922', 
  (SELECT locationId 
   FROM Locations 
   WHERE cityName = 'Cairo' AND countryName = 'Egypt')
),
('Janice', 'Mohammed', 'jmohammed@techtravelers.com', '971-275-5719', NULL),
('Alex', 'White', 'awhite@techtravelers.com', '877-371-9992', 
  (SELECT locationId 
   FROM Locations 
   WHERE cityName = 'London' AND countryName = 'England')
 );

-- Add customer data.
INSERT INTO Customers(firstName, lastName, email, phoneNumber, address) VALUES
('Larry', 'Ellison', 'lellison@oracle.com', '371-473-3838', '928 Lombard Street, San Francisco, CA 94133'),
('Samara', 'Sudarshana', 'samara.sudarshana@me.com', '847-284-2283', '232, 228, Nurshina Bldg, L.t.marg, Chira Bazar, Mumbai, Maharashtra 400002 India'),
('Badri', 'Sudarshana', 'badri.sudarshana@gmail.com', '473-284-4473', '3526 Kelly Parkway, Belize District, Belize'),
('Giovanni', 'Castelucci', 'giovanni.castelucci@yahoo.com', '579-482-3383', '27592 Nicholson Ct., Miami, Florida 33101');

-- Add reservation data.
INSERT INTO Reservations (agentId, startDate, endDate) VALUES 
((SELECT agentId 
  FROM Agents 
  WHERE firstName = 'Bob' AND lastName = 'Nelson'
 ),
 '2023-10-03', '2023-10-12'),
((SELECT agentId 
  FROM Agents 
  WHERE firstName = 'Alex' AND lastName = 'White'
 ),
 '2023-09-05', '2023-09-19'),
((SELECT agentId 
  FROM Agents 
  WHERE firstName = 'Bob' AND lastName = 'Nelson'
 ),
 '2023-04-11', '2023-04-29');

-- Fill reservation/location intersection table.
INSERT INTO ReservationLocation(locationId, reservationId) VALUES
((SELECT locationId 
   FROM Locations 
   WHERE cityName = 'Cairo' AND countryName = 'Egypt'), 1),
((SELECT locationId 
   FROM Locations 
   WHERE cityName = 'Istanbul' AND countryName = 'Turkey'), 1),
((SELECT locationId 
   FROM Locations 
   WHERE cityName = 'Rome' AND countryName = 'Italy'), 2),
((SELECT locationId 
   FROM Locations 
   WHERE cityName = 'London' AND countryName = 'England'), 3);

-- Fill customer/reservation intersection table.
INSERT INTO CustomerReservation(customerId, reservationId) VALUES
((SELECT customerId 
   FROM Customers
   WHERE firstName = 'Samara' AND lastName = 'Sudarshana'), 1),
((SELECT customerId 
   FROM Customers
   WHERE firstName = 'Badri' AND lastName = 'Sudarshana'), 1),
((SELECT customerId 
   FROM Customers
   WHERE firstName = 'Samara' AND lastName = 'Sudarshana'), 3);

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
COMMIT;
