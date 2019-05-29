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
 */
class Welcome extends Super_Controller {
    public function __construct()
    {
        parent::__construct();
        $this->load->library('session');
        $this->load_models('user_model',
            'user_has_role_model',
            'role_model');
    }

    public function index()
	{
	    $this->data->session_data = $this->session->get_userdata();
	    if(isset($this->data->session_data['user_connected'])){
	        $this->data->user_model = unserialize(serialize($this->data->session_data['user_connected']));
        }
	    $this->data->is_connected = $this->is_connected;
	    $this->load->view('welcome',$this->data);
    }
}
