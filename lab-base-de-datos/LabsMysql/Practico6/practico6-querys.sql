USE `classicmodels`;
-- 1Devuelva la oficina con mayor número de empleados.

SELECT officeCode FROM (
SELECT o.officeCode , count(employeeNumber) AS num
FROM offices o
INNER JOIN employees e ON e.officeCode = o.officeCode
GROUP BY officeCode
ORDER BY num DESC 
LIMIT 1) officees;

-- -- -- -- 

WITH 
officesWithEmpCount AS (SELECT o.*, count(e.employeeNumber) AS emp_count
						FROM offices o
						INNER JOIN employees e
						WHERE e.officeCode = o.officeCode
						GROUP BY o.officeCode)
SELECT * FROM officesWithEmpCount oec
WHERE oec.emp_count >= ALL (SELECT emp_count
						  FROM officesWithEmpCount);

						 
-- para comprobar messirve
SELECT o.officeCode, count(e.officeCode) AS total
FROM offices o
INNER JOIN employees e ON 
	e.officeCode = o.officeCode
GROUP BY
	e.officeCode
ORDER BY total DESC ;

-- 2¿Cuál es el promedio de órdenes hechas por oficina?, ¿Qué oficina 
-- vendió la mayor cantidad de productos?

SELECT officeCode, avg(numeroDeOrdenes) promedioDeOrdenes
FROM (
	SELECT o.officeCode, count(orderNumber) numeroDeOrdenes
	FROM offices o
	INNER JOIN employees e ON e.officeCode = o.officeCode
	INNER JOIN customers c ON c.salesRepEmployeeNumber = e.employeeNumber
	INNER JOIN orders ON orders.customerNumber = c.customerNumber
	GROUP BY officeCode) ordenes
GROUP BY officeCode;

SELECT o.officeCode, count(orderNumber) numeroDeOrdenes
FROM offices o
INNER JOIN employees e ON e.officeCode = o.officeCode
INNER JOIN customers c ON c.salesRepEmployeeNumber = e.employeeNumber
INNER JOIN orders ON orders.customerNumber = c.customerNumber
GROUP BY officeCode
ORDER BY numeroDeOrdenes DESC 
LIMIT 1;

-- 3Devolver el valor promedio, máximo y mínimo de pagos que se hacen por mes.

SELECT MONTH(paymentDate) mes, avg(amount) promedio, max(amount), min(amount)
FROM payments
GROUP BY mes
ORDER BY mes;

-- 4Crear un procedimiento "Update Credit" en donde se modifique el límite 
-- de crédito de un cliente con un valor pasado por parámetro.

delimiter \\
DROP PROCEDURE IF EXISTS UpdateCredit;
CREATE PROCEDURE IF NOT EXISTS UpdateCredit (IN custNum int, IN newLimit int)
	UPDATE customers
	SET creditLimit = newLimit
	WHERE customerNumber = custNum

delimiter ;

SELECT * FROM customers;
CALL UpdateCredit(103,22);

-- 5Cree una vista "Premium Customers" que devuelva el top 10 de clientes 
-- que más dinero han gastado en la plataforma. La vista deberá devolver el 
-- nombre del cliente, la ciudad y el total gastado por ese cliente en la plataforma.

CREATE VIEW PremiumCustomers AS (
SELECT c.customerName, c.city, sum(p.amount)AS gastoTotal
FROM customers c
INNER JOIN payments p ON p.customerNumber = c.customerNumber
GROUP BY c.customerNumber
ORDER BY gastoTotal DESC 
LIMIT 10
);

SELECT * FROM PremiumCustomers;



-- 6Cree una función "employee of the month" que tome un mes y un año 
-- y devuelve el empleado (nombre y apellido) cuyos clientes hayan efectuado 
-- la mayor cantidad de órdenes en ese mes.

-- funciones devuelven un solo valor => usar concat

delimiter //
CREATE FUNCTION employeeOfMonth(monthin int, yearin int) RETURNS varchar(256)
	DETERMINISTIC 
	BEGIN 
	DECLARE bestEmployee varchar(256);
		SELECT concat(e.lastName, " ",  e.firstName) INTO bestEmployee
		FROM employees e
		INNER JOIN customers c ON c.salesRepEmployeeNumber = e.employeeNumber
		INNER JOIN orders o ON o.customerNumber = c.customerNumber
		WHERE month(o.orderDate) = monthin AND year(o.orderDate) = yearin
		GROUP BY e.employeeNumber
		ORDER BY count(o.orderNumber) DESC 
		LIMIT 1;
	RETURN bestEmployee;
	END//
