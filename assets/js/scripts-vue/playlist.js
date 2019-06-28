class Playlist {
    id; //L'ID de playlist en BDD
    name; //Le nom de la playlist
    description; //La description de la playlist
    is_public; // Est-elle publique (visible par les autres utilisateurs?
    /**
     * @var {Track[]} tracks
     */
    tracks; // Tableau de titres contenant cette playlist.


    constructor() {
        this.tracks = [];
    }

    static get_from_form(formElement){
        let newPlaylistData = formElement.serializeArray();
        let newPlaylist = new Playlist();
        newPlaylist.name = (typeof newPlaylistData[0] === 'undefined' ? null : newPlaylistData[0].value);
        newPlaylist.description = (typeof newPlaylistData[1] === 'undefined' ? null : newPlaylistData[1].value);
        newPlaylist.is_public = (typeof newPlaylistData[2] !== 'undefined');
        return newPlaylist;
    }

    /**
     * Permet de récupérer toutes les playlists publiques depuis les serveur
     * @returns {Promise<Playlist[]>} , toutes les playlists publiques
     */
    static get_all(){
        return new Promise(function (resolve) {
            $.ajax( {
                url : "Playlist/get_all/",
            })
                .done(function(playlists) {
                    if(playlists){
                        let castPlaylists = [];
                        playlists.forEach((playlistFromServer)=>{
                            let newPlaylist = new Playlist();
                            newPlaylist.id      = playlistFromServer.id;
                            newPlaylist.name    = playlistFromServer.name;
                            newPlaylist.description = playlistFromServer.description;
                            newPlaylist.is_public   = (playlistFromServer.is_public == "1");
                            playlistFromServer.tracks.forEach((track)=> {
                                newPlaylist.tracks.push(new Track(track));
                            });
                            castPlaylists.push(newPlaylist)
                        });
                        resolve(castPlaylists);
                    }
                    else {
                        resolve(false);
                    }
                })
                .fail(function(){
                    resolve(false);
                });
        });
    }

    /**
     * Permet de récupérer toutes les playlists de l'utilisateur en session, avec la possibilité d'y adjoindre toutes
     * les playlists publiques.
     * @param getPublic, un boolean
     * @returns {Promise<Playlist[]>}
     */
    static get_all_from_user(getPublic = false){
        return new Promise(function (resolve, reject) {
            $.ajax( {
                url : "Playlist/get_all_from_user/"
            })
                /** @var {[]}playlists */
                .done(function(playlists) {
                    if(playlists && typeof playlists === "object"){
                        let castPlaylists = [];
                        if(playlists.length !== 0){
                            playlists.forEach((playlistFromServer)=>{
                                let newPlaylist = new Playlist();
                                newPlaylist.id      = playlistFromServer.id;
                                newPlaylist.name    = playlistFromServer.name;
                                newPlaylist.description = playlistFromServer.description;
                                newPlaylist.is_public   = (playlistFromServer.is_public == "1");
                                playlistFromServer.tracks.forEach((track)=> {
                                    newPlaylist.tracks.push(new Track(track));
                                });
                                castPlaylists.push(newPlaylist)
                            });
                            resolve(castPlaylists);
                        }
                    }
                    else {
                        resolve(false);
                    }
                })
                .fail(function(){
                    resolve(false);
                });
        });
    }

    static loadUserPlaylists(){
        let accordionOfUserPlaylist = $('#acccordion-for-user-playlists');
        accordionOfUserPlaylist.empty();
        /** @var {Playlist[]} playlists */
        Playlist.get_all_from_user().then((playlists)=>{
            if(playlists){
                playlists.forEach((playlist)=>{
                    accordionOfUserPlaylist.append(playlist.toItem());
                });
            }
            else {
                accordionOfUserPlaylist.append('<em>Vous n\'avez pas encore créé de playlists.</em>');
            }
        })
    }

    toItem (){
        //Container principal
        let mainCard = $('<div class="card"/>');

        //Header de la l'item 'accordeon'.
        let cardHeader = $('<div class="card-header"/>');
        cardHeader.attr({
            id : 'accordion-heading-for-playlist-'+this.id,
            'data-toggle'   : "collapse",
            'data-target'   : "#tracks-for-playlist-"+this.id
        });
        let rowOfCardHeader = $('<div class="row"/>');
        let contentOfRowCardHeaderLeftPart = $('<div class="col-6"/>');
        let contentOfRowCardHeaderRightPart = $('<div class="col-6 text-sm-right"/>');
        contentOfRowCardHeaderLeftPart.attr({
            'aria-controls' : "tracks-for-playlist-"+this.id
        });
        contentOfRowCardHeaderRightPart.attr({
            'aria-controls' : "tracks-for-playlist-"+this.id
        });
        contentOfRowCardHeaderLeftPart.append('<strong>'+this.name+'</strong>');
        contentOfRowCardHeaderRightPart.append('Nombre de titres : '+this.tracks.length);
        rowOfCardHeader.append(contentOfRowCardHeaderLeftPart);
        rowOfCardHeader.append(contentOfRowCardHeaderRightPart);
        cardHeader.append(rowOfCardHeader);


        //Contenu de la playlist.
        let cardTracks = $('<div id="tracks-for-playlist-'+this.id+'" class="collapse show"/>');
        cardTracks.attr({
            'aria-labelledby' : "accordion-heading-for-playlist-"+this.id,
            'data-parent' : "#acccordion-for-user-playlists"
        });
        let cardTracksBody = $('<div class="card-body"/>');
        let trackList = $('<ul id="tracks-in-playlist-'+this.id+'" class="list-group"/>');
        this.tracks.forEach((track,index)=>{
            trackList.append('<li class="list-group-item d-flex justify-content-between align-items-center">'+
                '<strong>'+(index+1)+'. '+track.name+'</strong>' +
                '<span class="badge badge-primary badge-pill">'+track.artist.name+'</span>' +
                '</li>');
        });
        cardTracksBody.append(trackList);
        cardTracks.append(cardTracksBody);

        //Construction du container principal
        mainCard.append(cardHeader);
        mainCard.append(cardTracks);

        return mainCard;
    }

    has_all_obligatory_attributes(){
        return (typeof this.name !== "undefined" && this.name !== "");
    }

    /**
     * Cherche parmis toutes les playlists publiques en fonction d'un filtre sur le nom / la description de la playlist.
     * @param nameFilter
     * @returns {Promise<Playlist[]>}
     */
    static browse(nameFilter){
        let  resultsDiv = $("#results-search-for-playlists");
        resultsDiv.empty();
        return new Promise((resolve)=>{
            Playlist.get_all().then((allPlaylists)=>{
                let arrayFiltered = [];
                allPlaylists.forEach((playlist)=>{
                    if(playlist.name.includes(nameFilter) || playlist.description.includes(nameFilter)){
                        arrayFiltered.push(playlist);
                    }
                });
                resolve(arrayFiltered);
            })
        });
    }

    static displaySearchResults(resultsDiv,arrayOfPlaylists){
        if(arrayOfPlaylists.length !== 0){
            arrayOfPlaylists.forEach((playlist)=>{
                resultsDiv.append(playlist.toItem());
            });
        }
    }
}