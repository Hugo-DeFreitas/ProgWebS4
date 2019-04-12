/**
 * Change l'état du header en fonction de la connexion ou non de l'utilisateur.
 * @param isConnected, un boolean.
 */
function changeHeader(isConnected) {
    let header                      = $('#header');
    let headerForConnectedUser      = $('#header-for-connected-user');
    let headerForNotConnectedUser   = $('#header-for-not-connected-user');

    header.addClass('forcehide');
    if(isConnected){
        console.log("Changement de header en mode utilisateur connecté.");
        headerForConnectedUser.removeClass('forcehide');
        headerForNotConnectedUser.addClass('forcehide');
    }
    else{
        console.log("Changement de header en mode visiteur.");
        headerForNotConnectedUser.removeClass('forcehide');
        headerForConnectedUser.addClass('forcehide');
    }
    header.removeClass('forcehide');
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