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
