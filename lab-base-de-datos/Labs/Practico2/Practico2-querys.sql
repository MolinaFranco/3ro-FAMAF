USE world;

-- Parte 2
 
SELECT Name, Region FROM country ORDER BY Name, Region;
SELECT Name, Population FROM city ORDER BY Population DESC LIMIT 10;
SELECT Name, Region, SurfaceArea, GovernmentForm FROM country ORDER BY SurfaceArea ASC LIMIT 10;
SELECT Name, GovernmentForm FROM country WHERE IndepYear IS NULL;
SELECT Languagee, Percentage FROM countrylanguage WHERE IsOfficial = 'T';
 
-- Extra

UPDATE countrylanguage SET Percentage = '100.0' WHERE CountryCode = 'AIA';
SELECT * FROM city WHERE District LIKE '%Córdoba' AND CountryCode = 'ARG';
DELETE FROM city WHERE District LIKE '%Córdoba' AND CountryCode != 'ARG';
SELECT Name, HeadOfState FROM country WHERE HeadOfState LIKE '%John%';
SELECT Name, Population FROM country WHERE Population BETWEEN 35000000 AND 45000000
 
-- Code2 es inecesario
-- de una forma muy compleja se puede hacer una FK de continente a city permitiendole el null