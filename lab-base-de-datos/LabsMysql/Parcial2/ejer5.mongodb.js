// Especificar reglas de validación en la colección sales utilizando JSON Schema. 
// Las reglas se deben aplicar sobre los campos: 
// saleDate, storeLocation, purchaseMethod, y  customer ( y todos sus campos anidados ).
//  Inferir los tipos 
// y otras restricciones que considere adecuados para especificar las reglas a 
// partir de los documentos de la colección. 
// Para testear las reglas de validación crear un caso de falla en la regla de 
// validación y un caso de éxito (Indicar si es caso de falla o éxito)

use('supplies');
db.sales.findOne({}, {})
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