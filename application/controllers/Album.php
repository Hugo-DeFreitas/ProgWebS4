<?php

class Album extends Super_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load_models('user_model',
            'user_has_role_model',
            'role_model');
    }

    public function search_album($album_searched){
        $result = $this->get_api_request('album.search&album='.$album_searched.'&limit=10');

        $this->send_output_for_rest_api($result);
    }

    public function get_album_infos($artist_name,$album_name){
        $result = $this->get_api_request('album.getinfo&artist='.$artist_name.'&album='.$album_name);

        $this->send_output_for_rest_api($result);
    }

    public function get_album_tags($artist_name,$album_name){
        $result = $this->get_api_request('album.gettags&artist='.$artist_name.'&album='.$album_name);

        $this->send_output_for_rest_api($result);
    }
}