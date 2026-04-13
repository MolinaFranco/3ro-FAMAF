// Actualizar el valor de la contraseña del usuario cuyo email es c a 
// "some password". La misma consulta debe poder insertar un nuevo usuario en caso que el usuario
//  no exista. Ejecute la consulta dos veces. ¿Qué operación se realiza en cada caso?  (Hint: usar upserts). 

use('mflix');

db.users.updateOne(
    {
        'mail': 'joel.macdonel@fakegmail.com'
    },{
        $set: {
            'contraseña': 'some password'
        }
    },{
        upserts: true
    }
)
