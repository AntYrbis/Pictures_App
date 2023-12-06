const { Client } = require('pg');
const express = require('express');
const fs = require("fs");
const http = require("http");
const bodyParser = require('body-parser');

const host = 'localhost';
const port = 8080;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Client pour la base de données
const client = new Client({
    user: 'postgresserv',
    password: 'pokemon25',
    database: 'photo',
    port: 5432
});

const order = ['date', 'likes',];
const where = ['portrait', 'paysage'];
const and = [0, 1, 2, 3, 4];
const mode_actual = [order[0], where[0], and[0]];

//Connection à la base de données
client.connect()
    .then(() => {
        console.log('Connected to database');
    })
    .catch((e) => {
        console.log('Error connecting to database');
        console.log(e);
    });

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/public/index.html');
});

app.get('/index', (req, res) => {
    res.redirect('/public/index.html');
});

app.get('/index.html', (req, res) => {
    res.redirect('/public/index.html');
});

app.get('/mur-images', async (req, res) => {
    try {
        let sqlQuery = '';
        let values = [];
        if (mode_actual[2] == 0) {
            sqlQuery = 'SELECT p.fichier, p.likes, p.id, o.nom FROM photos p JOIN orientations o ON p.orientation = o.id WHERE o.nom = $1 ORDER BY p.' + mode_actual[0] + ' DESC, p.id ASC';
            values = [mode_actual[1]];
        } else {
            sqlQuery = 'SELECT p.fichier, p.likes, p.id, o.nom FROM photos p JOIN orientations o ON p.orientation = o.id WHERE o.nom = $1 AND p.id_photographe =$2  ORDER BY p.' + mode_actual[0] + ' DESC, p.id ASC';
            values = [mode_actual[1], mode_actual[2]];
        }
        const sqlResult = await client.query(sqlQuery, values);
        //console.log(sqlResult.rows);

        //Grâce à la fonction map, on récupère un tableau contenant les valeurs de la colonne fichier
        const fichiersImage = sqlResult.rows.map(row => row.fichier);
        const likesImage = sqlResult.rows.map(row => row.likes);
        const idImage = sqlResult.rows.map(row => row.id);
        //console.log(fichiersImage);
        //console.log(likesImage);
        //console.log(idImage);

        const sqlQuerys = 'SELECT nom, prenom FROM photographes'
        const sqlResults = await client.query(sqlQuerys);
        const nomsPhotographe = sqlResults.rows.map(row => row.nom);
        const prenomsPhotographe = sqlResults.rows.map(row => row.prenom);
        //console.log(nomsPhotographe);
        //console.log(nomsPhotographe);

        const pageTitle = "Mur d'images";
        const imagesList = fichiersImage;
        const likesList = likesImage;
        const idList = idImage;
        const nomsPhotographes = nomsPhotographe;
        const prenomsPhotographes = prenomsPhotographe;

        res.render('mur', { pageTitle, imagesList, likesList, idList, nomsPhotographes, prenomsPhotographes });
    } catch (e) {
        console.log(e);
        res.end(e);
    }
});

