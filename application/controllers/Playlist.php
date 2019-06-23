<?php

/**
 * Class Playlist
 *
 * @property CI_Input               $input
 * @property CI_Session             $session
 *
 * @property User_Model             $user_model
 * @property User_has_role_Model    $user_has_role_model
 * @property Role_Model             $role_model
 * @property Playlist_Model         $playlist_model
 * @property Track_Model            $track_model
 * @property Playlist_has_track_Model  $playlist_has_track_model
 * @property User_has_playlist_Model   $user_has_playlist_model
 *
 */
class Playlist extends Super_Controller {
    public function __construct()
    {
        parent::__construct();
        $this->load->library('session');
        $this->load_models('user_model',
            'user_has_role_model',
            'role_model',
            'track_model',
            'playlist_model',
            'user_has_playlist_model',
            'playlist_has_track_model');
    }

    public function new_playlist(){
        $userData = $this->session->get_userdata();

        $result = new stdClass();

        $newPlaylistData = (object) $this->input->post();
        $userData = unserialize(serialize($userData['user_connected']));

        $newPlaylist = new Playlist_Model();

        $newPlaylist->name = $newPlaylistData->name;
        $newPlaylist->description = $newPlaylistData->description;
        $newPlaylist->is_public = $newPlaylistData->is_public == 'true' ? 1 : 0;

        $this->db->trans_start();

        $newPlaylistID = $newPlaylist->insert();

        if($newPlaylistData->is_public == 'true'){
            $result->playlist = $newPlaylist;
            $result->success = true;
            $this->db->trans_complete();
            $this->send_output_for_rest_api($newPlaylist);
            return;
        }

        $newPlaylistHasUser = new User_has_playlist_Model();

        $newPlaylistHasUser->user_id = $userData->id;
        $newPlaylistHasUser->playlist_id = $newPlaylistID;

        $ret = $newPlaylistHasUser->insert();

        if($ret){
            $result->playlist = $newPlaylist;
            $result->success = true;
            $this->db->trans_complete();
            $this->send_output_for_rest_api($newPlaylist);
            return;
        }
    }

}