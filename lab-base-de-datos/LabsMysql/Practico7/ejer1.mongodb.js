
// Select the database to use.
use('mflix');

//Ej1

// Insert
db.users.insertMany([
{ "name": "Ned Stark", "email": "bronceman1@mail.es", "password": "pass1" },
{ "name": "Ned Stark2", "email": "bronceman2@mail.es", "password": "pass2" },
{ "name": "Ned Stark3", "email": "bronceman3@mail.es", "password": "pass3" },
{ "name": "Ned Stark4", "email": "bronceman4@mail.es", "password": "pass4" },
{ "name": "Ned Stark5", "email": "bronceman5@mail.es", "password": "pass5" },
]);

var users = db.users.find({ name: /Ned Stark/ })
// var movieid = db.movies.find({},{_id:1}).limit(1)
// var movieid = db.movies.findOne({},{_id:1});
// console.log(movieid);
// console.log(users);

users.forEach(users => {
    db.comments.insertOne({
        name: users.name,
        email: users.email, 
        movieId: new ObjectId("573a1390f29313caabcd4132"),
        text: "muy buena peli",
        date: (new Date()),
    },)
});

db.comments.find({"text": "muy buena peli",})





