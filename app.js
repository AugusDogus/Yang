var express = require('express');
var darmok = require('darmok');

var app = express();

// set up handlebars view engine
var handlebars = require('express-handlebars')
    .create({
        defaultLayout: 'main'
    });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 7645);

app.use(express.static(__dirname + '/public'));

function generateName() {
    var str = darmok.util.splitFile("fantasyNames.txt");
    var res = str[0].split(" ");
    var randomIndex = Math.floor(Math.random() * res.length);
    var randomElement = res[randomIndex];

    //If name is less than 12
    if (randomElement.length < 12) {

        //Generate a random length for the name to be between the length of the name and 12

        function randomIntFromInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        var min = randomElement.length + 1;
        var max = 12;

        var randomLength = randomIntFromInterval(min, max);

        var numbersToGenerate = randomLength - randomElement.length;

        for (i = 0; i < numbersToGenerate; i++) {
            randomElement = randomElement + Math.floor((Math.random() * 10) + 1);
        }
    }

    return randomElement;
}


app.get('/', function(req, res) {
    name = generateName();
    res.render('home', {
        name: name
    });
});

app.get('/api', function(req, res) {
    name = generateName();
    res.json({
        name: name
    });
})

//Weird bug
app.get('/admin', function(req, res) {
    res.redirect('/404');
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Yang started on port ' +
        app.get('port') + '.');
});