app.get('/image/:id', async (req, res) => {
    let id = req.params.id - 1;
    //console.log(id);
    try {
        let sqlQuery = '';
        let values = [];
        if (mode_actual[2] == 0) {
            sqlQuery = 'SELECT p.fichier, p.nom AS photo_nom, p.comments, o.nom, ph.nom, ph.prenom FROM photos p JOIN orientations o ON p.orientation = o.id JOIN photographes ph ON p.id_photographe = ph.id WHERE o.nom = $1 ORDER BY p.' + mode_actual[0] + ' DESC, p.id ASC';
            values = [mode_actual[1]];
        } else {
            sqlQuery = 'SELECT p.fichier, p.nom AS photo_nom, p.comments, o.nom, ph.nom, ph.prenom FROM photos p JOIN orientations o ON p.orientation = o.id JOIN photographes ph ON p.id_photographe = ph.id WHERE o.nom = $1 AND p.id_photographe =$2 ORDER BY p.' + mode_actual[0] + ' DESC, p.id ASC';
            values = [mode_actual[1], mode_actual[2]];
        }
        const sqlResult = await client.query(sqlQuery, values);
        //console.log(sqlResult.rows);

        //On récupère les valeurs du tableau photos 
        const fichiersImage = sqlResult.rows.map(row => row.fichier);
        const nomsImage = sqlResult.rows.map(row => row.photo_nom);
        const commentsImage = sqlResult.rows.map(row => row.comments);
        //console.log(fichiersImage);
        //console.log(nomsImage);
        //console.log(commentsImage);
        //On récupère les valeurs du tableau photographes
        const nomsPhotographe = sqlResult.rows.map(row => row.nom);
        const prenomsPhotographe = sqlResult.rows.map(row => row.prenom);
        //console.log(nomsPhotographe);
        //console.log(prenomsPhotographe);

        const pageTitle = "Image";
        const imagesList = fichiersImage;
        const namesList = nomsImage;
        const commentsList = commentsImage;
        const nomsList = nomsPhotographe;
        const prenomsList = prenomsPhotographe;

        res.render('image', { pageTitle, id, imagesList, namesList, commentsList, nomsList, prenomsList });
    } catch (e) {
        console.log(e);

        res.end(e);
    }
});

app.get('/j-aime/:id', async (req, res) => {
    let id = req.params.id;
    //console.log(id);
    try {
        const sqlQuery = `UPDATE photos SET likes = likes + 1 WHERE id = $1`;
        const values = [id];
        const sqlResult = await client.query(sqlQuery, values);
    } catch (e) {
        console.log(e);
        res.end(e);
    }
    res.redirect('/mur-images');
});

app.post('/image-description', async (req, res) => {
    try {
        const imageID = req.body.imageID;
        const text = req.body.text;
        const description = decodeURIComponent(text.replace(/\+/g, ' '));
        console.log("nombre:", imageID, "texte:", description);

        let sqlQuery = '';
        let values = [];
        if (mode_actual[2] === 0) {
            sqlQuery = 'SELECT p.fichier, p.id FROM photos p JOIN orientations o ON p.orientation = o.id WHERE o.nom = $1 ORDER BY p.' + mode_actual[0] + ' DESC, p.id ASC';
            values = [mode_actual[1]];
        } else {
            sqlQuery = 'SELECT p.fichier, p.id FROM photos p JOIN orientations o ON p.orientation = o.id WHERE o.nom = $1 AND p.id_photographe =$2 ORDER BY p.' + mode_actual[0] + ' DESC, p.id ASC';
            values = [mode_actual[1], mode_actual[2]];
        }

        const sqlResult = await client.query(sqlQuery, values);
        const idImage = sqlResult.rows.map(row => row.id);

        const sqlQueryUpdate = 'UPDATE photos SET comments = $1 WHERE id = $2';
        const updateValues = [decodeURIComponent(description.replace(/\+/g, ' ')), idImage[imageID - 1]];
        await client.query(sqlQueryUpdate, updateValues);

        const pageHTML = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
          <style> 
            body {
              background: rgb(134, 128, 128);
            }
            h1 {
              color: whitesmoke;
              text-align: center;
              margin-top: 50px;
              font-size: 1.5rem;
            }
          </style>
        </head>
        <body>
          <h1>Votre commentaire a bien été ajouté. Merci pour votre contribution !</h1>
        </body>
        </html>`;
        res.end(pageHTML);
    } catch (e) {
        console.error('Erreur :', e);
        res.status(500).send('Erreur interne du serveur');
    }
});

app.post('/tri-images', (req, res) => {
    let value = req.body.tri;
    //console.log(value);
    mode_actual[0] = value;

    res.redirect('/mur-images');
});

app.post('/tri-orientations', (req, res) => {
    let value = req.body.tri_o;
    //console.log(value);
    mode_actual[1] = value;

    res.redirect('/mur-images');
});

app.post('/tri-photographes', (req, res) => {
    let value = req.body.tri_p;
    //console.log(value);
    mode_actual[2] = value;

    res.redirect('/mur-images');
});

// EJS 
app.set('view engine', 'ejs');
app.set('views', './ejs-templates');

app.get('/ejs-test', (req, res) => {
    res.render('test', { name: 'slim' });
});

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});