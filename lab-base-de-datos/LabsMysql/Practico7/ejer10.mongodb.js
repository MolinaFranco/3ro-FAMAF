// Listar el id del restaurante (restaurant_id) y las calificaciones de los restaurantes 
// donde al menos una de sus calificaciones haya sido realizada entre 2014 y 2015 inclusive, 
// y que tenga una puntuación (score) mayor a 70 y menor o igual a 90.

use('restaurantdb')

// db.restaurants.find(
//     {
//         'grades.date': { $gte: Date('2014-01-01'), $lt: Date('2016-01-01') },
//         'grades.score': { $gte: 70, $lte: 90 },
//     },
//     {
//         'restaurant_id': 1,
//         'grades': 1
//     },
// )

db.restaurants.find(
        {
            'grades': {$elemMatch: {
                'date': { $gte: Date('2014-01-01'), $lt: Date('2016-01-01') },
                'score': { $gt: 70, $lte: 90 },
            }}
        },
        {
            'restaurant_id': 1,
            'grades': 1
        },
    )
