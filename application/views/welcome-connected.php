<?php
/**
 * @var User_Model $userConnected
 * @var Playlist_Model[] $playlists_from_user
 */
$userConnected = $user_model;
?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/bootstrap.css')?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/custom.css')?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/js/vegas/vegas.min.css')?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/fontawesome/css/all.min.css')?>">

    <title><?php echo PROJECT_NAME?></title>
</head>

<body>
<!-- DEBUT DU HEADER -->
<nav id="header" class="site-header sticky-top py-1">

    <div id="header-for-connected-user"
         class="container d-flex flex-column flex-md-row justify-content-between">
        <a class="py-2" href="#">
            <?= $userConnected->first_name?> <?= $userConnected->last_name?>
        </a>
        <a href="" id="logout-link" class="py-2 d-md-inline-block">
            Déconnexion
        </a>
    </div>
</nav>
<!-- FIN DU HEADER -->

<!-- Zone des tops Artistes du moment en France-->
<div class="appearable-zone" id="top-artist-zone">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Top artistes.</h5>
                <button type="button" id="hide-search-zone" class="close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p class="lead">
                    Qu'écoutent les français ? Découvrez les artistes les plus <strong>streamés</strong> en France.
                </p>
                <div class="zone-to-clear">
                    <p class="row" id="display-top-artists">

                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Zone de recherche pour les titres -->
<div class="appearable-zone" id="search-zone-tracks">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Recherche.</h5>
                <button type="button" class="close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p class="lead">
                    Utiliser le moteur de recherche d'<strong>Apollon</strong> pour rechercher de nouveaux <strong>artistes, albums et titres</strong>.
                </p>
                <input name="search-for-tracks" id="search-for-tracks" class="form-control mr-sm-2" type="text" placeholder="Rerchercher des titres." aria-label="search-for-tracks">
                <!-- Résultats de la recherche -->
                <div id="results-search-for-tracks" class="list-group">

                </div>
            </div>
        </div>
    </div>
</div>


<!-- Zone de création d'une nouvelle playlist -->
<div class="appearable-zone" id="playlist-creation-zone">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Créateur de playlist.</h5>
                <button type="button" class="close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p class="lead">
                    Créer une nouvelle <strong>playlist</strong>, sur notre plateforme, et compilez vos <strong>coups de coeurs</strong>.
                </p>
                <form id="new-playlist-form">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Nom de la playlist</label>
                        <input type="text" class="form-control" id="playlist-name" aria-describedby="playlist-help" name="name" placeholder="Vacances 🌴">
                        <small id="playlist-help" class="form-text text-muted">Parce qu'avec un nom c'est toujours plus facile.</small>
                    </div>
                    <div class="form-group">
                        <label for="playlist-description">Description</label>
                        <textarea class="form-control" id="playlist-description" rows="3" name="description" placeholder="A écouter sans modération 😎"></textarea>
                    </div>
                    <div class="form-group form-check">
                        <input type="checkbox" class="form-check-input" name="is_public" id="is-playlist-public">
                        <label class="form-check-label" for="is-playlist-public">Rendre ma playlist publique</label>
                    </div>
                    <button type="submit" class="btn btn-primary">Créer</button>
                    <div id="callback-playlist-creation-message">
                        <!-- Zone remplie en cas d'erreur lors de la création de la playlist-->
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Zone de consultation des playlists de l'utilisateur -->
<div class="appearable-zone" id="search-zone-playlists">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Rechercher parmis mes playlists.</h5>
                <button type="button" class="close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p class="lead">
                    Explorer les playlists des <strong>autres utilisateurs</strong>.
                </p>

                <input name="search-for-playlists" id="search-for-playlists"
                       class="form-control mr-sm-2" type="text"
                       placeholder="Rerchercher des playlists."
                       aria-label="search-for-playlists" style="margin-bottom: 30px">

                <!-- Résultats de la recherche -->
                <div id="results-search-for-playlists" class="list-group">

                </div>

                <p class="lead">
                    Toutes vos <strong>créations</strong>.
                </p>

                <div class="accordion" id="acccordion-for-user-playlists"></div>

            </div>
        </div>
    </div>
</div>

