<?php

if(isset($session_data['user_connected'])){
    $userConnected = $session_data['user_connected'];
}
else{
    $userConnected = null;
}
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
    <div id="header-for-not-connected-user" class="container d-flex flex-column flex-md-row justify-content-between forcehide">
        <a class="py-2" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="d-block mx-auto">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
                <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
                <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
                <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
                <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
                <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
            </svg>
        </a>
        <a href="#sign-in-modal" data-toggle="modal" data-target="#sign-in-modal" class="py-2 d-md-inline-block">
            Se Connecter
        </a>
        <a  href="#sign-up-modal" data-toggle="modal" data-target="#sign-up-modal" class="py-2 d-md-inline-block">
            S'inscrire
        </a>
    </div>
    <div id="header-for-connected-user" class="container d-flex flex-column flex-md-row justify-content-between forcehide">
        <a class="py-2" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="d-block mx-auto">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
                <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
                <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
                <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
                <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
                <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
            </svg>
        </a>
        <a href="" id="logout-link" class="py-2 d-md-inline-block">
            Déconnexion
        </a>
    </div>
</nav>
<!-- FIN DU HEADER -->


<div id="user-div">

</div>
<div id="landingSlider">
    <div id="landing-message-vegas" class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center">
        <div class="col-md-5 p-lg-5 mx-auto my-5 text-light">
            <h1 class="display-4 font-weight-normal">Bienvenue sur <strong>Apollon</strong>.</h1>
            <p class="lead font-weight-normal">Le créateur de playlist ultime.</p>
            <a data-toggle="modal" data-target="#about-modal" class="btn btn-outline-secondary" href="#about">En savoir plus</a>
        </div>
    </div>
</div>
<div id="landingDescription">
    <div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
        <div class="bg-dark mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
            <div class="my-3 py-3">
                <h2 class="display-5">Retrouver vos artistes préférés</h2>
                <p class="lead">
                    Connectez-vous et cherchez de nouveaux titres, créer des playlists.<br>
                    Toutes les fonctionnalités sur une seule page.
                </p>
            </div>
            <div id="apollon-description-1" class="bg-light box-shadow mx-auto custom-box">
            </div>
        </div>
        <div class="bg-light mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
            <div class="my-3 p-3">
                <h2 class="display-5">Explorer une infinité de titres</h2>
                <p class="lead">
                    Des millions de titres, à la portée de tous. <br>
                    Un moteur de recherche efficace et puissant.
                </p>
            </div>
            <div id="apollon-description-2" class="bg-dark box-shadow mx-auto custom-box">
            </div>
        </div>
    </div>
</div>
<div id="topArtists">
    <div id="landing-top-artists-vegas" class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center">
        <h2 id="topArtistHeading" class="left">Artistes du moment</h2>
        <div class="col-md-5 p-lg-5 mx-auto my-5 text-light">

        </div>
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
<div class="modal fade" id="about-modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-md" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">A propos.</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="about-modal" class="modal-body">
                <div class="card">
                    <div class="card-img">
                        <img class="card-img" src="assets/images/about-apollon.png">
                    </div>
                    <div class="card-body">
                        <h2>Réalisation</h2>
                        <p class="lead">
                            Le projet <strong>Apollon</strong> a été réalisé dans le cadre d'un <strong>module de programmation Web</strong> et de JavaScript à l'IUT Informatique
                            d'Aix-en-Provence.
                        </p>
                        <h6>
                            L'objectif : manipuler JQuery, JS proprement, en rechargeant jamais la page via des appels Ajax.
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="sign-in-modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Se connecter <i class="fa fa-user"></i></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form name="signInForm" id="sign-in-form">
                    <div class="form-group">
                        <label for="sign-in-login">Login</label>
                        <input name="signInLogin" type="text" class="form-control" id="sign-in-login" placeholder="Votre nom d'utilisateur.">
                    </div>
                    <div class="form-group">
                        <label for="sign-in-password">Mot de passe</label>
                        <input name="signInPassword" type="password" class="form-control" id="sign-in-password" placeholder="Password">
                    </div>
                    <div id="callback-sign-in-message">
                        <!-- Zone remplie en cas d'erreur lors de la connexion-->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                        <button type="submit" id="sign-in-submit-btn" class="btn btn-primary">Connexion</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="sign-up-modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">S'inscrire <i class="fa fa-user"></i></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form name="signUpForm" id="sign-up-form">
                    <div class="form-group">
                        <label for="sign-up-firstname">Nom</label>
                        <input name="signUpFirstName" type="text" class="form-control" id="sign-up-firstname" placeholder="Tom">
                    </div>
                    <div class="form-group">
                        <label for="sign-up-lastname">Nom</label>
                        <input name="signUpLastName" type="text" class="form-control" id="sign-up-lastname" placeholder="Cruise">
                    </div>
                    <div class="form-group">
                        <label for="sign-up-login">Login <strong>*</strong></label>
                        <input name="signUpLogin" type="text" class="form-control" id="sign-up-login" placeholder="Votre nom d'utilisateur unique.">
                    </div>
                    <div class="form-group">
                        <label for="sign-up-password">Mot de passe <strong>*</strong></label>
                        <input name="signUpPassword" type="password" class="form-control" id="sign-up-password" placeholder="Mot de passe">
                    </div>
                    <div class="form-group">
                        <label for="sign-up-password-confirmation">Confirmation <strong>*</strong></label>
                        <input name="signUpPasswordConfirmation" type="password" class="form-control" id="sign-in-password-confirmation" placeholder="Confirmer votre mot de passe">
                    </div>
                    <div class="form-group">
                        <label for="sign-up-user-bio">Bio</label>
                        <textarea name="signUpUserBio" class="form-control" id="sign-up-user-bio" rows="3" placeholder="Une courte description?"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="sign-up-user-pp">Bio</label>
                        <input name="signUpUserPP" class="form-control" id="sign-up-user-pp" placeholder="L'URL de votre photo de profil.">
                    </div>
                    <div id="callback-sign-up-message">
                        <!-- Zone remplie en cas d'erreur lors de la connexion-->
                    </div>
                    <div class="modal-footer">
                        <div class="text-left">
                            <p class="text-danger">
                                <small><strong>*</strong>, champs obligatoires</small>
                            </p>
                        </div>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                        <button type="submit" id="sign-up-submit-btn" class="btn btn-primary">S'inscrire</button>
                    </div>
                </form>
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
<script src="<?php echo base_url('assets/js/scripts-vue/config-vegas.js')?>"></script>
<script src="<?php echo base_url('assets/js/scripts-vue/malibrairie.js')?>"></script>
<script src="<?php echo base_url('assets/js/scripts-vue/dom-functions.js')?>"></script>

<script>



    $(document).ready(function () {
        //Habillage de la page en fonction de la présence du connexion ou non.
        preparePage();
        getTopArtists();

        /**
         * Gestion  de la déconnexion en Ajax
         */
        $('#logout-link').click(function (e) {
            logout();
        });


        /**
         * Gestion de la connexion en Ajax
         */
        $('#sign-in-form').on('submit', function(e) {
            signIn(e,this);
        });

        /**
         * Gestion de l'inscription en Ajax.
         */
        $('#sign-up-form').on('submit', function(e) {
            signUp(e,this);
        });
    });
</script>
</body>
</html>