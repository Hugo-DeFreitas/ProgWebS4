/**
 * Permet de savoir si l'utilisateur est connecté ou non.
 */
function isConnected(){
    $.ajax( {
        url : "User/is_connected/",
        method : 'POST'
    })
        .done(function(response) {
            //la variable "response" est un bool, renvoyé par le serveur. A la moindre erreur, le serveur renvoie faux.
            console.log(response);
            if(response.connection){
                console.log("L'utilisateur est connecté.");
                return true;
            }
            else {
                console.log("L'utilisateur n'est pas connecté.");
                return false;
            }

        })
        .fail(function(){
            alert('erreur');
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
 * Met une alerte de danger dans une div donnée.
 *
 * @param message
 * @param callBackDiv
 * @param duration
 */
function displayAlertInDiv(message,callBackDiv,duration) {
    callBackDiv.show();
    callBackDiv.html(
        "<div class=\"alert alert-danger\" role=\"alert\">" +
        message +
        "</div>");
    setTimeout(function () {
        callBackDiv.hide();
    },duration);
}
function displayWarningInDiv(message,callBackDiv,duration) {
    callBackDiv.show();
    callBackDiv.html(
        "<div class=\"alert alert-warning\" role=\"alert\">" +
        message +
        "</div>");
    setTimeout(function () {
        callBackDiv.hide();
    },duration);
}
function logout() {
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

function setHeaderForConnectedUser() {
    let header = $('#header');

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


    if(isConnected()){
        headerForConnectedUser.show();
        headerForNotConnectedUser.addClass('forcehide');
    }
    else{
        headerForNotConnectedUser.show();
        headerForConnectedUser.addClass('forcehide');
    }
}