// Ratings de IMDB promedio, mínimo y máximo por año de las películas estrenadas en los años 80 
// (desde 1980 hasta 1989), ordenados de mayor a menor por promedio del año.

use('mflix');

// db.movies.findOne()

db.movies.aggregate([
    {
        $match: {
            year: {
                $gte: 1980,
                $lt: 1990
            }
        }
    },
    {
        $group: {
            _id: '$year',
            averageRating: { $avg: '$imdb.rating' },
            minRating: { $min: '$imdb.rating' },
            maxRating: { $max: '$imdb.rating' },
        }
    }, {
        $sort: {
            averageRating: -1
        }
    }

])