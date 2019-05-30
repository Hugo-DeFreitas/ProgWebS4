<?php

class User_has_playlist_Model extends Super_Model
{
    const TABLE         = 'user_has_playlist';

    public $user_id;
    public $playlist_id;

    const USER_ID         = 'user_id';
    const PLAYLIST_ID     = 'playlist_id';
}