<div id="main">

    <div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
        <!-- Div sur les artistes en tendance -->
        <button class="bg-dark mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden"
                style="border: none"
                id="top-artists-trigger">
            <div class="my-3 py-3">
                <h2 class="display-5">Artistes du moment</h2>
                <p class="lead">
                    Découvrez les sensations du moment.
                </p>
            </div>
            <div id="img-for-trending-artists" class="bg-light shadow-sm mx-auto custom-box"></div>
        </button>
        <!-- Div sur les infos de l'utilisateur-->
        <button class="bg-light mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden"
                id="start-searching-trigger"
                style="border: none;">
            <div class="my-3 p-3">
                <h2 class="display-5">Explorer une infinité de titres</h2>
                <p class="lead">
                    Des millions de titres, à la portée de tous.
                </p>
            </div>
            <div id="img-for-tracks-exploration"
                 class="bg-dark shadow-sm mx-auto custom-box">
            </div>
        </button>
    </div>
    <div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
        <!-- Div "button" qui permet de consulter les playlists de l'utilisateur-->
        <button class="bg-light mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden"
                id="explore-user-playlist-trigger"
                style="border: none">
            <div class="my-3 p-3">
                <h2 class="display-5">Consulter mes playlists</h2>
                <p class="lead">
                    Retrouvez vos créations.
                </p>
            </div>
            <div id="img-for-playlists-consultation"
                 class="bg-dark shadow-sm mx-auto custom-box">
            </div>
        </button>

        <!-- Div "button" qui permet d'ajouter une playlist-->
        <button class="bg-dark mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden text-white"
                id="create-new-playlist-trigger"
                style="border: none">
            <div class="my-3 p-3">
                <h2 class="display-5">Créer une nouvelle playlist</h2>
                <p class="lead">
                    Selons vos humeurs, selon vos envies.
                </p>
            </div>
            <div id="img-for-playlist-creation"
                 class="bg-dark shadow-sm mx-auto custom-box">
            </div>
        </button>
    </div>

</div>


<!-- Footer -->
<footer class="container py-1">
    <div class="row">
        <div class="col-6 col-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="d-block mb-2"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>
            <p>Apollon. 2019 <i class="fa fa-copyright"></i></p>
        </div>
        <div class="col-6 col-md">
            <h5>Liens utiles</h5>
            <ul class="list-unstyled text-small">
                <li><a class="text-muted" href="https://iut.univ-amu.fr/diplomes/dut-informatique">DUT Informatique</a></li>
                <li><a class="text-muted" href="https://www.olivierpons.fr/">Olivier Pons</a></li>
                <li><a class="text-muted" href="http://hugo-dft.alwaysdata.net/portfolio/">Portofolio personnel</a></li>
                <li><a class="text-muted" href="https://github.com/Hugo-DeFreitas"><i class="fab fa-github"></i> GitHub</a></li>
            </ul>
        </div>
</footer>

<!-- Modals -->
<div class="modal fade" id="loader" tabindex="-100" role="alert" aria-hidden="true">
    <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
            <div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-track-added-to-playlist" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-md" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Notification</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-img">
                        <img class="card-img" id="title-added-image" src="assets/images/vinyl-skate.png">
                    </div>
                    <div class="card-body">

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Scripts Bootstrap + Librairies autorisées dans le cadre du projet -->
<script src="<?php echo base_url('assets/js/jquery-3.3.1.min.js')?>"></script>
<script src="<?php echo base_url('assets/js/popper.min.js')?>"></script>
<script src="<?php echo base_url('assets/js/tooltip.min.js')?>"></script>
<script src="<?php echo base_url('assets/js/bootstrap.min.js')?>"></script>
<script src="<?php echo base_url('assets/js/vegas/vegas.min.js')?>"></script>
<!-- Scripts inclus pour la vue -->
<script src="<?php echo base_url('assets/js/scripts-vue/config-js-apollon.js')?>"></script>
<script src="<?php echo base_url('assets/js/scripts-vue/artist.js')?>"></script>
<script src="<?php echo base_url('assets/js/scripts-vue/album.js')?>"></script>
<script src="<?php echo base_url('assets/js/scripts-vue/track.js')?>"></script>
<script src="<?php echo base_url('assets/js/scripts-vue/playlist.js')?>"></script>
<script src="<?php echo base_url('assets/js/scripts-vue/malibrairie.js')?>"></script>
<script src="<?php echo base_url('assets/js/scripts-vue/dom-functions.js')?>"></script>

<script>
    $(document).ready(function () {
        //Zone 'triggers' (zone qui lorsqu'on clique dessus, change l'organisation de la page pour ne faire apparaitre que la partie voulue.
        let search              = $('#start-searching-trigger');
        let topArtists          = $('#top-artists-trigger');
        let playlistCreator     = $('#create-new-playlist-trigger');
        let userPlaylists       = $('#explore-user-playlist-trigger');

        //Search bars
        let searchForTracks     = $("#search-for-tracks");
        let searchForPlaylists  = $("#search-for-playlists");

        //Bouttons d'action
        let logOutButton        = $('#logout-link');

        //Click sur la déconnexion
        logOutButton.click(logout);

        /*
        Préparation des différentes zones de la page
         */
        //Zone des top Artists du moment
        topArtists.prepare($('#top-artist-zone'));
        topArtists.click(()=>{getTopArtists();});

        //Zone de recherche
        search.prepare($('#search-zone-tracks'));
        searchForTracks.typingInSearchZoneEvent('tracks');

        //Zone de création des playlists
        playlistCreator.prepare($('#playlist-creation-zone'));
        $('#new-playlist-form').handlePlaylistCreation();

        //Zone d'exploration et de sauvegarde des playlists.
        userPlaylists.prepare($('#search-zone-playlists'));
        searchForPlaylists.typingInSearchZoneEvent('playlists');
        userPlaylists.click(Playlist.loadUserPlaylists()());

    });
</script>
</body>
</html>
