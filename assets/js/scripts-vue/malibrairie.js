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
        callBackDiv.displayAlertInDiv("Votre login unique est nécessaire. Veuillez renseigner le champs.",2000);
    }
    else {
        if(signUpObject.hasOwnProperty('signUpPassword') && signUpObject['signUpPassword'] === ""){
            callBackDiv.displayAlertInDiv("Pour des questions de sécurité, votre password est nécessaire. Veuillez renseigner le champs.",2000);
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
                        callBackDiv.displayAlertInDiv(response.error,1500);
                    }
                })
                .fail(function(){
                    callBackDiv.displayAlertInDiv('Erreur interne. Veuillez contactez un développeur de la plateforme.',1500);
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
        callBackDiv.displayAlertInDiv("Votre login unique est nécessaire. Veuillez renseigner le champs.",2000);
    }
    else {
        if(signInObject.hasOwnProperty('signInPassword') && signInObject['signInPassword'] === "") {
            callBackDiv.displayAlertInDiv("Pour des questions de sécurité, votre password est nécessaire. Veuillez renseigner le champs.",2000);
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
                        callBackDiv.displayAlertInDiv(response.error,1500);
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
    },

    /**
     * Permet d'afficher les résultats d'une recherche dans une div.
     * @param {Track[]} searchResults, un tableau avec les résultats attendus
     */
    displaySearchResultsInside : function(searchResults) {
        this.empty();
        if(!searchResults || searchResults.length === 0){
            console.log("Aucun résultat reçu.");
            let errorMessage = "<div class='lead text-center'><p class='text-warning'>Aucun résultat connu pour cette recherche.</p></div>";
            this.append(errorMessage);
            return;
        }

        let self  = this;//Sauvegarde du contexte
        /*
        Configuration des nouveaux éléments HTML créés. On va ici construire dynamiquement un élément de liste qui contiendra
        pour chaque résultat de recherche reçu, des informations concernant l'artiste, le nombre d'auditeurs du titre chaque mois,
        et autre.
        */
        /** @var {Track} track*/
        searchResults.forEach((track) => {
            self.append(track.toSearchResult());
        });
    },

    /**
     * Met une alerte de danger dans la div courante.
     *
     * @param message
     * @param duration
     */
    displayAlertInDiv : function (message,duration) {
        this.show();
        this.html(
            "<div class=\"alert alert-danger\" role=\"alert\">" +
            message +
            "</div>");
        let self = this;
        setTimeout(function () {
            let alertCreated = self.find('.alert');
            alertCreated.remove();
        },duration);
    },
    displayWarningInDiv : function (message,duration) {
        this.show();
        this.html(
            "<div class=\"alert alert-warning\" role=\"alert\">" +
            message +
            "</div>");
        let self = this;
        setTimeout(function () {
            self.find('.alert').remove();
        },duration);
    },
    displaySuccessInDiv : function (message,duration) {
        this.show();
        this.html(
            "<div class=\"alert alert-success\" role=\"alert\">" +
            message +
            "</div>");
        let self = this;
        setTimeout(function () {
            let alertCreated = self.find('.alert');
            alertCreated.remove();
        },duration);
    },
    /**
     * Fonction déclenchée lors de l'envoi d'un formulaire pour créer un nouvelle playlist.
     */
    handlePlaylistCreation : function(){
        let self = this;
        this.submit(function (e) {
            e.preventDefault();
            let newPlaylist = Playlist.get_from_form(self);
            let playlistCreationMessage = $('#callback-playlist-creation-message');

            if(!newPlaylist.has_all_obligatory_attributes()){
                playlistCreationMessage.displayAlertInDiv('Nous ne pourrons pas créer de playlist sans nom 🙃. Veuillez en donner un !',3000);
                return;
            }

            playlistCreationMessage.insertLoader();

            setTimeout(function () {
                $.ajax({
                    url : "Playlist/new_playlist/",
                    method : 'POST',
                    data: newPlaylist
                })
                    .done((result)=>{
                        if(typeof result.id === "undefined"){
                            playlistCreationMessage.displayAlertInDiv("La création de la playlist s'est mal passée. " +
                                "Veuillez contacter un administrateur de la plateforme.",300);
                            return;
                        }
                        playlistCreationMessage.displaySuccessInDiv("La playlist "+result.name+" a bien été créée.",3000);
                        self.trigger("reset"); //On reset le formulaire
                        console.log(result);
                        self.hideInnerLoader();
                    })
                    .fail((result)=>{
                        playlistCreationMessage.displayAlertInDiv("Erreur critique. Ça sent pas bon pour nous.",300);
                        console.error(result);
                        self.hideInnerLoader();
                    });
            });
        });
    }
});