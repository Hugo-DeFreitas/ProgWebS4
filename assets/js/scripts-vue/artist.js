'use strict';

class Artist {
    name;               //Nom de l'artiste
    mbid;               //Son identifiant unique
    is_on_tour;         //Booléen qui indique si il est en tournée
    short_bio;          //Biographie courte.
    bio;                //Biographie complète.
    similar_artists;    //Tableau qui comprend des artistes similaires.
    listeners;          // Auditeurs réguliers
    playcount;          // Nombres d'écoutes mensuelles des titres de l'artiste.
    tags;               // Genres musicaux associés à l'artiste.


    constructor(artistJSON) {
        if(typeof artistJSON === "object"){
            if(typeof artistJSON.name !== "undefined"){
                this.name = artistJSON.name;
            }
            if(typeof artistJSON.mbid !== "undefined"){
                this.mbid = artistJSON.mbid;
            }
            if(typeof artistJSON.ontour !== "undefined"){
                this.is_on_tour = (artistJSON.ontour === "1");
            }
            if(typeof artistJSON.bio !== "undefined"){
                this.short_bio = artistJSON.bio.summary;
                this.bio = artistJSON.bio.content;
            }
            if(typeof artistJSON.similar !== "undefined"){
                this.similar_artists = [];
                artistJSON.similar.artist.forEach((artistInfo)=>{
                    this.similar_artists.push(new Artist(artistInfo));
                });
            }
            if(typeof artistJSON.stats !== "undefined"){
                this.listeners = artistJSON.stats.listeners;
                this.playcount = artistJSON.stats.playcount;
            }
            if(typeof artistJSON.tags !== "undefined"){
                this.tags = [];
                artistJSON.tags.tag.forEach((aTag)=>{
                    this.tags.push(aTag.name);
                });
            }
        }
        else if(typeof artistJSON === "undefined"){
            console.error("Le JSON passé en paramètre est vide.");
        }
        else {
            //Vraisemblablement, si ce n'est pas un JSON, et que la valeur est non-nulle, alors c'est le nom de l'artiste qu'on passe
            // en paramètre du constructeur.
            this.name = artistJSON;

        }
    }

    /**
     * Renvoit un artiste sous forme de boutton (utile pour les top Artists.
     * @returns {jQuery|HTMLElement}
     */
    toButton() {
        let newButton = $('<button type="button" ' +
            'class="btn btn-primary top-artist-btn" id="btn-artist-mbid-'+this.mbid+'">');
        newButton.html(this.name);
        //Initialisation des tooltips
        newButton.tooltip();
        return newButton;
    }

    /**
     * Permet d'obtenir un artiste depuis son MBID.
     * @param mbid
     * @returns {Promise<Artist>}
     */
    static get_from_MBID(mbid){
        return new Promise(((resolve, reject) => {
            $.ajax({
                url : 'Artist/get_artist_info/'+mbid,
                method:'POST',
                dataType : 'json'
            }).done((artistInfos) => {
                let test = new Artist(artistInfos.artist);
                resolve(test);
            }).fail(() => {
                reject(false);
            });
        }));
    }


    /**
     * Retourne tous les top Artistes dans un tableau.
     * @returns {Promise<[Artist]>}
     */
    static get_top_artists(){
        return new Promise((resolve, reject) => {
            let allTopArtists = [];
            $.ajax({
                url : 'Artist/get_top_artists/',
                dataType : 'json'
            }).done((artists) => {
                artists.artists.artist.forEach(function (artistData) {
                     allTopArtists.push(new Artist(artistData));
                });
                resolve(allTopArtists);
            }).fail((result) => {
                console.log('Une erreur est survenue dans la récupération des TopArtists du moment.');
                reject(result);
            });
        });
    }

}