<?php

class Track extends Super_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load_models('user_model',
            'user_has_role_model',
            'role_model');
    }

    public function search_track($track_searched){
        echo $this->get_api_request('track.search&track='.$track_searched);
    }
}