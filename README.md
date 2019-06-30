# Projet Apollon
Repository du projet de programmation Web (Javascript et Jquery) du S4 à l'IUT INFO.

# [Site de l'enseignant responsable, Olivier Pons.](https://www.olivierpons.fr)
# [Accéder au site *Apollon*.](http://hugo-dft.alwaysdata.net/apollon/)

Le sujet étant libre, j'ai décidé de créé un site de création de playlists (du style *Spotify*, *Deezer* ou encore *Napster*), de type *Single Page Application* : on ne recharge jamais la page du site pour accéder à toutes ses fonctionnalités.

## Développement et fonctionnalités
Voici une liste non-exhaustive de ce qui a été réalisée dans le cadre de ce projet :
+ De **nombreux appels Ajax**.
  + Connexion, Inscription, Déconnexion.
  + Possibilité de créer des playlists publiques et privées.
  + Chercher parmis une infinité de titres musicaux via une barre de recherche, et les ajouter à ses playlists.
  + Consulter ses playlists, ainsi que les playlists des autres utilisateurs qui les ont rendu publiques.
  + Consulter le classements des artistes du moment.
  
+ Une **séparation et écriture par fichiers de classe**.
+ Du code en *ES6*.

## Choix techniques
+ Environnement de serveur : PHP 7.2 + Framework *CodeIgniter 3*.
+ Base de données : MySQL 8.0.
+ Interfaçage avec l'API OpenSource *LastFM*, mais aussi l'API *MusicBrainz*. 
  
  **Exemple d'interfaçage** : l'utilisateur de *Apollon*, rentre un nom d'artiste dans la barre de recherche. Le nom partiel est envoyé au serveur via *Ajax*. 
  
  La partie serveur d'*Apollon* va tout d'abord récupérer le *mbid* (un identifiant unique attribué à tous les artistes musicaux) de l'artiste correspondant à la meilleure correspondance via l'API *LastFM*.
  
  Avec la réponse donnée par cette entité, le serveur traite la réponse, et consulte l'API *MusicBrainz* pour récupérer des informations sur l'artiste en question. Le serveur effectue une somme et un ordonnancement des informations récupérées via les deux API et renvoit la réponse à l'appel l'*Ajax*.
