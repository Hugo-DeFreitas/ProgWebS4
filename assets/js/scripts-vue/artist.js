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
     * Renvoit un artiste sous forme de boutton (utile pour les top Artists).
     * @param, le rang de l'artiste dans le top50 des artistes les plus écoutés en France.
     * @returns {jQuery|HTMLElement}
     */
    toButton(rank) {
        let newButton = $('<button type="button" ' +
            'class="btn btn-primary top-artist-btn" id="btn-artist-mbid-'+this.mbid+'">');
        newButton.html(rank+"°) "+this.name);

        Artist.getStyleInFunctionOfRank(newButton,rank);

        let self = this;

        if(typeof this.mbid === 'undefined' || this.mbid === "" ){
            newButton.attr({
                'data-toggle' : "tooltip",
                'data-placement' : "top",
                'title' : "Impossible de récupérer des infos supplémentaires sur cet artiste."
            });
        }
        else {
            newButton.attr({
                'data-toggle' : "tooltip",
                'data-placement' : "top",
                'title' : "Il sera possible de récupérer des infos supplémentaires sur cet artiste. Cliquer pour le faire 🙃"
            });
            newButton.click(function () {
                newButton.find('.more-infos-asked').remove();
                //Jusqu'alors on ne disposait que du nom et du mbid de l'artise. Désormais on a absolument tout le concernant :)
                Artist.get_from_MBID(self.mbid).then((completeTopArtist) =>{
                    newButton.addClass('btn-block');
                    newButton.append(
                        '<div class="more-infos-asked">'+
                        '<small class="justify-content-center">'+
                        '<strong>Nombre d\'auditeurs réguliers : </strong>'+completeTopArtist.listeners+'<br/>'+
                        '<strong>Nombre d\'écoutes ce mois-ci : </strong>'+completeTopArtist.playcount+'<br/>'+
                        '<strong>En tournée actuellement : </strong>'+(completeTopArtist.is_on_tour ? "👍" : "👎") +
                        '</small>' +
                        '</div>');
                })
            });
        }
        //Initialisation des tooltips
        newButton.tooltip();

        return newButton;
    }

    /**
     * Définit un style sur un boutton de topArtist en fonction de son rang.
     * @param button,rank, un élément de type Artist.toButton() / le rang de l'artiste dans les charts.
     */
    static getStyleInFunctionOfRank(button,rank) {
        //Couleurs
        let firstRankColor  = "#bfaa1b";
        let secondRankColor = "#4E4E58";
        let thirdRankColor  = "#8E5157";
        let mediumRankColor = "#2274A5";
        let lowRankColor    = "#C1EEFF";
        //Algo
        let styleDipendingOnPos = {};
        styleDipendingOnPos['margin'] = "10px";
        switch (true) {
            case rank === 1: //Premier au classement
                button.addClass('btn-xl');
                styleDipendingOnPos['background'] = firstRankColor;
                styleDipendingOnPos['border-color'] = firstRankColor;
                break;
            case rank === 2: //Second au classement
                button.addClass('btn-lg');
                styleDipendingOnPos['background'] = secondRankColor;
                styleDipendingOnPos['border-color'] = secondRankColor;
                break;
            case rank === 3: //Troisième au classement
                button.addClass('btn-sm');
                styleDipendingOnPos['background'] = thirdRankColor;
                styleDipendingOnPos['border-color'] = thirdRankColor;
                break;
            case rank > 3 && rank < 31: // Du quatrième au 30ème
                button.addClass('btn-xs');
                styleDipendingOnPos['background'] = mediumRankColor;
                styleDipendingOnPos['border-color'] = mediumRankColor;
                break;
            case rank > 30: // 31ème au 50ème
                button.addClass('btn-xs');
                styleDipendingOnPos['background'] = lowRankColor;
                styleDipendingOnPos['border-color'] = lowRankColor;
                styleDipendingOnPos['color'] = "black";
                break;
            default:
                break;
        }
        button.css(styleDipendingOnPos);
        return button;
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

    /**
     * Affiche des bouttons à propos des topArtists.
     */
    static getTopArtists() {
        let topArtistZone = $("#top-artist-zone");
        let modalTopArtistBody = topArtistZone.find(".zone-to-clear");
        modalTopArtistBody.empty();
        //On clear la zone pour éviter la duplication si l'utilisateur fait des "va-et-vient" vers ce menu.
        Artist.get_top_artists().then((allTopArtists) => {
            let highRankedArtistRow = $('<div class="text-center" />');
            let lowRankedArtistRow = $('<div id="other-top-artist-row" class="text-center" />');
            lowRankedArtistRow.append('<h2>' +
                '🏅&nbsp;Les autres' +
                '</h2>');
            for (let i = 0; i < allTopArtists.length; i++){
                /** @var {Artist} currentTopArtist*/
                let currentTopArtist = allTopArtists[i];
                let topArtistBtn = currentTopArtist.toButton(i+1);
                switch (i+1) {
                    case 1:
                        highRankedArtistRow.append('<h2>' +
                            '🥇&nbsp;Première place' +
                            '</h2>');
                        highRankedArtistRow.append(topArtistBtn);
                        modalTopArtistBody.append(highRankedArtistRow);
                        break;
                    case 2:
                        highRankedArtistRow.append('<h2>' +
                            '🥈&nbsp;Deuxième place' +
                            '</h2>');
                        highRankedArtistRow.append(topArtistBtn);
                        modalTopArtistBody.append(highRankedArtistRow);
                        break;
                    case 3:
                        highRankedArtistRow.append('<h2>' +
                            '🥉&nbsp;Troisième place' +
                            '</h2>');
                        highRankedArtistRow.append(topArtistBtn);
                        modalTopArtistBody.append(highRankedArtistRow);
                        break;
                    default:
                        lowRankedArtistRow.append(topArtistBtn);
                        break;
                }
            }
            modalTopArtistBody.append(lowRankedArtistRow)
        });
    }

}