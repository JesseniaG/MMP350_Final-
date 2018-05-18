const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');
const functions = require('firebase-functions');

/*----------------------------------------------*/

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mmp350-node.firebaseio.com"
});

const db = firebaseAdmin.database();
function isAuthenticated(request, response, next) {
	app.get('/post', isAuthenticated, function(request, resopnse){
	response.render('post.ejs');
});
}

/*----------------------------------------------*/
const app = express();
app.use(logger('dev'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));


/*----------------------------------------------*/

function isAuthenticated(request, response, next){
	const uid = request.params.id;
	firebaseAdmin.auth().getUser(uid)
		.then(function(user){
			next();
		})
		.catch(function(error){
			console.log(error);
			response.redirect('/');
		});
}

/*----------------------------------------------*/
app.get('/', function(request,response){
	response.render('login.ejs');
});

app.get('/home', function(request,response){
	response.render('home.ejs');
});

app.get('/login', function(request, response){
	response.render('login.ejs');
});

app.get('/create', function(request, response){
	response.render('create.ejs');
});

app.get('/post/:id', isAuthenticated, function(request, response){
	response.render('post.ejs');
});

app.get('/users/', function(request, response){
	const ref = db.ref('users');
	ref.once('value')
		.then(function(snapshot){
			response.render('users.ejs', {
				data: snapshot.val()
			});
		});
});

app.get('/user/:id', function(request, response) {
	const ref = db.ref('/users/' + request.params.id);
	ref.once('value')
		.then(function(snapshot){
			response.render('user.ejs', {
				data:snapshot.val(),
				user: request.params.id
		});

	});
});

app.get('/profile', function(request, response) {
	response.render('profile.ejs');
});

app.get('/profile', function(request, response) {
	response.render('profile.ejs');
});
/*----------------------------------------------*/
app.get('/about', function(request,response){
	response.send('<h1>About</h1> <a href="/"> Back </a>');
});

const port = process.envPORT || 8000;
app.listen(port, function(){
	console.log("App running on port", port);
});


exports.app = functions.https.onRequest(app);

