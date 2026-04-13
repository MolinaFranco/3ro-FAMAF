// Crear una vista con los 5 géneros con mayor cantidad de 
// comentarios, junto con la cantidad de comentarios.

use('mflix');
db.comments.findOne()

// db.movies.aggregate([
//     {$lookup: {
//         from: 'comments',
//         localField: '_id',
//         foreignField: 'movie_id',
//         as: 'movie_comments'
//     }},
//     {$group: {
//         _id: '$genres',
//         cantidad_comentarios: {$sum: {$size: '$movie_comments'}}
//     }},
//     {$sort: { cantidad_comentarios: -1 }},
//     {$limit: 5}
// ])

// si necesitas contar para los distintos generos simplemente hacemos un unwind

// db.createView("TopGenresByComments", "movies", [
//     {
//       $lookup: {
//         from: "comments",
//         localField: "_id",
//         foreignField: "movie_id",
//         as: "movie_comments"
//       }
//     },
//     {
//       $unwind: "$genres"
//     },
//     {
//       $group: {
//         _id: "$genres",
//         cantidad_comentarios: { $sum: { $size: "$movie_comments" } }
//       }
//     },
//     {
//       $sort: { cantidad_comentarios: -1 }
//     },
//     {
//       $limit: 5
//     }
//   ])

db.createView("TopGenresByComments", "movies", [
    {$lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'movie_id',
        as: 'movie_comments'
    }},
    {$group: {
        _id: '$genres',
        cantidad_comentarios: {$sum: {$size: '$movie_comments'}}
    }},
    {$sort: { cantidad_comentarios: -1 }},
    {$limit: 5}
]);