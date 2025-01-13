
# Event Management App

Bienvenue dans l'application **Event Management App**, une plateforme développée en **Angular** avec l'intégration de **Tailwind CSS** pour gérer des événements et leurs artistes associés.

## Pourquoi Angular et Tailwind CSS ?

### Angular
J'ai choisi Angular pour sa robustesse et son écosystème complet. Il offre :
- Un système de composants modulaires.
- Une gestion facile des données avec ses services et son système de communication.
- Une large communauté pour résoudre des problèmes rapidement.

### Tailwind CSS
Tailwind CSS a été préféré à un fichier CSS standard car :
- Il permet de créer des interfaces rapidement grâce à ses classes utilitaires.
- Il évite de devoir écrire beaucoup de styles personnalisés.
- Il est très flexible et facilite le respect des principes de conception responsive.

## Fonctionnalités de l'application
- Affichage d'une liste d'événements et d'artistes.
- Ajout, modification et suppression d'événements.
- Liaison des artistes à des événements.
- Modal pour ajouter des événements directement dans l'application.

## Structure du projet

Voici la structure principale du projet Angular :

```
src/
├── app/
│   ├── artists-detail/          # Détails d'un artiste
│   ├── artists-list-component/  # Liste des artistes
│   ├── event-detail/            # Détails d'un événement
│   ├── events/                  # Gestion des événements
│   ├── home-page/               # Page d'accueil
│   ├── models/                  # Modèles de données (Event, Artist)
│   ├── pagination/              # Composant de pagination
│   ├── services/                # Services pour l'API (événements, artistes)
│   ├── app.component.*          # Composant principal
│   ├── app.routes.ts            # Configuration des routes
│   └── http-error.interceptor.ts # Gestion des erreurs HTTP
├── assets/                      # Fichiers statiques
├── styles.css                   # Styles globaux (avec Tailwind)
└── index.html                   # Fichier principal HTML
```

## Pré-requis

- **Node.js** : version 18 ou supérieure
- **Docker** (si vous voulez lancer avec Docker)
- Un serveur backend Spring Boot fonctionnant sur le port **8080**.

## Lancer le projet

### Avec Docker

1. Assurez-vous que Docker et Docker Compose sont installés.
2. Clonez le projet depuis le dépôt Git :
   ```bash
   git clone https://github.com/codeNetSolution/FullStackTP2.git
   ```
3. Placez-vous à la racine du projet.
   ```bash
   cd FullStackTP2
   ```
4. Lancez les conteneurs avec la commande :
   ```bash
   docker-compose up --build
   ```
5. Une fois que les conteneurs sont en cours d'exécution :
   - Accédez à l'application Angular : `http://localhost:4200`
   - Le backend est disponible sur : `http://localhost:9090`

### Sans Docker

1. Clonez le projet depuis le dépôt Git :
   ```bash
   git clone https://github.com/codeNetSolution/FullStackTP2.git
   ```
2. Installez les dépendances Node.js :
   ```bash
   cd FullStackTP2/Frontend/EventManagementApp
   npm install
   ```
3. Lancez le serveur Angular :
   ```bash
   npm start
   ```
4. Ouvrez votre navigateur et accédez à : `http://localhost:4200`

Assurez-vous que le backend Spring Boot est lancé sur le port `8080` avant de démarrer Angular.

## Exécuter une collection Postman

Pour remplir les données de l'application avec des données d'exemple, utilisez une **collection Postman**. Suivez ces étapes :

1. Importez la collection Postman fournie dans ce projet.
```bash
   ./FullStackTP2/Collection TP2 FullStack.postman_collection
   ```
2. Exécutez les requêtes pour ajouter des événements et des artistes.
3. Rechargez la page pour voir les données.

## Points forts du projet

- Utilisation d'Angular pour une application dynamique et modulaire.
- Tailwind CSS pour une mise en page rapide et responsive.
- Docker pour simplifier le déploiement et la configuration des dépendances.
- Gestion des données via une API backend.
