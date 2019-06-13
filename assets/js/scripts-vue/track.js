'use strict';

class Track {
    name; //Le nom du titre
    mbid; //L'identifiant du titre
    url; //La page last.fm liée au titre
    playcount; //Le nombre d'écoutes
    duration; //La durée du titre
    album;  // L'album sur lequel apparait le titre (objet de type Album)
    artist; // Auteur du titre (objet de type Artist)
    tags; // Les tags les plus souvent associés au titre
    wiki; // Une explication du titre
    short_wiki; // Un résumé de l'explication du titre


    constructor(trackJSON) {
        if(typeof trackJSON !== "undefined"){
            if(typeof trackJSON.name !== "undefined"){
                this.name = trackJSON.name;
            }
            if(typeof trackJSON.mbid !== "undefined"){
                this.mbid = trackJSON.mbid;
            }
            if(typeof trackJSON.url !== "undefined"){
                this.url = trackJSON.url;
            }
            if(typeof trackJSON.wiki !== "undefined"){
                this.short_wiki = trackJSON.wiki.summary;
                this.wiki = trackJSON.wiki.content;
            }
            if(typeof trackJSON.playcount !== "undefined"){
                this.playcount = trackJSON.playcount;
            }
            if(typeof trackJSON.duration !== "undefined"){
                this.duration = trackJSON.duration;
            }
            if(typeof trackJSON.artist !== "undefined"){
                this.artist = new Artist(trackJSON.artist);
            }
            if(typeof trackJSON.album !== "undefined"){
                this.album = trackJSON.album;
            }
            if(typeof trackJSON.tags !== "undefined"){
                this.tags = [];
                trackJSON.toptags.tag.forEach((aTag)=>{
                    this.tags.push(aTag.name);
                });
            }
        }
        else {
            console.error("Le JSON passé en paramètre est vide ou invalide (le morceau n'est pas disponible en BDD.");
        }
    }
}