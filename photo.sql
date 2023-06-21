\c postgres;
DROP DATABASE IF EXISTS photo;
CREATE DATABASE photo;

\c photo;

CREATE TABLE photographes (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL
);

CREATE TABLE orientations (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(50) NOT NULL
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  orientation INTEGER NOT NULL REFERENCES orientations(id),
  fichier VARCHAR(100) NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  id_photographe INTEGER NOT NULL REFERENCES photographes(id),
  comments VARCHAR(50) NOT NULL DEFAULT 'aucune description'
);

CREATE TABLE commentaires (
  id SERIAL PRIMARY KEY,
  texte VARCHAR(200) NOT NULL,
  id_photo INTEGER NOT NULL REFERENCES photos(id)
);

INSERT INTO photographes (nom, prenom) VALUES ('Duchamp', 'Marcel');
INSERT INTO photographes (nom, prenom) VALUES ('Von Gloeden', 'Elisa');
INSERT INTO photographes (nom, prenom) VALUES ('Mapplethorpe', 'Gil');
INSERT INTO photographes (nom, prenom) VALUES ('Renoir', 'Pierre-Auguste');

SELECT * FROM photographes;

INSERT INTO orientations (nom) VALUES ('portrait');
INSERT INTO orientations (nom) VALUES ('paysage');

SELECT * FROM orientations;

INSERT INTO photos (nom, date, orientation, fichier, id_photographe, comments) VALUES ('Portrait bleu', '2000-01-01', 1, 'image1.jpg', 1, 'Voila');
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Marcheur', '2000-01-01', 1, 'image2.jpg', 1);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Sol Rouge', '2000-01-01', 2, 'image3.jpg', 2);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Bulles chaudes', '2010-01-01', 1, 'image4.jpg', 2);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Nature morte', '1985-01-01', 2, 'image5.jpg', 3);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Grotte vivante', '2000-01-01', 2, 'image6.jpg', 4);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Travail Soir', '2000-01-01', 1, 'image7.jpg', 4);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Citron salade', '2000-01-01', 1, 'image8.jpg', 1);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Floue artistique', '2000-01-01', 1, 'image9.jpg', 2);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Auto', '2000-01-01', 2, 'image10.jpg', 1);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Feuilles violettes', '2000-01-01', 1, 'image11.jpg', 1);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Ville Nuit', '2000-01-01', 1, 'image12.jpg', 1);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Baignade', '1999-01-01', 2, 'image13.jpg', 3);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Caverne Espoir', '2000-01-01', 1, 'image14.jpg', 4);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Cerveau Cardiaque', '2000-01-01', 2, 'image15.jpg', 2);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Rayons Luminieux', '2000-01-01', 2, 'image16.jpg', 3);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Lunette Triangle', '2000-01-01', 1, 'image17.jpg', 1);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Route Nuit', '2000-01-01', 1, 'image18.jpg', 1);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Sapin Hall', '2000-01-01', 1, 'image19.jpg', 2);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Vacances Ski', '2000-01-01', 1, 'image20.jpg', 1);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Ocean Matin', '2000-01-01', 1, 'image21.jpg', 4);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Escalator Panne', '1986-03-01', 1, 'image22.jpg', 3);
INSERT INTO photos (nom, date, orientation, fichier, id_photographe) VALUES ('Voiture Jaune', '2010-01-01', 2, 'image23.jpg', 1);

SELECT * FROM photos;

