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

/**
 * Nettoie toute la page (sauf le header et le footer).
 */
function clearAll() {$("#main").empty();}

/**
 * Fonction permettant d'afficher le loader.
 */
function showLoader() {$('#loader').modal('show');}

/**
 * Fonction permettant d'enlever le loader (de force), car il s'agit d'un bug sur la librairie Bootstrap.
 */
function hideLoader() {
    let loader = $("#loader");
    let body = $('body');
    loader.removeClass("in");
    $(".modal-backdrop").remove();
    body.removeClass('modal-open');
    body.css('padding-right', '');
    loader.hide();
}

/**
 * Fonction permettant d'afficher un loader dans une div.
 */
function showLoaderInDiv(div) {
    //Si un loader est déjà présent dans la page, on ne le rajoute pas.
    if ($(".loaderDisplayedInDiv").length > 0){
        return div;
    }
    let loader = '<div class="text-center loaderDisplayedInDiv">\n' +
        '                <div class="spinner-border" role="status">\n' +
        '                    <span class="sr-only">Loading...</span>\n' +
        '                </div>\n' +
        '            </div>';
    div.after(loader);
    return div;
}

/**
 * Supprime tout loader invoqué par la fonction showLoaderInDiv(), à l'intérieur d'une div.
 * @param div
 * @returns {*}
 */
function hideLoaderInDiv(div) {
    $(".loaderDisplayedInDiv").remove();
    return div;
}