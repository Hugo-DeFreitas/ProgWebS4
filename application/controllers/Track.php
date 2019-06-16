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

    public function search_track($track_searched = false){
        if($track_searched){
            $this->send_output_for_rest_api($this->get_api_request('track.search&track='.$track_searched.'&limit=5'));
        }
    }

    public function get_info($mbid = false){
        if($mbid){
            $this->send_output_for_rest_api($this->get_api_request('track.getinfo&mbid='.$mbid));
        }
    }

    public function get_top_tracks(){
        $this->send_output_for_rest_api($this->get_api_request('chart.gettoptracks'));
    }
}