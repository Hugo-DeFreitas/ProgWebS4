'use strict';

class Track {
    id; //
    name; //Le nom du titre
    mbid; //L'identifiant du titre
    url; //La page last.fm liée au titre
    playcount; //Le nombre d'écoutes totales du titre
    listeners; //Le nombre d'auditeurs réguliers du titre
    duration; //La durée du titre
    album;  // L'album sur lequel apparait le titre (objet de type Album)
    artist; // Auteur du titre (objet de type Artist)
    tags; // Les tags les plus souvent associés au titre
    wiki; // Une explication du titre
    short_wiki; // Un résumé de l'explication du titre

    constructor(trackJSON) {
        if(typeof trackJSON === "object"){
            if(typeof trackJSON.name !== "undefined"){
                this.name = trackJSON.name;
            }
            if(typeof trackJSON.id !== "undefined"){
                this.id = trackJSON.id;
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
            if(typeof trackJSON.listeners !== "undefined"){
                this.playcount = trackJSON.listeners;
            }
            if(typeof trackJSON.duration !== "undefined"){
                this.duration = trackJSON.duration;
            }
            if(typeof trackJSON.artist !== "undefined"){
                this.artist = new Artist(trackJSON.artist);
            }
            if(typeof trackJSON.album !== "undefined"){
                this.album = new Album(trackJSON.album);
            }
            if(typeof trackJSON.tags !== "undefined"){
                this.tags = [];
                trackJSON.toptags.tag.forEach((aTag)=>{
                    this.tags.push(aTag.name);
                });
            }
        }
        else if(typeof trackJSON === "undefined"){
            console.error("Le JSON passé en paramètre est vide ou invalide (le morceau n'est pas disponible en BDD.");
        }
        else{
            this.name = trackJSON.name;
        }
    }

    addToPlaylist(playlistID){
        let self =this;
        console.log("Ajout de '"+this.name+"' à la playlist n°"+playlistID);
        return new Promise((resolve)=>{
            $.ajax( {
                url : "Playlist/add_track/"+playlistID+'/',
                data : self,
                method : 'POST'
            })
                .done(function(result) {
                    resolve(result.success); //Le serveur peut renvoyer uniquement vrai ou faux.
                })
                .fail(function(){
                    resolve(false);
                });
        });
    }

    /**
     *
     * @param {Playlist[]}allPlaylistsFromUser
     * @returns {jQuery|HTMLElement}
     */
    toSearchResult(allPlaylistsFromUser){
        let self = this;
        //Container principal
        let newTrackResult = $("<a/>");
        newTrackResult.attr({
            class : "list-group-item list-group-item-action flex-column align-items-start"
        });
        newTrackResult.tooltip({
            title: 'Cliquer sur l\'image du titre pour l\'ajouter dans une playlist',
        });
        //Container secondaire
        let newTrackResultInnerContainer = $("<div>");
        newTrackResultInnerContainer.addClass("d-flex");

        /*
        Première colonne, qui contient :
         - l'image de l'album du titre (On met une image par défaut en attendant de la remplacer par la vrai image, si elle est disponible).
         */
        let newTrackResultColNo1 =   $('<div class="col-3 div-for-track-img">');

        //Image de l'album concerné.
        let trackImage = $("<img class='d-block'/>");
        trackImage.attr({
            id : 'img-for-track-mbid-' + this.mbid,
            class: 'float-left rounded',
            src : "assets/images/album-img-not-found.png", //Pour l'instant c'est une image standard.
            mbid : this.mbid,
            'data-toggle' : "popover",
            'data-placement' : "bottom",
            'title': 'Ajouter le titre à une playlist'
        });

        trackImage.popover({
            html:true,
            content : function () {
                let divTemp = $('<div/>');
                divTemp.append('<p><i class="fa fa-info-circle"></i> <em>Cliquer sur une playlist pour l\'ajouter.</em></p>');
                console.log(typeof allPlaylistsFromUser);
                if(typeof allPlaylistsFromUser === "object"){
                    allPlaylistsFromUser.forEach((playlistFromUser) => {
                        let newLinkToAddTrackToPlaylist = $('<a style="margin: 10px" data-playlist="'+playlistFromUser.id+'" ' +
                            'id="btn-add-to-playlist-'+playlistFromUser.id+'" '+
                            'class="add-track-to-playlist-trigger btn text-white btn-primary"/>');
                        newLinkToAddTrackToPlaylist.html(playlistFromUser.name);

                        divTemp.append(newLinkToAddTrackToPlaylist);
                    });
                    return divTemp.html();
                }
                else {
                    return '<em>Créez une playlist pour pouvoir ajouter des titres.</em>';
                }
            }()
        });

        trackImage.on('shown.bs.popover', function () {
            $('.add-track-to-playlist-trigger').click(function(){
                let savedContext = $(this);
                let playlistID = savedContext.attr('id').substr(savedContext.attr('id').lastIndexOf('-')+1);
                self.addToPlaylist(playlistID).then((success)=>{
                    if(success){
                        let successNotification =  $('#modal-track-added-to-playlist').modal('show');
                        successNotification.find('.card-body').html(
                            '<h2 class="text-center">Le titre '+self.name+' a bien été ajouté à la playlist d\'ID n°'+playlistID+'.</h2>'
                        );
                    }
                    else {
                        let errorNotification =  $('#modal-track-added-to-playlist').modal('show');
                        errorNotification.find('.card-body').html(
                            '<h2 class="text-center text-danger">Le titre '+self.name+' a bien été ajouté à la playlist d\'ID n°'+playlistID+'.</h2>'
                        );                    }
                });
                savedContext.closest('.popover').popover('hide');
            });
        });

        //On emboite l'élément dans le container
        newTrackResultColNo1.append(trackImage);

        /*
        Deuxième colonne, qui contient :
         - Le nom du titre + Le nom de l'artiste qui a fait le morceau
         - (Optionnel) une description du morceau, si on a réussi à la récupérer côté serveur.
         */
        let newTrackResultColNo2 =   $('<div class="col-8 text-justify">');

        //Nom de l'artiste
        let trackNameAndArtist = $('<h5 class="mb-2 track-and-artist-name"/>');
        trackNameAndArtist.html('<em>'+this.name+'</em> - '+ this.artist.name);

        //Description du morceau
        let trackDescription = $('<p class="mb-5 track-description">');

        //On emboite les deux éléments dans le container
        newTrackResultColNo2.append(trackNameAndArtist);
        newTrackResultColNo2.append(trackDescription);

        /* Dernier élément, qui contient le nombre d'écoutes du titre au mois courant */
        let newTrackResultColNo3 =   $('<div class="col-1">');
        let numberOfMonthlyListeners = $("<small/>");
        numberOfMonthlyListeners.html("Écoutes mensuelles: <strong>"+this.playcount+"</strong>");
        newTrackResultColNo3.append(numberOfMonthlyListeners);

        //On emboite les 2 colonnes et le nombre d'écoutes dans le innerContainer
        newTrackResultInnerContainer.append(newTrackResultColNo1);
        newTrackResultInnerContainer.append(newTrackResultColNo2);
        newTrackResultInnerContainer.append(newTrackResultColNo3);

        //On ajoute le résultat enfin construit à la liste des résultats
        newTrackResult.append(newTrackResultInnerContainer);

        //Traitement supplémentaire, pour récupérer plus d'infos sur le titre, mais aussi et surtout l'image de l'album.
        new Promise(function (resolve, reject) {
            //Si un titre a un mbid, cela signifie qu'on peut éventuellement aller chercher des infos supplémentaires sur celui-ci.
            if(typeof self.mbid !== "undefined"){
                $.ajax( {
                    url : "Track/get_info/"+self.mbid,
                    method : 'POST',
                })
                    .done(function(trackInfos) {
                        if(trackInfos){
                            let newTrackInfos = new Track(trackInfos.track);
                            resolve(newTrackInfos);
                        }
                        else {
                            resolve(false);
                        }
                    })
                    .fail(function(){
                        resolve(false);
                    });
            }
        }).then((trackInfos) => {
            //Si on reçoit faux de la part de la promesse, on ne fait rien.
            /** @var {Track} trackInfos */
            if (trackInfos){
                trackImage.attr({
                    src : trackInfos.album.image
                });
                if(typeof trackInfos.wiki !== "undefined"){
                    trackDescription.html(trackInfos.short_wiki);
                }
            }
        });

        return newTrackResult;
    }

    /**
     * Renvoit via Promise, les résultats d'une recherche sur un titre musical.
     * @param trackName
     * @returns {Promise<any>}
     */
    static searchForTracks(trackName) {
        let  resultsDiv = $("#results-search-for-tracks");
        resultsDiv.empty();
        return new Promise(function (resolve, reject) {
            $.ajax( {
                url : "Track/search_track/"+trackName,
                method : 'POST',
            })
                .done(function(tracks) {
                    if(tracks){
                        let trackObjectsArray = [];
                        tracks.results.trackmatches.track.forEach((trackJSON)=>{
                            trackObjectsArray.push(new Track(trackJSON));
                        });
                        resolve(trackObjectsArray);
                    }
                    else {
                        resolve(false);
                    }
                })
                .fail(function(){
                    resolve(false);
                    resultsDiv.empty();
                });
        });
    }
}