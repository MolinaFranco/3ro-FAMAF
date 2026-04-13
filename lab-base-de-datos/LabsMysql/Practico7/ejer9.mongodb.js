// Remover todos los comentarios realizados por el usuario cuyo email es victor_patel@fakegmail.com 
// durante el año 1980.

use('mflix');

db.comments.deleteMany(
    {
        'email': 'victor_patel@fakegmail.com',
        'date': {$gte: Date('1980-01-01'), $lt: Date('1981-01-01'),}
    }
)