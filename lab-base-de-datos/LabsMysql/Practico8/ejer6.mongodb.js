// Top 10 de usuarios con mayor cantidad de comentarios, mostrando Nombre, Email y Cantidad de Comentarios

use('mflix');

// db.comments.aggregate([
//     {
//         $group: {
//             _id: '$email',
//             nombre: {$first: '$name'},
//             cantidadComentarios: { $sum: 1 },
//         }
//     },
//     {
//         $sort: {
//             cantidadComentarios: -1
//         }
//     },
//     {
//         $limit: 10
//     },
//     {
//         $project: {
//             _id: 0,
//             email: '$_id',
//             nombre: 1,
//             cantidadComentarios: 1,
//         }
//     }
// ])

db.comments.aggregate([
    {
        $group: {
            _id: "$email",
            nombres: { $addToSet: "$name" },
            cantidad_comentarios: { $sum: 1 }
        }
    }, {
        $sort: { cantidad_comentarios: -1 }
    },
    {
        $limit: 10
    },
    {
        $project: {
            _id: 0,
            Email: "$_id",
            Nombres: "$nombres",
            "Cantidad de Comentarios": "$cantidad_comentarios"
        }
    }
])
