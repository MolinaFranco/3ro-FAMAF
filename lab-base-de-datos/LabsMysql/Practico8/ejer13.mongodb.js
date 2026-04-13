// Actualizar los datos de los restaurantes añadiendo dos campos nuevos. 
// "average_score": con la puntuación promedio
// "grade": con "A" si "average_score" está entre 0 y 13, 
//   con "B" si "average_score" está entre 14 y 27 
//   con "C" si "average_score" es mayor o igual a 28    

// Se debe actualizar con una sola query.
// HINT1. Se puede usar pipeline de agregación con la operación update
// HINT2. El operador $switch o $cond pueden ser de ayuda.

use('restaurantdb');

db.restaurants.findOne();

const updateAgg = ([
    {$addFields: {
        average_score: { $avg: "$grades.score" },
    }},
    {$addFields: {
        grade: {$switch: {
            branches: [
                { case: { $and: [{ $gte: ["$average_score", 0] }, { $lte: ["$average_score", 13] }] }, then: 'A' },
                { case: { $and: [{ $gte: ["$average_score", 14] }, { $lte: ["$average_score", 27] }] }, then: 'B' },
                { case: { $gte: ["$average_score", 28] }, then: 'C' }
            ],
            default: 'X'
        }}
    }}
]);

db.restaurants.updateMany({}, updateAgg);

// otra opcion
// use("restaurantdb")
// db.restaurants.aggregate()
// db.restaurants.updateMany(
//     {},
//     [
//         {
//             $set: {
//                 average_score: {
//                     $avg: "$grades.score"
//                 }
//             }
//         },
//         {
//             $set: {
//                 grade: {
//                     $switch: {
//                         branches: [
//                             {
//                                 case: {
//                                     $and: [
//                                         { $gte: ["$average_score", 0] },
//                                         { $lte: ["$average_score", 13] }
//                                     ]
//                                 },
//                                 then: "A"
//                             },
//                             {
//                                 case: {
//                                     $and: [
//                                         { $gte: ["$average_score", 14] },
//                                         { $lte: ["$average_score", 27] }
//                                     ]
//                                 },
//                                 then: "B"
//                             },
//                             {
//                                 case: {
//                                     $gte: ["$average_score", 28]
//                                 },
//                                 then: "C"
//                             }
//                         ],
//                         default: "F"

//                     }
//                 }
//             }
//         }
//     ]
// )
