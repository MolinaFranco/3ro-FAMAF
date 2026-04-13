// Cantidad de estados con al menos dos cines (theaters) registrados.

use('mflix');

db.theaters.aggregate([
    {
        $group: {
            _id: '$location.address.state',
            cantidadCines: { $sum: 1 }
        }
    }, {
        $match: {
            cantidadCines: { $gte: 2 }
        }
    }, {
        $project: {
            _id: 0,
            estado: '$_id',
            cantidadCines: 1
        }
    }
])
