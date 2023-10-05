USE world;
-- Lista el nombre de la ciudad, nombre del país, región y forma de gobierno de las 10 ciudades más pobladas del mundo.
SELECT city.name, country.name, country.region, country.governmentForm
FROM city
INNER JOIN country ON
country.code = city.countrycode
ORDER BY city.population DESC
LIMIT 10;
-- Listar los 10 países con menor población del mundo, junto a sus ciudades capitales (Hint: puede que uno de estos países no tenga ciudad capital asignada, en este caso deberá mostrar "NULL").
SELECT country.NAME, city.NAME, country.POPULATION
FROM country
LEFT JOIN city ON
country.CAPITAL = city.ID
ORDER BY country.population ASC
LIMIT 10;
-- Listar el nombre, continente y todos los lenguajes oficiales de cada país. (Hint: habrá más de una fila por país si tiene varios idiomas oficiales).
SELECT country.NAME, country.CONTINENT, countrylanguage.`LANGUAGE`
FROM country
INNER JOIN countrylanguage ON
countrylanguage.COUNTRYCODE = country.CODE
WHERE countrylanguage.IsOfficial = 'T';
-- Listar el nombre del país y nombre de capital, de los 20 países con mayor superficie del mundo.
SELECT country.NAME, city.NAME, country.SURFACEAREA
FROM country
LEFT JOIN city ON
country.CAPITAL = city.ID
ORDER BY country.SURFACEAREA DESC
LIMIT 20;
-- Listar las ciudades junto a sus idiomas oficiales (ordenado por la población de la ciudad) y el porcentaje de hablantes del idioma.
SELECT city.NAME, countrylanguage.`LANGUAGE`, countrylanguage.PERCENTAGE
FROM country
INNER JOIN countrylanguage ON
countrylanguage.COUNTRYCODE = country.CODE
INNER JOIN city ON
country.CODE = city.COUNTRYCODE
WHERE countrylanguage.ISOFFICIAL = 'T'
ORDER BY city.POPULATION;
-- Listar los 10 países con mayor población y los 10 países con menor población (que tengan al menos 100 habitantes) en la misma consulta.
(SELECT country.NAME, country.POPULATION
FROM country
ORDER BY country.POPULATION ASC
LIMIT 10)
UNION 
(SELECT country.NAME, country.POPULATION
FROM country
ORDER BY country.POPULATION DESC
LIMIT 10);
-- Listar aquellos países cuyos lenguajes oficiales son el Inglés y el Francés (hint: no debería haber filas duplicadas).
SELECT country.NAME
FROM country
WHERE EXISTS (SELECT *
FROM countrylanguage
WHERE countrylanguage.COUNTRYCODE = country.CODE
AND countrylanguage.`LANGUAGE` = 'English'
AND countrylanguage.ISOFFICIAL = 'T')
AND EXISTS (SELECT *
FROM countrylanguage
WHERE countrylanguage.COUNTRYCODE = country.CODE
AND countrylanguage.`LANGUAGE` = 'French'
AND countrylanguage.ISOFFICIAL = 'T');
-- asqueroso era mejor hacerlo con un intersept xd
-- Listar aquellos países que tengan hablantes del Inglés pero no del Español en su población.
SELECT country.NAME
FROM country
WHERE EXISTS (SELECT *
FROM countrylanguage
WHERE countrylanguage.COUNTRYCODE = country.CODE
AND countrylanguage.`LANGUAGE` = 'English')
AND NOT EXISTS (SELECT *
FROM countrylanguage
WHERE countrylanguage.COUNTRYCODE = country.CODE
AND countrylanguage.`LANGUAGE` = 'Spanish');
-- era mejor usar un except

SELECT country.Name 
FROM country
INNER JOIN countrylanguage ON country.Code = countrylanguage.CountryCode 
WHERE countrylanguage.LANGUAGE = 'English' AND countrylanguage.Percentage > 0
EXCEPT 
SELECT country.Name 
FROM country
INNER JOIN countrylanguage ON country.Code = countrylanguage.CountryCode 
WHERE countrylanguage.LANGUAGE = 'Spanish' AND countrylanguage.Percentage > 0;

-- 1 si devuelven los mismo valores ya que el inner join limita las uniones y luego poner la dependencia por fuera o por dentro los acortara
-- 2 si fuera left no daria lo mismo ya que al ponerlo en el where cortara la tabla luego de producirla si lo ponemos en el innner completara con null lo que no encuentr
