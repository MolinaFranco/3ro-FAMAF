

USE world;


/* 1 .- Listar el nombre de la ciudad y el nombre del país de todas las
 * ciudades que pertenezcan a países con una población menor a 10000 habitantes. */

SELECT city.Name, country.Name,(
SELECT SUM(city.Population)
FROM city 
WHERE country.Code = city.CountryCode  
) AS ala
FROM city INNER JOIN country
ON city.COUNTRYCODE = country.CODE
HAVING ala > 10000; 

/* 2.-Listar todas aquellas ciudades cuya población sea mayor
 * que la población promedio entre todas las ciudades.*/

-- SELECT city.Name, city.POPULATION, (
-- 	SELECT AVG(city.Population)
-- 	FROM city
-- ) AS avgs
-- FROM city 
-- WHERE avgs < city.Population;

WITH
prom(value) AS (SELECT AVG(city.Population)FROM city)
SELECT city.Name, city.Population , prom.value
FROM city, prom
WHERE prom.value < city.Population;


/*3 Listar todas aquellas ciudades no asiáticas cuya población 
 * sea igual o mayor a la población total de algún país de Asia.*/

SELECT city.name 
FROM city INNER JOIN country 
WHERE city.countrycode = country.code 
AND country.continent != 'Asia'
AND city.population >= ANY (SELECT city.population 
							FROM city INNER JOIN country 
							ON city.countrycode = country.code 	
							AND country.continent = 'Asia')	

/*4 Listar aquellos países junto a sus idiomas no oficiales, 
 * que superen en porcentaje de
 * hablantes a cada uno de los idiomas oficiales del país.*/

SELECT
	country.name,
	GROUP_CONCAT(countrylanguage.`Language`)
FROM
	country
INNER JOIN countrylanguage
WHERE
	country.CODE = countrylanguage.CountryCode 
	AND countrylanguage.IsOfficial  = 'F'
	AND countrylanguage.Percentage  > ALL (
	SELECT
		countrylanguage.Percentage 
	FROM
		countrylanguage
	WHERE
		countrylanguage.CountryCode  = country.CODE
		AND countrylanguage.IsOfficial  = 'T'
											)
GROUP BY country.Code 

/*5 Listar (sin duplicados) aquellas regiones que tengan países con una superficie menor a 1000 km2
 * y exista (en el país) al menos una ciudad con más de 100000 habitantes. (Hint: Esto puede resolverse con o sin 
 * una subquery, intenten encontrar ambas respuestas).*/

SELECT country.Region 
FROM country 
WHERE country.SurfaceArea < 1000 AND 
EXISTS (SELECT * FROM city WHERE country.Code = city.CountryCode AND city.Population > 100000)
GROUP BY country.Region ;

SELECT country.Region 
FROM country
INNER JOIN city ON country.Code = city.CountryCode 
WHERE country.SurfaceArea < 1000 AND city.Population > 100000
GROUP BY country.Region ;

/*6 Listar el nombre de cada país con la cantidad de habitantes de su ciudad más poblada.
 * (Hint: Hay dos maneras de llegar al mismo resultado. Usando consultas escalares o usando agrupaciones, encontrar ambas).*/

SELECT country.Name, max(city.Population), city.Name
FROM country 
INNER JOIN city ON country.Code = city.CountryCode 
GROUP BY country.name;


SELECT country.Name,(SELECT city.population
					FROM city
					WHERE country.Code = city.CountryCode
					ORDER BY city.Population DESC LIMIT 1) AS 'pepe'
FROM country

/*7 Listar aquellos países y sus lenguajes no oficiales cuyo porcentaje
 * de hablantes sea mayor al promedio de hablantes de los lenguajes oficiales.*/

SELECT country.name, countrylanguage.`Language`
FROM country
INNER JOIN countrylanguage ON
country.Code = countrylanguage.CountryCode
WHERE countrylanguage.IsOfficial = 'F'
AND countrylanguage.Percentage > (SELECT avg(percentage)
	FROM country c2
	INNER JOIN countrylanguage ON
	country.Code = countrylanguage.CountryCode	
	WHERE countrylanguage.IsOfficial = 'T'
	AND c2.code = country.code)

/*8 Listar la cantidad de habitantes por continente ordenado en forma descendente.*/

SELECT country.Continent, sum(country.Population) AS 'habitantes' 
FROM country
GROUP BY country.Continent
ORDER BY 'habitantes'  DESC 
	
/*9 Listar el promedio de esperanza de vida (LifeExpectancy) por continente con una esperanza de vida entre 40 y 70 años.*/

SELECT country.Continent, AVG(country.LifeExpectancy) AS 'EsperanzaDeVida'
FROM country 
GROUP BY country.Continent 
HAVING 70 > EsperanzaDeVida AND EsperanzaDeVida > 40

/*10 Listar la cantidad máxima, mínima, promedio y suma de habitantes por continente.*/

SELECT country.Continent, MAX(country.Population), 
		MIN(country.Population), AVG(country.Population), 
		SUM(country.Population)
FROM country
GROUP BY country.Continent 



