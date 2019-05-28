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
    console.log('coucou');
    $.ajax( {
        url : "User/logout/",
        method : 'POST'
    })
        .done(function(response) {
            console.log(response);
        })
        .fail(function(){
            alert('erreur');
        });
}

function getTopArtists() {
    $.ajax({
        url : 'Artist/get_top_artists/',
        dataType : 'json'
    }).done((artists) => {
        let artistsDiv = $('#landing-top-artists-vegas');
        //Pour chaque artiste reçus depuis le controller, on rajoute une div.
        artists.artists.artist.forEach(function (artist) {
            let currentArtist = $('<button type="button" class="btn btn-primary" >');
            currentArtist.html(artist.name);
            $.ajax({
                url : 'Artist/get_artist_info/'+artist.mbid,
                method:'POST',
                dataType : 'json'
            }).done((artistInfos) => {
                console.log(artistInfos);
            });
            artistsDiv.append(currentArtist);
        });
    }).fail((result) => {
        console.log('Une erreur est survenue dans la récupération des TopArtists du moment.');
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
                resolve(tracks.results.trackmatches);

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
    tracksResults.track.forEach((track) => {
        console.log(track);
        //Nouveaux résultats.
        let newTrackResult = $("<a/>");
        let newTrackResultInnerContainer = $("<div>");
        let newTrackResultHeading = $("<h5/>");
        let newTrackResultNumberOfListeners = $("<small/>");
        let newTrackResultArtistPart = $("<p/>");

        /*
        Configuration des nouveaux éléments HTML créés.
         */
        //Container principal
        newTrackResult.attr({
            href : "#",
            class : "list-group-item list-group-item-action flex-column align-items-start"
        });
        //Container secondaire
        newTrackResultInnerContainer.addClass("d-flex w-100 justify-content-between");
        //Titre de l'item
        newTrackResultHeading.addClass('mb-1');
        newTrackResultHeading.html(track.name);
        //Nombre d'écoutes par mois de l'artiste.
        newTrackResultNumberOfListeners.html(track.listeners);
        //Infos diverses
        newTrackResultArtistPart.addClass('mb-1');
        newTrackResultArtistPart.html(track.artist);

        //On emboite les parties.
        newTrackResultInnerContainer.append(newTrackResultHeading);
        newTrackResultInnerContainer.append(newTrackResultNumberOfListeners);
        newTrackResult.append(newTrackResultInnerContainer);
        newTrackResult.append(newTrackResultArtistPart);
        resultsTracksDiv.append(newTrackResult);
    });
}