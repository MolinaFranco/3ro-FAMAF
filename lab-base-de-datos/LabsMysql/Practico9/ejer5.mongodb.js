// Cantidad de películas estrenadas en los años 50 (desde 1950 
// hasta 1959). Se puede responder sin pipeline de agregación, 
// realizar ambas queries.

use('mflix');

db.movies.findOne();
// db.movies.count({'year': {$gte: 1950, $lt:1960}})

db.movies.aggregate([
    {
        $match: { 'year': { $gte: 1950, $lt: 1960 } }
    }, {
        $group: {
            _id: 1,
            peliculas_estrenadas: { $sum: 1}
        }
    },{
        $project: {
            _id: 0,
            peliculas_estrenadas: 1
        }
    }
])