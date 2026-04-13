// Cantidad de películas dirigidas por "Louis Lumière". Se puede 
// responder sin pipeline de agregación, realizar ambas queries.
use('mflix');

// db.movies.count({'directors': 'Louis Lumière'});

db.movies.aggregate([
    {
        $group: {
            _id: '$directors',
            cantidadPeliculas: { $sum: 1 }
        }
    }, {
        $match: {
            _id: 'Louis Lumière'
        }
    }
])
