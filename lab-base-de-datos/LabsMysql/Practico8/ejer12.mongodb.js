// Listar el id y nombre de los restaurantes junto con su puntuación 
// máxima, mínima y la suma total. Se puede asumir que el restaurant_id 
// es único.
// Resolver con $group y accumulators.
// Resolver con expresiones sobre arreglos (por ejemplo, $sum) pero sin $group.
// Resolver como en el punto b) pero usar $reduce para calcular la 
// puntuación total.
// Resolver con find.

use('restaurantdb');
db.restaurants.findOne();

//a
// db.restaurants.aggregate([
//     {$unwind: '$grades'},
//     {$group: {
//         // _id: ['$restaurant_id', '$name'],
//         _id: '$restaurant_id',
//         nombre: {$first: '$name'},
//         pMax: {$max: '$grades.score'},
//         pMin: {$min: '$grades.score'},
//         pSum: {$sum: '$grades.score'},
//     }}
// ])


//b
db.restaurants.find(
    {},
    {
        max_score: { $max: "$grades.score" }, // Puntuación máxima
        min_score: { $min: "$grades.score" }, // Puntuación mínima
        total_score: {
            $sum: {
                $map: {
                    input: "$grades.score", // Array de puntuaciones
                    in: "$$this" // Accede a cada puntuación individual
                }
            }
        }
    },
);

//c
// db.restaurants.find(
//     {},
//     {
//         max_score: { $max: "$grades.score" }, // Puntuación máxima
//         min_score: { $min: "$grades.score" }, // Puntuación mínima
//         total_score: {
//             $reduce: {
//                 input: "$grades.score", // Array de puntuaciones
//                 initialValue: 0, // Valor inicial para la suma
//                 in: { $add: ["$$value", "$$this"] } // Suma de puntuaciones
//             }
//         }
//     }
// )