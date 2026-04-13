// Especificar en la colección theaters las siguientes reglas de validación:
//  El campo 
// - theaterId (requerido) debe ser un int y 
// - location (requerido) debe ser un object con:
//  - - un campo address (requerido) que sea un object con 
//  - - - campos street1, city, state y zipcode todos de tipo string y requeridos
// - un campo geo (no requerido) que sea un object con 
//  - - un campo type, con valores posibles “Point” o null y coordinates que debe ser una lista 
// de 2 doubles
// Por último, estas reglas de validación no deben prohibir la inserción
//  o actualización de documentos que no las cumplan sino que solamente deben advertir.



use('mflix');
// db.theaters.findOne()


const schema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["theaterId", "location"],
        properties: {
            theaterId: {
                bsonType: "int",
            },
            location: {
                bsonType: "object",
                required: ["address"],
                properties: {
                    address: {
                        bsonType: "object",
                        required: ["street1", "city", "state", "zipcode"],
                        properties: {
                            street1: { bsonType: "string" },
                            city: { bsonType: "string" },
                            state: { bsonType: "string" },
                            zipcode: { bsonType: "string" }
                        }
                    },
                },
            },
            geo:{
                bsonType: "object",
                required: ["type","coordinates"],
                properties:{
                    type:{
                        bsonType: ["string", 'null'],
                        enum: ["Point", null]
                    },
                    coordinates: {
                        bsonType: "array",
                        items: {
                            bsonType: "double"
                        }
                    }
                }

            }
        },
    },
}

db.runCommand({ collMod: "users", validator: schema, validationLevel: "moderate", validationAction: "warn"});