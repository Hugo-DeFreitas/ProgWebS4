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