delimiter ;
	
SELECT *
FROM employees e
WHERE concat(e.lastName, " ", e.firstName) = employeeOfMonth(1, 2003);

-- 7Crear una nueva tabla "Product Refillment". Deberá tener una relación 
-- varios a uno con "products" y los campos: `refillmentID`, `productCode`, 
-- `orderDate`, `quantity`.

DROP TABLE IF EXISTS ProductRefillment;
CREATE TABLE ProductRefillment (
	refillmentID int UNIQUE PRIMARY KEY,
	productCode varchar(15),
	FOREIGN KEY (productCode) REFERENCES products(productCode),
	orderDate date,
	quantity int
)

-- 8Definir un trigger "Restock Product" que esté pendiente de los cambios
-- efectuados en `orderdetails` y cada vez que se agregue una nueva orden 
-- revise la cantidad de productos pedidos (`quantityOrdered`) y compare 
-- con la cantidad en stock (`quantityInStock`) y si es menor a 10 genere 
-- un pedido en la tabla "Product Refillment" por 10 nuevos productos.

delimiter \\
CREATE TRIGGER IF NOT EXISTS RestockProduct 
AFTER INSERT ON orderdetails
FOR EACH ROW 
BEGIN 
	DECLARE stock int;
	SELECT p.quantityInStock INTO stock FROM products WHERE NEW.productCode = p.productCode;
	
	IF(NEW.quantityOrdered - stock < 10)
	THEN 
		INSERT INTO ProductRefillment
		VALUES (NEW.productCode, 10, curdate());
	END IF; 
END \\
delimiter ;

-- 9Crear un rol "Empleado" en la BD que establezca accesos de 
-- lectura a todas las tablas y accesos de creación de vistas.

CREATE ROLE Empleado;
GRANT SELECT ON classicmodels.* TO Empleado;
GRANT CREATE VIEW ON classicmodels.* TO Empleado;

-- Consultas Adicionales
-- Las siguientes consultas son más difíciles:

-- 1Encontrar, para cada cliente de aquellas ciudades que comienzan 
-- por 'N', la menor y la mayor diferencia en días entre las fechas 
-- de sus pagos. No mostrar el id del cliente, sino su nombre y el de su contacto.

SELECT c.customerNumber, max(datediff(p.paymentDate, p2.paymentDate)) maxDiff, min(datediff(p.paymentDate, p2.paymentDate)) minDiff
FROM customers c
INNER JOIN payments p ON c.customerNumber = p.customerNumber 
INNER JOIN payments p2 ON c.customerNumber = p2.customerNumber AND p.paymentDate <> p2.paymentDate
WHERE c.city LIKE "N%" 
GROUP BY c.customerNumber;

-- 2Encontrar el nombre y la cantidad vendida total de 
-- los 10 productos más vendidos que, a su vez, 
-- representen al menos el 4% del total de productos, 
-- contando unidad por unidad, de todas las órdenes donde intervienen. 
-- No utilizar LIMIT.


SELECT z.productName, z.ventaTotal FROM (
	SELECT p.productName, sum(o.quantityOrdered) ventaTotal, 
	FROM products p
	INNER JOIN orderdetails o ON o.productCode = p.productCode
	GROUP BY p.productCode
	) z
WHERE z.ventaTotal >= 0.04 * (SELECT sum(o2.quantityOrdered) FROM orderdetails o2)

-- wili

SELECT productName, totalProduct AS units_sold FROM 
(SELECT p.productName, sum(o.quantityOrdered) totalProduct,
ROW_NUMBER() OVER w AS `rn`,
(SELECT sum(quantityOrdered)
FROM orderdetails o
JOIN 
(SELECT *
FROM orders o2
WHERE EXISTS (SELECT *
FROM orderdetails o
WHERE o.productCode = p.productCode
AND o2.orderNumber = o.orderNumber)) selected_orders ON
o.orderNumber = selected_orders.orderNumber) totalSales
FROM orderdetails o
JOIN products p
ON
o.productCode = p.productCode
GROUP BY p.productCode
HAVING totalProduct >= 0.04 * totalSales
WINDOW w AS (ORDER BY sum(o.quantityOrdered) DESC)) aux
WHERE `rn` <= 10;


-- anotaciones extras
-- se puede hacer unique(a,b) para q la combinacion doble sea la unica