//Molina Franco 44192153 Parcial 2 DB Lab

// Ejercicio 1

use('supplies');
db.sales.find(
    {
        'storeLocation': { $in: ["London", "Austin", "San Diego"] },
        'customer.age': { $gte: 18 },
        'items': {
            $elemMatch: {
                $and: [
                    { 'price': { $gte: 1000 } },
                    { 'tags': { $in: ["school", "kids"] } }
                ]
            }
        }
    },
    {   
        '_id': 0,
        'sale': '$_id',
        'fecha': '$saleDate',
        'ubicacion': '$storeLocation',
        'email': 'customer.email'
    }
);

// Ejercicio 2

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


// Ejercicio 3

use('supplies');
// db.salesInvoiced.drop();
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
// consulte y me dijeron que muestre por cada mes de cada año


// Ejercicio 4

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



// Ejercicio 5

use('supplies');
const schema = {
    $jsonSchema: {
        bsonType: 'object',
        required: ['saleDate', 'storeLocation', 'purchaseMethod', 'customer'],
        properties: {
            saleDate: {
                bsonType: 'date',
            },
            storeLocation: {
                bsonType: 'string',
                minLength: 4,
            },
            purchaseMethod: {
                bsonType: 'string',
                enum: ['Online', 'Phone', 'In store']
            },
            customer: {
                bsonType: 'object',
                required: ['email'],
                properties: {
                    gender: {
                        bsonType: 'string',
                        enum: ['M', 'F']
                    },
                    email: {
                        bsonType: 'string',
                        pattern: '^(.*)@(.*)\\.(.{2,4})$',
                    },
                    age: {
                        bsonType: 'int',
                        minimum: 18,
                    },
                    satisfaction: {
                        bsonType: 'int',
                        minimum: 0,
                        maximum: 5,
                    }
                }
            },
        },
    },
}
db.runCommand({ collMod: 'sales', validator: schema });

// caso de éxito 

db.sales.insertOne(
    {
        "saleDate": new Date(''),
        "storeLocation": "FAMAF",
        "customer": {
            "gender": "M",
            "age": 36,
            "email": "messi@mail.com",
            "satisfaction": 5
        },
        "purchaseMethod": "In store"
    }
);

// caso de falla 

db.sales.insertOne(
    {
        "saleDate": '',
        "items": [],
        "storeLocation": "UTN",
        "customer": {
            "gender": "X",
            "age": 10,
            "email": "none",
            "satisfaction": -1
        },
        "purchaseMethod": ""
    }
);