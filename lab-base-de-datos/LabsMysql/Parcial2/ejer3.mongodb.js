// Crear la vista salesInvoiced que calcula el monto mínimo, monto máximo, 
// monto total y monto promedio facturado por año y mes.  Mostrar el resultado 
// en orden cronológico. No se debe mostrar campos anidados en el resultado.


use('supplies');
db.salesInvoiced.drop();
db.createView("salesInvoiced", "sales", [
    {
        $project: {
            '_id': 0,
            'año': { $year: '$saleDate' },
            'mes': { $month: '$saleDate' },
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
            _id: ['$año', '$mes'],
            avgM: { $avg: '$monto' },
            sumM: { $sum: '$monto' },
            minM: { $min: '$monto' },
            maxM: { $max: '$monto' },
        }
    },
    {
        $sort: {
            '_id': 1
        }
    },
    {
        $project: {
            "_id": 0,
            "Año": { $arrayElemAt: ["$_id", 0] },
            "Mes": { $arrayElemAt: ["$_id", 1] },
            'Monto Maximo': '$maxM',
            'Monto Minimo': '$minM',
            'Monto Promedio': '$avgM',
            'Monto Total': '$sumM',
        }
    },
]);
// db.salesInvoiced.find()
