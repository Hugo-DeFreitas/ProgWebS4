class Playlist {
    name; //Le nom de la playlist
    description; //La description de la playlist
    is_public; // Est-elle publique (visible par les autres utilisateurs?
    /**
     * @var {Track[]} tracks
     */
    tracks; // Tableau de titres contenant cette playlist.


    constructor() {

    }

    static get_from_form(formElement){
        let newPlaylistData = formElement.serializeArray();
        let newPlaylist = new Playlist();
        newPlaylist.name = (typeof newPlaylistData[0] === 'undefined' ? null : newPlaylistData[0].value);
        newPlaylist.description = (typeof newPlaylistData[1] === 'undefined' ? null : newPlaylistData[1].value);
        newPlaylist.is_public = (typeof newPlaylistData[2] !== 'undefined');
        return newPlaylist;
    }

    has_all_obligatory_attributes(){
        return (typeof this.name !== "undefined" && this.name !== "");
    }
}