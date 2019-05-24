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
        $this->send_output_for_rest_api($this->get_api_request('track.search&track='.$track_searched));
    }

    public function get_top_tracks(){
        $this->send_output_for_rest_api($this->get_api_request('chart.gettoptracks'));
    }
}