<?php

use MusicBrainz\Supplement\Lookup\ArtistFields;
use MusicBrainz\Value\MBID;

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Class Welcome
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
class Welcome extends Super_Controller {
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

    public function index()
	{
	    $this->data->session_data = $this->session->get_userdata();
	    if(isset($this->data->session_data['user_connected'])){
	        /** @var User_Model $user*/
	        $user = unserialize(serialize($this->data->session_data['user_connected']));
	        $this->data->user_model = $user;
	        $joinPlaylists= $this->user_has_playlist_model->find_all_with_param(User_has_playlist_Model::USER_ID,$user->id);
	        $playlistsFromUser = array();
	        foreach ($joinPlaylists as $userHasPlaylistRow){
	            $currentPlaylist = $this->playlist_model
                    ->find_with_param(Playlist_Model::PRIMARY_KEY,$userHasPlaylistRow->playlist_id);
	            array_push($playlistsFromUser,$currentPlaylist);
            }
            $this->data->playlists_from_user = $playlistsFromUser;
            $this->data->is_connected = $this->is_connected;
            $this->load->view('welcome-connected',$this->data);
        }
        else{
            $this->load->view('welcome-not-connected',$this->data);
        }
    }
}
