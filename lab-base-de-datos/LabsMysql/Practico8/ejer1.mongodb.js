// Cantidad de cines (theaters) por estado.

use('mflix');

db.theaters.aggregate([
    {
        $group: {
            _id: '$location.address.state',
            cinesPerState: {$sum: 1},
        }
    },{
        $project: {
            '_id': 0,
            'state': '$_id',
            'cinesPerState': 1,
        }
    }
])