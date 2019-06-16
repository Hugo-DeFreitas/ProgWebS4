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
        <li class="nav-item dropleft" style="list-style: none;">
            <a class="nav-item nav-link dropdown-toggle mr-md-2" href="" id="playlists-from-user-id-<?= $userConnected->id?>" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Playlists
            </a>
            <div class="dropdown-menu dropdown-menu-right">
                <?php
                if($playlists_from_user){
                    foreach ($playlists_from_user as $playlist){
                        ?>
                        <a class="dropdown-item" id="dropdown-item-with-playlist-id-<?= $playlist->id?>">
                            <i class="fa fa-play-circle text-primary"></i>&nbsp;<?= $playlist->name ?>
                        </a>
                        <?php
                    }
                }
                ?>
            </div>
        </li>
    </div>
</nav>
<!-- FIN DU HEADER -->

<!-- Zone de recherche pour les artistes, les titres et albums-->
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
                    Artistes les plus <strong>streamés</strong>.
                </p>
                <p class="row" id="display-top-artists">

                </p>
            </div>
        </div>
    </div>
</div>

<!-- Zone de recherche pour les artistes, les titres et albums-->
<div class="appearable-zone" id="search-zone">
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

<div id="main">
    <!-- Modal formulaire d'ajout des playlist -->


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
                style="border: none">
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

<!-- Scripts Bootstrap + Librairies autorisées dans le cadre du projet -->
<script src="<?php echo base_url('assets/js/jquery-3.3.1.min.js')?>"></script>
<script src="<?php echo base_url('assets/js/popper.min.js')?>"></script>
<script src="<?php echo base_url('assets/js/bootstrap.min.js')?>"></script>
<script src="<?php echo base_url('assets/js/vegas/vegas.min.js')?>"></script>
<!-- Scripts inclus pour la vue -->
<script src="<?php echo base_url('assets/js/scripts-vue/config-js-apollon.js')?>"></script>
<script src="<?php echo base_url('assets/js/scripts-vue/artist.js')?>"></script>
<script src="<?php echo base_url('assets/js/scripts-vue/album.js')?>"></script>
<script src="<?php echo base_url('assets/js/scripts-vue/track.js')?>"></script>
<script src="<?php echo base_url('assets/js/scripts-vue/malibrairie.js')?>"></script>
<script src="<?php echo base_url('assets/js/scripts-vue/dom-functions.js')?>"></script>

<script>
    $(document).ready(function () {
        let search          = $('#start-searching-trigger');
        let topArtists      = $('#top-artists-trigger');
        let logOutButton    = $('#logout-link');


        logOutButton.click(logout);

        search.prepare($('#search-zone'));
        topArtists.prepare($('#top-artist-zone'));
        topArtists.click(()=>{
            getTopArtists();
        });

        //On met un timer pour ne pas faire de requêtes AJAX à chaque changement de lettres.
        let typingTimer;
        let timeForUserBeforeAjaxRequest = 1000;
        $("#search-for-tracks").keyup(function(){
            let saveContext = $(this);
            let searchZone = $("#search-zone");
            let resultsDiv = $('#results-search-for-tracks');
            let newVal = $(this).val();
            clearTimeout(typingTimer);
            //On efface les résultats précédents pour plus de clarté à chaque nouvelle valeur entrée par l'utilisateur.
            resultsDiv.empty();
            //On met un loader le temps de la recherche ajax.
            resultsDiv.insertLoader();
            typingTimer = setTimeout(function () {
                //Appel Ajax qui va chercher des titres correspondants.
                searchForTracks(newVal).then((tracksResults) => {
                    console.log("Résultats pour la recherche '"+newVal+"' :");
                    console.log(tracksResults);
                    //On cache le loader
                    searchZone.hideInnerLoader();
                    //On affiche les résultats de la recherche dans la div concernée.
                    resultsDiv.displaySearchResultsInside(tracksResults);
                });
            }, timeForUserBeforeAjaxRequest);
        });
    });
</script>
</body>
</html>
