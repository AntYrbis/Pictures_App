const { Client } = require('pg');
const fs = require("fs");
const http = require("http");
const host = 'localhost';
const port = 80;
const server = http.createServer();

// Client pour la base de données
const client = new Client({
    user: 'postgres',
    password: 'pokemon25',
    database: 'photo',
    port : 8080
});

//Connection à la base de données
client.connect()
.then(() => {
    console.log('Connected to database');
})
.catch((e) => {
    console.log('Error connecting to database');
    console.log(e);
});

server.on("request", async (req, res) => {
    if (req.method === "GET"){
        const newUrl = req.url.slice(7);
        if (req.url.startsWith('/public/')) {
            try {
                const ressource = fs.readFileSync("." + req.url);
                res.end(ressource);
            } catch (error) {
                let html = '<html><body><h1>404 Error</h1>';
                html += '<p>Page not found</p>';
                html += '<a href="/">Retour à l\'accueil</a>';
                html += '</body><footer class="footer">site réalisé en mai 2023</footer></html>';
                res.statusCode = 404;
                res.end(html);
            } 
        } else if (req.url === '/mur-images') {
            try {
                const sqlQuery = 'SELECT p.fichier, p.likes, p.id, o.nom FROM photos p JOIN orientations o ON p.orientation = o.id WHERE o.nom = \'portrait\' ORDER BY p.id'; //Requête SQL
                const sqlResult = await client.query(sqlQuery); //Exécution de la requête
                console.log(sqlResult.rows);
    
                //Grâce à la fonction map, on récupère un tableau contenant les valeurs de la colonne fichier
                const fichiersImage = sqlResult.rows.map(row => row.fichier);
                const likesImage = sqlResult.rows.map(row => row.likes);
                const idImage = sqlResult.rows.map(row => row.id);
                console.log(fichiersImage);
                console.log(likesImage);
                console.log(idImage);
        
                let pageHTML = `<!DOCTYPE html><html lang="fr">
                <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Images</title>
                <link rel="stylesheet" href="../public/style.css">
                <script src="https://kit.fontawesome.com/db5f104521.js" crossorigin="anonymous"></script>
                </head>
                <body>
                <header>
                <div class=" btn_left_container ">
                <a href="index" class="btn_left"> Index </a>
                </div>
                <a href="../public/image-description.html" class="btn"> Comment </a>
                <p class="under_index_text_container">Le Mur d'Images</p>
                </header>
                <main>
                <div class="imgs_container"> `;
                for (let i = 0 ; i < fichiersImage.length ; i++) {
                    const fichierSmallImage = fichiersImage[i].split('.')[0] + '_small.jpg';
                    const img = '<img src="/public/'+fichierSmallImage+'" />';
                    pageHTML += '<a href="/image/'+(i+1)+'" >' + img + '</a> ';
                    pageHTML += `<div class="img_cell"> 
                    <div class="like_container">
                    <a href="../j-aime/${idImage[i]}"><i class="fa-regular fa-thumbs-up"></i></a>
                    <span class="like_count">${likesImage[i]}</span>
                    </div>
                    </div>`;
                }
                pageHTML += `
                </div></main></body></html>`;
                res.end(pageHTML);
            } catch (e) {
                console.log(e);
                //Si la requête échoue, on renvoie un message d'erreur
                res.end(e);
            }
        } else if (req.url.startsWith('/image/')) { 
            try {
                const sqlQuery = 'SELECT p.fichier, p.nom AS photo_nom, p.comments , o.nom, ph.nom, ph.prenom FROM photos p JOIN orientations o ON p.orientation = o.id JOIN photographes ph ON p.id_photographe = ph.id WHERE o.nom = \'portrait\'ORDER BY p.id'; //Requête SQL
                const sqlResult = await client.query(sqlQuery);  
                console.log(sqlResult.rows);

                //On récupère les valeurs du tableau photos 
                const fichiersImage = sqlResult.rows.map(row => row.fichier);
                const nomsImage = sqlResult.rows.map(row => row.photo_nom);
                const commentsImage = sqlResult.rows.map(row => row.comments);
                console.log(fichiersImage);
                console.log(nomsImage);
                console.log(commentsImage);
                //On récupère les valeurs du tableau photographes
                const nomsPhotographe = sqlResult.rows.map(row => row.nom);
                const prenomsPhotographe = sqlResult.rows.map(row => row.prenom);
                console.log(nomsPhotographe);
                console.log(prenomsPhotographe);
    
                const imgNumber = req.url.split('/')[2] -1;
                console.log(imgNumber);
    
                let pageHTML = `
                <!DOCTYPE html>
                <html lang="fr">
                <html>
                <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Images</title>
                <link rel="stylesheet" href="../public/style.css">
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.3/css/all.css" integrity="sha384-LvfG9z7+uIg6fZ/hQzNj5+5vbVw8ynP+kBAdV+aY/1zI6G8x6W5U2ywBf5F5ztI7" crossorigin="anonymous">
                </head>
                <body>
                <header>
                <div class=" btn_left_container ">
                <a href="../mur-images" class="btn_left"> Mur </a>
                </div>
                </header>
                <main>
                <div class="img_container">
                <div class="img_cell_unique"> `; 
                pageHTML += '<img class="img" src="/public/'+fichiersImage[imgNumber]+'" width="400" />';
                pageHTML += `</div>
                <div class="text_img">`; 
                pageHTML += '<h1>'+nomsImage[imgNumber]+'</h1>';
                pageHTML += '<p> De '+nomsPhotographe[imgNumber]+' '+prenomsPhotographe[imgNumber]+' </p>';
                if( commentsImage[imgNumber] != null ){
                    pageHTML += `<p > ${commentsImage[imgNumber].toString ()} </p> `;
                } else{
                    pageHTML += `<p > Pas de description. </p> `; 
                }
                pageHTML += `
                </div>
                </div>
                </main>
                <footer class="footer">site réalisé en mai 2023</footer>
                </body>
                </html> `; 
                res.end(pageHTML);
            } catch (e){
                console.log(e);
                res.end(e);
            }
        } else if ( req.url.startsWith ("/j-aime/")){
            const imageId = (req.url.slice(8));
            console.log(imageId)
            try {
                const sqlQuery = `UPDATE photos SET likes = likes + 1 WHERE id = $1`;
                const values = [imageId];
                const sqlResult = await client.query(sqlQuery, values);
            } catch (e){
                console.log(e);
                res.end(e);
            }
            res.writeHead(302, { Location: '/mur-images' });
            res.end();
        }else {
            const index = fs.readFileSync("./public/index.html", "utf-8");
            res.end(index);
        }
    } else if (req.method === "POST" ){
        if ( req.url === "/image-description") {
            let donnees ;;
            req.on("data", ( dataChunk ) => {
                donnees += dataChunk.toString() ;
            });
            req.on("end", async () => {
                const paramValeur = donnees . split ("&") ;
                const imageID = paramValeur [0]. split ("=") [1];
                const text = paramValeur [1]. split ("=") [1];
                const description =  decodeURIComponent(text.replace(/\+/g, ' '));
                console.log("nombre:",imageID,"texte:",description.toString ());

                try {
                    const sqlQuery = `UPDATE photos SET comments = $1 WHERE id = $2`;
                    const values = [decodeURIComponent(description.replace(/\+/g, ' ')), imageID];
                    const sqlResult = await client.query(sqlQuery, values);

                    let pageHTML = `
                    <!DOCTYPE html>
                    <html lang="fr">
                    <html>
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
                    res.end( pageHTML );
                  } catch (e) {
                    console.log(e);
                    res.end(e);
                  }
            })
        } 
    }
});


server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});