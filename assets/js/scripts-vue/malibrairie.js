/**
 * ===============
 * Fonctions liées à la gestion des utilisateurs.
 * ===============
 */

/**
 * Permet de savoir si l'utilisateur est connecté ou non.
 */
function isConnected(){
    return new Promise(function (resolve, reject) {
        $.ajax( {
            url : "User/is_connected/",
            method : 'POST',
        })
            .done(function(response) {
                //la variable "response" est un bool, renvoyé par le serveur. A la moindre erreur, le serveur renvoie faux.
                console.log(response);
                if(response.connection){
                    console.log("L'utilisateur est connecté.");
                    resolve(true);
                }
                else {
                    console.log("L'utilisateur n'est pas connecté.");
                    resolve(false);
                }

            })
            .fail(function(){
                alert('Erreur interne critique.');
                resolve(false);
            });
    });
}

/**
 * Renvoie un objet JSON à partir d'un formulaire, qui contiendra la valeur des inputs.
 * @param formData
 */
function transformFormDataIntoObject(formData){
    let signInObject = {};
    let signInFormData = new FormData(formData);
    for (const [key, value]  of signInFormData.entries()) {
        signInObject[key] = value;
    }
    return signInObject;
}

/**
 * Gestion de l'inscription
 * @param event
 * @param domElement
 */
function signUp(event,domElement) {
    //On empêche l'envoi du formulaire vers le serveur
    event.preventDefault();
    //On récupère les données du formulaire dans un objet JSON.
    let signUpObject = transformFormDataIntoObject(domElement);
    let callBackDiv  = $('#callback-sign-up-message');
    if(signUpObject.hasOwnProperty('signUpLogin') && signUpObject['signUpLogin'] === ""){
        displayAlertInDiv("Votre login unique est nécessaire. Veuillez renseigner le champs.",callBackDiv,2000);
    }
    else {
        if(signUpObject.hasOwnProperty('signUpPassword') && signUpObject['signUpPassword'] === ""){
            displayAlertInDiv("Pour des questions de sécurité, votre password est nécessaire. Veuillez renseigner le champs.",callBackDiv,2000);
        }
        else {
            $.ajax( {
                url : "User/try_inscription/",
                method : 'POST',
                data : {
                    signUpData : signUpObject
                }
            })
                .done(function(response) {
                    console.log(response);
                    if(response.success){
                        $('#sign-up-modal').modal('hide');
                    }
                    else {
                        displayAlertInDiv(response.error,callBackDiv,1500);
                    }
                })
                .fail(function(){
                    displayAlertInDiv('Erreur interne. Veuillez contactez un développeur de la plateforme.',callBackDiv,1500);
                });
        }
    }
}

/**
 * Gestion de la connexion
 * @param event
 * @param domElement
 */
function signIn(event,domElement) {
    //On empêche l'envoi du formulaire vers le serveur
    event.preventDefault();
    //On récupère les données du formulaire dans un objet JSON.
    let signInObject = transformFormDataIntoObject(domElement);
    let callBackDiv  = $('#callback-sign-in-message');
    if(signInObject.hasOwnProperty('signInLogin') && signInObject['signInLogin'] === "") {
        displayAlertInDiv("Votre login unique est nécessaire. Veuillez renseigner le champs.",callBackDiv,2000);
    }
    else {
        if(signInObject.hasOwnProperty('signInPassword') && signInObject['signInPassword'] === "") {
            displayAlertInDiv("Pour des questions de sécurité, votre password est nécessaire. Veuillez renseigner le champs.",callBackDiv,2000);
        }
        else {
            showLoader();
            $.ajax({
                url : "User/try_connection/" + signInObject.signInLogin + "/" +signInObject.signInPassword,
                method : 'POST'})
                .done(function(response) {
                    console.log(response);
                    hideLoader();
                    if(response.connection){
                        $('#sign-in-modal').modal('hide');
                        location.reload(true);
                    }
                    else {
                        displayAlertInDiv(response.error,callBackDiv,1500);
                    }
                })
                .fail(function() {
                    displayWarningInDiv('Erreur interne. Veuillez contactez un développeur de la plateforme.',callBackDiv,1500);
                });
        }
    }
}

/**
 * Gestion de la déconnexion
 */
function logout() {
    return new Promise((resolve, reject) => {
        $.ajax( {
            url : "User/logout/",
            method : 'POST'
        }).done((result) => {
            resolve(result);
            console.log("Déconnexion de l'utilisateur.");
        }).fail(()=>{
            alert('Une erreur est survenue sur le serveur lors de la déconnexion.');
        });
    });
}

/**
 * Affiche des bouttons à propos des topArtists.
 */
function getTopArtists() {
    let topArtistZone = $("#top-artist-zone");
    //On clear la zone pour éviter la duplication si l'utilisateur fait des "va-et-vient" vers ce menu.
    topArtistZone.find('.top-artist-btn').remove();
    Artist.get_top_artists().then((allTopArtists) => {
        allTopArtists.forEach((anArtist) => {
            let topArtistBtn = anArtist.toButton();
            topArtistZone.find(".modal-body").append(topArtistBtn);
        })
    });
}

/**
 * Renvoit via Promise, les résultats d'une recherche sur un titre musical.
 * @param trackName
 * @returns {Promise<any>}
 */
