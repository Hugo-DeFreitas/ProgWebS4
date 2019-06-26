$(document).ready( function () {
    //Configuration de Vegas pour une jolie page d'accueil (slider).
    $("#landing-message-vegas").vegas({
    transition : 'slideLeft', timer: false,
    slides: [
        { src: 'assets/images/slide-1.png'},
        { src: 'assets/images/slide-2.png'},
        { src: 'assets/images/slide-3.png'},
    ],
    overlay: 'assets/js/vegas/overlays/03.png'
    });
    $("#apollon-description-1").vegas({
        transition: false,
        timer: false,
        slides: [
            {src: 'assets/images/apollon-descr-1.jpg'}
        ]
    });
    $("#apollon-description-2").vegas({
        transition: false,
        timer: false,
        slides: [
            {src: 'assets/images/apollon-descr-2.jpg'}
        ]
    });

    $("#img-for-trending-artists").vegas({
        transition: false,
        timer: false,
        slides: [
            {src: 'assets/images/top-artists.png'}
        ]
    });

    $("#img-for-tracks-exploration").vegas({
        transition: false,
        timer: false,
        slides: [
            {src: 'assets/images/music-corner.png'}
        ]
    });

    $("#img-for-playlist-creation").vegas({
        transition: false,
        timer: false,
        slides: [
            {src: 'assets/images/listening-peace.png'}
        ]
    });

    $("#img-for-playlists-consultation").vegas({
        transition: false,
        timer: false,
        slides: [
            {src: 'assets/images/listening.jpg'}
        ]
    });
});
