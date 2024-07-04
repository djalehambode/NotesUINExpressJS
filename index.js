const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

// Création de l'application Express
const app = express();

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Configuration du middleware Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de Sequelize
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'h',
  password: '',
  database: 'dbNotesUINExpressJS'
});

// Import des modèles
const Etudiant = require('./models/etudiant')(sequelize, DataTypes);
const Note = require('./models/note')(sequelize, DataTypes);

// Synchronisation des modèles avec la base de données
sequelize.sync()
  .then(() => {
    console.log('Base de données synchronisée');
  })
  .catch(err => {
    console.error('Erreur de synchronisation de la base de données :', err);
  });

// Routes
app.get('/', (req, res) => {
  res.render('accueil');
});

app.get('/etudiants', async (req, res) => {
  try {
    const etudiants = await Etudiant.findAll();
    res.render('liste', { etudiants });
  } catch (err) {
    console.error('Erreur lors de la récupération des étudiants :', err);
    res.status(500).send('Erreur serveur');
  }
});

app.get('/note_etudiant/:etudiantId', async (req, res) => {
  const etudiantId = req.params.etudiantId;
  res.render('note', { etudiantId });
});

app.post('/note', async (req, res) => {
  const { etudiantId, note } = req.body;
  try {
    const newNote = await Note.create({ EtudiantId: etudiantId, note: note });
    res.redirect('/');
  } catch (err) {
    console.error('Erreur lors de l\'insertion de la note :', err);
    res.status(500).send('Erreur serveur');
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Serveur démarré sur le port ${PORT}');
});