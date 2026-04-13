// Ej2
// Listar el título, año, actores (cast), directores y rating de las 10 películas con mayor
//  rating (“imdb.rating”) de la década del 90. ¿Cuál es el valor del rating de la película 
// que tiene mayor rating? (Hint: Chequear que el valor de “imdb.rating” sea de tipo “double”).

use('mflix');

db.movies.find(
    {
        'imdb.rating': {$type: 'double'},
        'year': { $gte: 1990, $lt: 2000 },
    },
    {
        'imdb.rating': 1,
        'title': 1,
        'year': 1,
        'cast': 1,
        'directors': 1,
        'rating': 1,
    }
).sort({'imdb.rating': -1}).limit(10);

db.movies.find({'imdb.rating': {$exists:true, $type:'double'}},{'imdb.rating':1}).sort({ "imdb.rating": -1 }).limit(1);