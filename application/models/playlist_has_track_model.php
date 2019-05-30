<?php

class Playlist_has_track_Model extends Super_Model
{
    const TABLE         = 'playlist_has_track';

    public $playlist_id;
    public $track_id;

    const PLAYLIST_ID     = 'playlist_id';
    const TRACK_ID        = 'track_id';
}