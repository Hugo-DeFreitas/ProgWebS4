<?php

class Playlist_Model extends Super_Model
{
    const PRIMARY_KEY   = 'id';
    const TABLE         = 'playlist';

    public $id;
    public $name;
    public $description;
    public $is_public;

    const NAME            = 'name';
    const DESCRIPTION     = 'description';
    const IS_PUBLIC       = 'is_public';
}