// Buscar las ventas realizadas en "London", "Austin" o "San Diego"; a un 
// customer con edad mayor-igual a 18 años que tengan productos que hayan 
// salido al menos 1000 y estén etiquetados (tags) como de 
// tipo "school" o "kids" (pueden tener más etiquetas).
// Mostrar el id de la venta con el nombre "sale", la fecha (“saleDate"), el 
// storeLocation, y el "email
//  del cliente. No mostrar resultados anidados. 


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

