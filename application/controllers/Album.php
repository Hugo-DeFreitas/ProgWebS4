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
        echo $this->get_api_request('album.search&album='.$album_searched);
    }
}