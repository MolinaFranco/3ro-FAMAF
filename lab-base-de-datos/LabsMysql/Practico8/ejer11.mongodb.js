// Listar los usuarios que realizaron comentarios durante el mismo 
// mes de lanzamiento de la película comentada, mostrando Nombre, Email,
// fecha del comentario, título de la película, fecha de lanzamiento. 
// HINT: usar $lookup con multiple condiciones 

use('mflix');

db.comments.aggregate([
    {
        $lookup: {
            from: "movies",
            let: { movie_id: "$movie_id", comment_date: "$date" }, // haces variables de la tabla padre
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$_id", "$$movie_id"] },
                                { $eq: [{ $month: "$$comment_date" }, { $month: "$released" }] },
                                { $eq: [{ $year: "$$comment_date" }, { $year: "$released" }] }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        title: 1,
                        released: 1
                        
                    }
                }
            ],
            as: "matched_movies"
        }
    },
    {
        $match: {
            matched_movies: { $ne: [] } // Filtrar comentarios con películas encontradas
        }
    },
    {
        $project: {
            _id: 0,
            Nombre: "$name",
            Email: "$email",
            fecha_comentario: "$date",
            "Película": { $arrayElemAt: ["$matched_movies.title", 0] },
            fecha_lanzamiento: { $arrayElemAt: ["$matched_movies.released", 0] }
        }
    }
])


// $expr es un operador de expresión en MongoDB que te permite utilizar 
// expresiones de consulta dentro de ciertas etapas de agregación, como 
// $match, $project, $redact, $addFields, $lookup, entre otras.