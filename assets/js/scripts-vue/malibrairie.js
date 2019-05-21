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
 * Prépare la page en fonction de la connexion ou non de l'utilisateur.
 */
function preparePage() {
    /**
     * Tous les éléments du DOM dont on a besoin.
     */
    let body = $('body');
    let headerForConnectedUser      = $('#header-for-connected-user');
    let headerForNotConnectedUser   = $('#header-for-not-connected-user');
    isConnected().then(function (connection) {
        changeHeader(connection);
    });
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
                        preparePage();
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
            $.ajax( {
                url : "User/try_connection/" + signInObject.signInLogin + "/" +signInObject.signInPassword,
                method : 'POST'
            })
                .done(function(response) {
                    console.log(response);
                    if(response.connection){
                        $('#sign-in-modal').modal('hide');
                        preparePage();
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
            preparePage();
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
        let artistsList = $('<ul/>');
        //Pour chaque artiste reçus depuis le controller, on rajoute une div.
        artists.artists.artist.forEach(function (artist) {
            let currentArtistElement = $('<li/>');
            let currentArtistElementImage = $('<img >');
            currentArtistElementImage.attr('src',artist.image[3]['#text']);

            currentArtistElement.html(artist.name);
            currentArtistElement.append(currentArtistElementImage);
            artistsList.append(currentArtistElement);
            console.log(artist);
            //let artistsDiv = $('#topArtists').append();
        });
        $('#topArtists').append(artistsList);
    }).fail((result) => {
        console.log('Une erreur est survenue dans la récupération des TopArtists du moment.');
    });
}