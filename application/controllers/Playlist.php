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

    public function get_all(){
        $allPlaylists = $this->playlist_model->get_all();
        $allPlaylistsPublic = array();
        foreach ($allPlaylists as $playlist) {
            if ($playlist->is_public == 1) {
                array_push($allPlaylistsPublic, $playlist);
            }
        }

        foreach ($allPlaylistsPublic as $aPlaylist){
            $aPlaylist->tracks = array();
            /** @var Playlist_has_track_Model[] $allPlaylistHasTrack */
            $allPlaylistHasTrack = $this->playlist_has_track_model
                ->find_all_with_param('playlist_id', $aPlaylist->id);
            foreach ($allPlaylistHasTrack as $playlist_has_track_Model){
                $trackFromDB = $this->track_model->get($playlist_has_track_Model->track_id);
                array_push($aPlaylist->tracks,$trackFromDB);
            }
        }

        $this->send_output_for_rest_api($allPlaylistsPublic);
    }

    public function get_all_from_user(){
        $userData = $this->session->get_userdata();

        $userData = unserialize(serialize($userData['user_connected']));

        $allPlaylists = $this->playlist_model->get_all();
        $allPlaylistsFromUser = $this->user_has_playlist_model->find_all_with_param('user_id',$userData->id);

        $allPlaylistsFromUserSorted = array();
        /** @var Playlist_Model $playlist */
        foreach ($allPlaylists as $playlist){
            /** @var User_has_playlist_Model $userHasPlaylist */
            foreach ($allPlaylistsFromUser as $userHasPlaylist){
                if($userHasPlaylist->playlist_id == $playlist->id){
                    array_push($allPlaylistsFromUserSorted,$playlist);
                }
            }
        }
        /** @var Playlist_Model $aPlaylist */
        foreach ($allPlaylistsFromUserSorted as $aPlaylist){
            $aPlaylist->tracks = array();
            /** @var Playlist_has_track_Model[] $allPlaylistHasTrack */
            $allPlaylistHasTrack = $this->playlist_has_track_model
                ->find_all_with_param('playlist_id', $aPlaylist->id);
            foreach ($allPlaylistHasTrack as $playlist_has_track_Model){
                $trackFromDB = $this->track_model->get($playlist_has_track_Model->track_id);
                array_push($aPlaylist->tracks,$trackFromDB);
            }
        }

        $this->send_output_for_rest_api($allPlaylistsFromUserSorted);
    }

    public function add_track($playlistID){
        $trackData = (object) unserialize(serialize($this->input->post()));

        $result = new stdClass();

        if(!($playlistID)){
            $result->success = false;
            $this->send_output_for_rest_api($result);
            return;
        }

        $newTrack = new Track_Model();
        $newTrack->name = $trackData->name;
        $newTrack->mbid = $trackData->mbid;
        $newTrack->artist = $trackData->artist ? $trackData->artist['name'] : null;
        $newTrackID = $newTrack->save();

        $newPlaylistHasTrack = new Playlist_has_track_Model();
        $newPlaylistHasTrack->track_id = $newTrackID;
        $newPlaylistHasTrack->playlist_id = $playlistID;
        $ret = @$newPlaylistHasTrack->save();
        if(!$ret){
            $result->success = false;
        }
        else{
            $result->success = true;
        }
        $this->send_output_for_rest_api($result);
        return;
    }
}