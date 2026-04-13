// Agregar dos nuevas calificaciones al restaurante cuyo id es "50018608". A continuación se 
// especifican las calificaciones a agregar en una sola consulta.  

use('restaurantdb');

db.restaurants.updateOne(
    {'restaurant_id': '50018608'},
    {
        $push:  {
            'grades': {
                $each: [
                    {
                        "date" : ISODate("2019-10-10T00:00:00Z"),
                        "grade" : "A",
                        "score" : 18
                    }
                    ,
                    {
                        "date" : ISODate("2020-02-25T00:00:00Z"),
                        "grade" : "A",
                        "score" : 21
                    }
                    
                ]
            }
        }
    }
)

db.restaurants.find({'restaurant_id': '50018608'})