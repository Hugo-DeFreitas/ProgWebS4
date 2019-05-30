<?php

class Playlist_Model extends Super_Model
{
    const PRIMARY_KEY   = 'id';
    const TABLE         = 'playlist';

    public $id;
    public $name;
    public $description;

    const NAME            = 'name';
    const DESCRIPTION     = 'description';
}