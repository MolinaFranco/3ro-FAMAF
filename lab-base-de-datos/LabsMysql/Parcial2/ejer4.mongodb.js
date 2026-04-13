// Mostrar el storeLocation, la venta promedio de ese local, el objetivo a cumplir 
// de ventas (dentro de la colección storeObjectives) y la diferencia entre el 
// promedio y el objetivo de todos los locales. 

use('supplies');
db.sales.aggregate([
    {
        $project: {
            '_id': 0,
            'storeLocation': 1,
            'monto': {
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
    {
        $group: {
            _id: '$storeLocation',
            'avgSale': { $avg: '$monto' },
        }
    },
    {
        $lookup: {
            from: 'storeObjectives',
            localField: '_id',
            foreignField: '_id',
            as: 'objetivo'
        }
    },
    {
        $project: {
            '_id': 0,
            'ubicacion': '$_id',
            'venta promedio': '$avgSale',
            'objetivo': { $first: '$objetivo.objective' },
            'diferencia': { $abs: { $subtract: ['$avgSale', { $first: '$objetivo.objective' }] }}
        }
    }
]);

// los profes me confirmaron que puedo tomar el primero ya que cada tienda tiene si o si un solo objetivo