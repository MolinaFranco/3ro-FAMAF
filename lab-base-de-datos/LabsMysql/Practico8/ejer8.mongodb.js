// Título, año y cantidad de comentarios de las 10 películas 
// con más comentarios.

use('mflix');

db.movies.aggregate([

    {$project:{
        'title': 1,
        'year': 1
    }},
    {$lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'movie_id',
        as: 'peliculas_comentarios'
    }},
    {$project: {
        _id: 0,
        title: 1,
        year: 1,
        cantidad_comentarios: {$size: '$peliculas_comentarios'}
    }},
    {$sort: { 'cantidad_comentarios': -1 }
    },
    {$limit: 10
    }
])



// desde comments
// db.comments.aggregate([
//     {$group: {
//         _id: "$movie_id",
//         cantidad_comentarios: { $sum: 1 }
//      }},
//     {$lookup: {
//         from: "movies", // Suponiendo que los datos de películas están en la colección "movies"
//         localField: "_id",
//         foreignField: "_id",
//         as: "movie_info"
//      }},
//     {$project: {
//         _id: 0,
//         Título: { $arrayElemAt: ["$movie_info.title", 0] },
//         Año: { $year: { $arrayElemAt: ["$movie_info.year", 0] } },
//         "Cantidad de Comentarios": "$cantidad_comentarios"
//     }},
//     {$sort: { "Cantidad de Comentarios": -1 }
//     },
//     {$limit: 10
//     }
//   ])