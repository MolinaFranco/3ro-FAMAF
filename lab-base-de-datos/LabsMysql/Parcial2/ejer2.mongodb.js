// Buscar las ventas de las tiendas localizadas en Seattle, donde 
// el método de compra sea ‘In store’ o ‘Phone’ y se hayan 
// realizado entre 1 de febrero de 2014 y 31 de enero de 2015 (ambas fechas 
// inclusive). Listar el email y la satisfacción del cliente, y el monto 
// total facturado, donde el monto de cada item se calcula como 'price * 
// quantity'. Mostrar el resultado ordenados por satisfacción (descendente), 
// frente a empate de satisfacción ordenar por email (alfabético). 

use('supplies');
db.sales.aggregate([
    {
        $match: {
            'storeLocation': 'Seattle',
            'purchaseMethod': { $in: ['In store', 'Phone'] },
            'saleDate': { $gte: new Date('2014-02-1'), $lte: new Date('2015-01-31') },
        }
    },
    {
        $project: {
            '_id': 0,
            'email': '$customer.email',
            'satisfaccion': '$customer.satisfaction',
            'montoTotal': {
                $sum: {
                    $map: {
                        input: "$items",
                        as: "item",
                        in: {
                            $multiply: ["$$item.quantity", '$$item.price']
                        }
                    }
                }
            }
        }
    },
    { $sort: { 'satisfaccion': -1 , 'email': 1} },
])
