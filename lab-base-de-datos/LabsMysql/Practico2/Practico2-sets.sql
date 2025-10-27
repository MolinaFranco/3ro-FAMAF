USE world;

-- Parte 1

DROP TABLE IF EXISTS countrylanguage;
DROP TABLE IF EXISTS city;
DROP TABLE IF EXISTS country;
DROP TABLE IF EXISTS continent;


CREATE TABLE country (
	Code VARCHAR(3) PRIMARY KEY,
	Name VARCHAR(255),
	Continent VARCHAR(255),
	Region VARCHAR(255),
	SurfaceArea INT,
	IndepYear INT(4),
	Population INT,
	LifeExpectancy INT,
	GNP INT,
	GNPOid INT,
	LocalName VARCHAR(255),
	GovernmentForm VARCHAR(255),
	HeadOfState VARCHAR(255),
	Capital INT,
	Code2 VARCHAR(2)
);

CREATE TABLE countrylanguage (
	CountryCode VARCHAR(3), 
	FOREIGN KEY (CountryCode) REFERENCES country(Code),
	Languagee VARCHAR(255),
	IsOfficial CHAR(1),
	Percentage FLOAT,
	PRIMARY KEY (CountryCode,Languagee)
);

CREATE TABLE city (
	ID INT PRIMARY KEY,
	Name VARCHAR(255),
	CountryCode VARCHAR(255), 
	FOREIGN KEY (CountryCode) REFERENCES country(Code),
	District VARCHAR(255),
	Population INT
);

CREATE TABLE continent(
  Name VARCHAR(255) PRIMARY KEY,
  Area FLOAT,
  Porcentaje FLOAT,
  Ciudad_pob VARCHAR(255)
);
 
INSERT INTO continent(Name,Area,Porcentaje,Ciudad_pob)
VALUES ('Africa', 30370000, 20.4, 'Cairo, Egypt'),
	('Antarctica', 14000000, '9.2', 'McCurdo Station'),
	('Asia', 44579000, '29.5', 'Mumbay, India'),
	('Europe', 10180000, '6.8', 'Instanbul, Turquia'),
	('North America', 24709000, '16.5', 'Ciudad de Mexico, Mexico'),
	('Oceania', 8600000, '5.9', 'Sydney, Australia'),
	('South America', 17840000, '12.0', 'São Pablo, Brazil');

ALTER TABLE country MODIFY COLUMN Continent char(52);
ALTER TABLE country ADD CONSTRAINT continent_of_country FOREIGN KEY (Continent) REFERENCES continent (Name);
 