// Listar los actores (cast) que trabajaron en 2 o más películas 
// dirigidas por "Jules Bass". Devolver el nombre de estos actores
//  junto con la lista de películas (solo título y año) dirigidas 
//  por “Jules Bass” en las que trabajaron. 

use('mflix');
db.movies.findOne()

//nose por q la query no es deterministica

// db.movies.aggregate([
//     {$match: {directors: 'Jules Bass'}
//     },
//     {$unwind: "$cast"
//     },
//     {$group: {
//         _id: {
//             actor: "$cast",
//             movie_id: "$_id"
//         },
//         movies: { $push: { title: "$title", year: "$year" } }
//     }},
//     {$group: {
//         _id: "$_id.actor",
//         movies: { $push: "$movies" },
//         movie_count: { $sum: 1 }
//     }},
//     {$match: {
//         movie_count: { $gte: 2 }
//     }},
//     {$project: {
//         _id: 0,
//         actor: "$_id",
//         movies: 1,
//         cantidad: '$movie_count'
//     }}
// ])

// el push nos sirve mucho en este caso para generar los arrays con toda
// la infromacion que vamos a necesitar
// dentro de los group no entrar en panico y generar lo que neces



// con addToSet


db.movies.aggregate([
    {$match: {'directors': {
        $elemMatch: {$eq: "Jules Bass"}
    }}},
    {$unwind: "$cast"
    },
    {$group: {
        _id: "$cast",
        movies: { $addToSet: { title: "$title", year: "$year" } },
        // movie_count: { $sum: 1 }
        movies_id: { $addToSet: '$_id' }
    }},
    {$match: {
        // movie_count: { $gte: 2 }
        $expr: {
            // $gte: [{ $size: "$movies" }, 2] // Encuentra documentos con más de 2 elementos en el campo 'movies'
            $gte: [{ $size: "$movies_id" }, 2] // Encuentra documentos con más de 2 elementos en el campo 'movies'
        }
    }},
    {$project: {
        _id: 0,
        actor: "$_id",
        movies: 1,
        // cantidad: '$movie_count'
    }},
    // {$count: 'cantidad de pibardos'}
])