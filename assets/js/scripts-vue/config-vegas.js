$(document).ready( function () {
    //Configuration de Vegas pour une jolie page d'accueil (slider).
    $("#landing-message-vegas").vegas({
    transition : 'slideLeft',
    slides: [
        { src: 'assets/images/slide-1.png'},
        { src: 'assets/images/slide-2.png'},
        { src: 'assets/images/slide-3.png'},
    ],
    overlay: 'assets/js/vegas/overlays/03.png'
    });
});
