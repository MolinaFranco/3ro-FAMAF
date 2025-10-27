USE sakila;

-- 1 Cree una tabla de directors con las columnas: Nombre, Apellido, Número de Películas.

DROP TABLE IF EXISTS directors; 
CREATE TABLE `directors` (first_name char(255) PRIMARY KEY, last_name char(255), num_movies int);

-- 2 El top 5 de actrices y actores de la tabla `actors` que tienen 
-- la mayor experiencia (i.e. el mayor número de películas filmadas) 
-- son también directores de las películas en las que participaron. 
-- Basados en esta información, inserten, utilizando una subquery los 
-- valores correspondientes en la tabla `directors`.

SELECT first_name, last_name, COUNT(film_id) Experiencia
FROM actor
INNER JOIN film_actor ON
actor.actor_id = film_actor.actor_id
GROUP BY first_name, last_name
ORDER BY Experiencia DESC 
LIMIT 5
;

-- 3 Agregue una columna `premium_customer` que tendrá un valor 'T' o 'F' de acuerdo 
-- a si el cliente es "premium" o no. Por defecto ningún cliente será premium.

ALTER TABLE customer ADD premium_customer char DEFAULT 'F';

-- 4 Modifique la tabla customer. Marque con 'T' en la columna `premium_customer` de los
--  10 clientes con mayor dinero gastado en la plataforma.

UPDATE customer
SET
premium_customer = 'T'
WHERE customer_id IN(SELECT * FROM (SELECT customer.customer_id 
FROM customer
INNER JOIN payment ON
payment.customer_id = customer.customer_id
GROUP BY customer_id
ORDER BY sum(amount) DESC
LIMIT 10)top10);

-- 5 Listar, ordenados por cantidad de películas (de mayor a menor), los distintos ratings de las películas existentes (Hint: rating se refiere en este caso a la clasificación según edad: G, PG, R, etc).

SELECT rating
FROM film
GROUP BY rating
ORDER BY count(film_id);

-- 6 ¿Cuáles fueron la primera y última fecha donde hubo pagos?

(SELECT payment_date FROM payment ORDER BY payment_date LIMIT 1)
UNION 
(SELECT payment_date FROM payment ORDER BY payment_date DESC LIMIT 1);

SELECT min(payment_date) 'primera fecha', max(payment_date) 'ultima fecha' FROM payment;

-- 7 Calcule, por cada mes, el promedio de pagos (Hint: vea la manera de extraer 
-- el nombre del mes de una fecha).

SELECT MONTH(payment_date)AS mes, avg(amount)AS promedioPagos
FROM payment
GROUP BY mes;

-- 8 Listar los 10 distritos que tuvieron mayor cantidad de alquileres 
-- (con la cantidad total de alquileres).

SELECT a.district, count(r.rental_id)suma FROM address a
INNER JOIN customer c ON c.address_id = a.address_id
INNER JOIN rental r ON r.customer_id = c.customer_id
GROUP BY a.district 
ORDER BY suma DESC 
LIMIT 10;

-- 9 Modifique la table `inventory_id` agregando una columna `stock` que sea 
-- un número entero y representa la cantidad de copias de una misma película que 
-- tiene determinada tienda. El número por defecto debería ser 5 copias.

ALTER TABLE inventory ADD stock int DEFAULT 5;

SELECT * FROM inventory;

-- 10 Cree un trigger `update_stock` que, cada vez que se agregue un nuevo 
-- registro a la tabla rental, haga un update en la tabla `inventory` 
-- restando una copia al stock de la película rentada (Hint: revisar que el 
-- rental no tiene información directa sobre la tienda, sino sobre el cliente, 
-- que está asociado a una tienda en particular).

CREATE TRIGGER update_stock AFTER INSERT ON
rental 
FOR EACH ROW
	UPDATE inventory SET
	stock = stock-1
	WHERE inventory.film_id = rental.inventory_id;

DROP TRIGGER update_stock;

-- Cree una tabla `fines` que tenga dos campos: `rental_id` y `amount`. El primero es una clave foránea a la tabla rental y el segundo es un valor numérico con dos decimales.


-- Cree un procedimiento `check_date_and_fine` que revise la tabla `rental` y cree un registro en la tabla `fines` por cada `rental` cuya devolución (return_date) haya tardado más de 3 días (comparación con rental_date). El valor de la multa será el número de días de retraso multiplicado por 1.5.

-- Crear un rol `employee` que tenga acceso de inserción, eliminación y actualización a la tabla `rental`.

-- Revocar el acceso de eliminación a `employee` y crear un rol `administrator` que tenga todos los privilegios sobre la BD `sakila`.

-- Crear dos roles de empleado. A uno asignarle los permisos de `employee` y al otro de `administrator`.
