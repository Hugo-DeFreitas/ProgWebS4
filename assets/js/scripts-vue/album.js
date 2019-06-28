'use strict';

/**
 * Classe Album.
 */
class Album {
    name; //Le nom de l'album
    mbid; //L'identifiant du titre
    url; //La page last.fm liée au titre
    artist; // Auteur de l'album (objet de type Artist)
    image; //Image de l'album du titre.


    constructor(albumJSON) {
        if(typeof albumJSON === "object"){
            if(typeof albumJSON.name !== "undefined"){
                this.name = albumJSON.name;
            }
            if(typeof albumJSON.mbid !== "undefined"){
                this.mbid = albumJSON.mbid;
            }
            if(typeof albumJSON.url !== "undefined"){
                this.url = albumJSON.url;
            }
            if(typeof albumJSON.artist !== "undefined"){
                this.artist = new Artist(albumJSON.artist);
            }
            if(typeof albumJSON.image[2]["#text"] !== "undefined"){
                this.image = albumJSON.image[2]["#text"];
            }
        }
        else if(typeof albumJSON === "undefined") {
            console.error("Le JSON passé en paramètre est vide ou invalide (l'album n'est pas disponible en BDD.");
        }
        else {
            this.name = albumJSON.name;
        }
    }
}