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

    static get_all_from_user(getPublic = false){
        return new Promise(function (resolve, reject) {
            $.ajax( {
                url : "Playlist/get_all_from_user/"+(getPublic ? '' : 'use-public'),
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

    has_all_obligatory_attributes(){
        return (typeof this.name !== "undefined" && this.name !== "");
    }
}