function searchForTracks(trackName) {
    let  resultsDiv = $("#results-search-for-tracks");
    resultsDiv.empty();
    return new Promise(function (resolve, reject) {
        $.ajax( {
            url : "Track/search_track/"+trackName,
            method : 'POST',
        })
            .done(function(tracks) {
                if(tracks){
                    resolve(tracks.results.trackmatches);
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

/**
 * Permet d'afficher les résultats d'une recherche dans une div.
 * @param searchResults, un tableau avec les résultats attendus
 * @param div, la div sur laquelles on append() les résultats.
 */
function displaySearchResultsInDiv(searchResults,div) {
    let resultsTracksDiv = div;
    resultsTracksDiv.empty();
    if(!searchResults || searchResults.track.length === 0){
        console.log("Aucun résultat reçu.");
        let errorMessage = "<div class='lead text-center'><p class='text-warning'>Aucun résultat connu pour cette recherche.</p></div>";
        div.append(errorMessage);
        return;
    }

    /*
    Configuration des nouveaux éléments HTML créés. On va ici construire dynamiquement un élément de liste qui contiendra
    pour chaque résultat de recherche reçu, des informations concernant l'artiste, le nombre d'auditeurs du titre chaque mois,
    et autre.
    */
    searchResults.track.forEach((track) => {
        let currentTrack = new Track(track);

        //Container principal
        let newTrackResult = $("<a/>");
        newTrackResult.attr({
            href : currentTrack.url,
            class : "list-group-item list-group-item-action flex-column align-items-start"
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
        let trackImage = $("<img class='d-block'>");
        trackImage.attr({
            id : 'img-for-track-mbid-' + currentTrack.mbid,
            class: 'float-left rounded',
            src : "assets/images/album-img-not-found.png" //Pour l'instant c'est une image standard.
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
        trackNameAndArtist.html('<em>'+currentTrack.name+'</em> - '+ track.artist);

        //Description du morceau
        let trackDescription = $('<p class="mb-5 track-description">');

        //On emboite les deux éléments dans le container
        newTrackResultColNo2.append(trackNameAndArtist);
        newTrackResultColNo2.append(trackDescription);

        /* Dernier élément, qui contient le nombre d'écoutes du titre au mois courant */
        let newTrackResultColNo3 =   $('<div class="col-1">');
        let numberOfMonthlyListeners = $("<small/>");
        numberOfMonthlyListeners.html("Écoutes mensuelles: <strong>"+track.listeners+"</strong>");
        newTrackResultColNo3.append(numberOfMonthlyListeners);

        //On emboite les 2 colonnes et le nombre d'écoutes dans le innerContainer
        newTrackResultInnerContainer.append(newTrackResultColNo1);
        newTrackResultInnerContainer.append(newTrackResultColNo2);
        newTrackResultInnerContainer.append(newTrackResultColNo3);

        //On ajoute le résultat enfin construit à la liste des résultats
        newTrackResult.append(newTrackResultInnerContainer);
        resultsTracksDiv.append(newTrackResult);

        //Traitement supplémentaire, pour récupérer plus d'infos sur le titre, mais aussi et surtout l'image de l'album.
        new Promise(function (resolve, reject) {
            //Si un titre a un mbid, cela signifie qu'on peut éventuellement aller chercher des infos supplémentaires sur celui-ci.
            if(track.mbid){
                $.ajax( {
                    url : "Track/get_info/"+track.mbid,
                    method : 'POST',
                })
                    .done(function(trackInfos) {
                        if(trackInfos){
                            console.log('Track infos');
                            console.log(trackInfos);
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
            if (trackInfos){
                let trackImageURL = trackInfos.album.image[2]["#text"];
                trackImage.attr({
                    src : trackImageURL
                });
                if(typeof trackInfos.wiki !== "undefined"){
                    trackDescription.html(trackInfos.wiki.summary);
                }
            }
        });
    });
}

jQuery.fn.extend({
    /**
     * Fonction qui permet de faire des apparitions/disparitions dynamiques sur la div passée en paramètres.
     *
     * @this , la div qui fait disparaitre le corps de la page, puis qui fais apparaitre la div passée en tant que deuxième paramètre.
     * @param appearableDiv, la div que l'on viendra afficher/cacher dynamiquement lors du click sur 'targetDiv'.
     */
    prepare : function(appearableDiv){
        let main = $('#main');
        this.click((e)=>{
            //On fait disparaitre le main.
            main.fadeOut(500);
            //Puis on fait apparaitre la div voulue.
            setTimeout(()=>{
                appearableDiv.fadeIn(500);
            },500);

            /*
            Normalement (si j'ai bien codé :) ), toutes les divs que  l'on viendra passer en deuxième paramètre de cette fonction
            contienne un petit bouton qui permet de fermer la zone.
             */
            let hideTrigger = appearableDiv.find('.close');
            hideTrigger.click(function(){
                appearableDiv.fadeOut(500);
                setTimeout(() => {
                    main.fadeIn(500);
                },500);
            });
        });
    },

    /**
     * Fonction permettant d'afficher un loader dans une div.
     */
    insertLoader : function () {
        //Si un loader est déjà présent dans la page, on ne le rajoute pas.
        loaderAlreadyInDiv = this.parents(".appearable-zone").find(".loaderDisplayedInDiv");
        if (loaderAlreadyInDiv.length > 0 && loaderAlreadyInDiv.is(":visible")){
            return this;
        }
        let loader = '<div class="text-center loaderDisplayedInDiv">\n' +
            '                <div class="spinner-border" role="status">\n' +
            '                    <span class="sr-only">Loading...</span>\n' +
            '                </div>\n' +
            '            </div>';
        this.after(loader);
        return this;
    },

    /**
     * Supprime tout loader invoqué par la fonction showLoaderInDiv(), à l'intérieur de la div qui appelle la fonction.
     * @returns {*}
     */
    hideInnerLoader : function() {
        loaderInDiv = this.find(".loaderDisplayedInDiv");
        loaderInDiv.fadeOut(200);
        return this;
    }
});