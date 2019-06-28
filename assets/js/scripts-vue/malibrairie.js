jQuery.fn.extend({
    /**
     * Fonction qui permet de faire des apparitions/disparitions dynamiques sur la div passée en paramètres.
     *
     * @this , la div qui fait disparaitre le corps de la page, puis qui fais apparaitre la div passée en tant que deuxième paramètre.
     * @param appearableDiv, la div que l'on viendra afficher/cacher dynamiquement lors du click sur 'targetDiv'.
     */
    prepare : function(appearableDiv){
        let main = $('#main');
        this.click((e)=>{
            //On fait disparaitre le main.
            main.fadeOut(500);
            //Puis on fait apparaitre la div voulue.
            setTimeout(()=>{
                appearableDiv.fadeIn(500);
            },500);

            /*
            Normalement (si j'ai bien codé :) ), toutes les divs que  l'on viendra passer en deuxième paramètre de cette fonction
            contienne un petit bouton qui permet de fermer la zone.
             */
            let hideTrigger = appearableDiv.find('.close');
            hideTrigger.click(function(){
                appearableDiv.fadeOut(500);
                setTimeout(() => {
                    main.fadeIn(500);
                },500);
            });
        });
    },

    /**
     * Fonction permettant d'afficher un loader dans une div.
     */
    insertLoader : function () {
        //Si un loader est déjà présent dans la page, on ne le rajoute pas.
        loaderAlreadyInDiv = this.parents(".appearable-zone").find(".loaderDisplayedInDiv");
        if (loaderAlreadyInDiv.length > 0 && loaderAlreadyInDiv.is(":visible")){
            return this;
        }
        let loader = '<div class="text-center loaderDisplayedInDiv">\n' +
            '                <div class="spinner-border" role="status">\n' +
            '                    <span class="sr-only">Loading...</span>\n' +
            '                </div>\n' +
            '            </div>';
        this.after(loader);
        return this;
    },

    /**
     * Supprime tout loader invoqué par la fonction showLoaderInDiv(), à l'intérieur de la div qui appelle la fonction.
     * @returns {*}
     */
    hideInnerLoader : function() {
        loaderInDiv = this.find(".loaderDisplayedInDiv");
        loaderInDiv.fadeOut(200);
        return this;
    },

    /**
     * Permet d'afficher les résultats d'une recherche dans une div.
     * @param {Track[]} searchResults, un tableau avec les résultats attendus
     */
    displaySearchResultsInside : function(searchResults) {
        this.empty();
        if(!searchResults || searchResults.length === 0){
            console.log("Aucun résultat reçu.");
            let errorMessage = "<div class='lead text-center'><p class='text-warning'>Aucun résultat connu pour cette recherche.</p></div>";
            this.append(errorMessage);
            return;
        }

        let self  = this;//Sauvegarde du contexte
        /*
        Configuration des nouveaux éléments HTML créés. On va ici construire dynamiquement un élément de liste qui contiendra
        pour chaque résultat de recherche reçu, des informations concernant l'artiste, le nombre d'auditeurs du titre chaque mois,
        et autre.
        */
        Playlist.get_all_from_user().then((allPlaylistsFromUser)=>{
            console.log("Récupération de toutes les playlists privées de l'utilisateur.");
            console.log(allPlaylistsFromUser);
            /** @var {Track} result*/
            searchResults.forEach((result) => {
                self.append(result.toSearchResult(allPlaylistsFromUser));
            });
        });
    },

    /**
     * Permet d'afficher les résultats d'une recherche de playlist dans une div.
     * @param {Playlist[]} searchResults, un tableau avec les résultats attendus
     */
    displayPlaylistResultsInside : function(searchResults) {
        this.empty();
        if(!searchResults || searchResults.length === 0){
            console.log("Aucun résultat reçu.");
            let errorMessage = "<div class='lead text-center'><p class='text-warning'>Aucun résultat connu pour cette recherche.</p></div>";
            this.append(errorMessage);
            return;
        }

        let self  = this;//Sauvegarde du contexte

        console.log(searchResults);
    },

    /**
     * Met une alerte de danger dans la div courante.
     *
     * @param message
     * @param duration
     */
    displayAlertInDiv : function (message,duration) {
        this.show();
        this.html(
            "<div class=\"alert alert-danger\" role=\"alert\">" +
            message +
            "</div>");
        let self = this;
        setTimeout(function () {
            let alertCreated = self.find('.alert');
            alertCreated.remove();
        },duration);
    },
    /**
     * Fonction qui gère ce qu'il se passe lors de l'écriture dans la barre de recherche des titres.
     */
    typingInSearchZoneEvent : function(searchDomain){
        //On met un timer pour ne pas faire de requêtes AJAX à chaque changement de lettres.
        let typingTimer;
        let timeForUserBeforeAjaxRequest = 1000;
        let self = this;

        //Traitement différent selon le domaine de recherche
        switch (searchDomain) {

            //Si l'utilisateur veut chercher parmis les titres de la plateforme.
            case 'tracks':
                this.keyup(function(){
                    let searchZone = $("#search-zone-tracks");
                    let resultsDiv = $('#results-search-for-tracks');
                    let newVal = $(this).val();
                    clearTimeout(typingTimer);
                    //On efface les résultats précédents pour plus de clarté à chaque nouvelle valeur entrée par l'utilisateur.
                    resultsDiv.empty();
                    //On met un loader le temps de la recherche ajax.
                    resultsDiv.insertLoader();
                    typingTimer = setTimeout(function () {
                        //Appel Ajax qui va chercher des titres correspondants.
                        Track.searchForTracks(newVal).then((tracksResults) => {
                            console.log("Résultats pour la recherche '"+newVal+"' :");
                            console.log(tracksResults);
                            //On cache le loader
                            searchZone.hideInnerLoader();
                            //On affiche les résultats de la recherche dans la div concernée.
                            resultsDiv.displaySearchResultsInside(tracksResults);
                        });
                    }, timeForUserBeforeAjaxRequest);
                });
                break;

            //Si l'utilisateur veut chercher parmis les playlists de la plateforme.
            case 'playlists':
                this.keyup(function(){
                    let searchZone = $("#search-zone-playlists");
                    let resultsDiv = $('#results-search-for-playlists');
                    let newVal = $(this).val();
                    clearTimeout(typingTimer);
                    //On efface les résultats précédents pour plus de clarté à chaque nouvelle valeur entrée par l'utilisateur.
                    resultsDiv.empty();
                    //On met un loader le temps de la recherche ajax.
                    resultsDiv.insertLoader();
                    typingTimer = setTimeout(function () {
                        //Appel Ajax qui va chercher des titres correspondants.
                        Playlist.browse(newVal).then((playlistsResults) => {
                            console.log("Résultats pour la recherche '"+newVal+"' :");
                            console.log(playlistsResults);
                            //On cache le loader
                            searchZone.hideInnerLoader();
                            Playlist.displaySearchResults(resultsDiv,playlistsResults);
                        });
                    }, timeForUserBeforeAjaxRequest);
                });
                break;
        }

    },
    displayWarningInDiv : function (message,duration) {
        this.show();
        this.html(
            "<div class=\"alert alert-warning\" role=\"alert\">" +
            message +
            "</div>");
        let self = this;
        setTimeout(function () {
            self.find('.alert').remove();
        },duration);
    },
    displaySuccessInDiv : function (message,duration) {
        this.show();
        this.html(
            "<div class=\"alert alert-success\" role=\"alert\">" +
            message +
            "</div>");
        let self = this;
        setTimeout(function () {
            let alertCreated = self.find('.alert');
            alertCreated.remove();
        },duration);
    },
    /**
     * Fonction déclenchée lors de l'envoi d'un formulaire pour créer un nouvelle playlist.
     */
    handlePlaylistCreation : function(){
        let self = this;
        this.submit(function (e) {
            e.preventDefault();
            let newPlaylist = Playlist.get_from_form(self);
            let playlistCreationMessage = $('#callback-playlist-creation-message');

            if(!newPlaylist.has_all_obligatory_attributes()){
                playlistCreationMessage.displayAlertInDiv('Nous ne pourrons pas créer de playlist sans nom 🙃. Veuillez en donner un !',3000);
                return;
            }

            playlistCreationMessage.insertLoader();

            setTimeout(function () {
                $.ajax({
                    url : "Playlist/new_playlist/",
                    method : 'POST',
                    data: newPlaylist
                })
                    .done((result)=>{
                        if(typeof result.id === "undefined"){
                            playlistCreationMessage.displayAlertInDiv("La création de la playlist s'est mal passée. " +
                                "Veuillez contacter un administrateur de la plateforme.",300);
                            return;
                        }
                        playlistCreationMessage.displaySuccessInDiv("La playlist "+result.name+" a bien été créée.",3000);
                        self.trigger("reset"); //On reset le formulaire
                        self.hideInnerLoader();
                    })
                    .fail((result)=>{
                        playlistCreationMessage.displayAlertInDiv("Erreur critique. Ça sent pas bon pour nous.",300);
                        console.error(result);
                        self.hideInnerLoader();
                    });
            });
        });
    }
});

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