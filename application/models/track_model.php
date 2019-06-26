<?php

class Track_Model extends Super_Model
{
    const PRIMARY_KEY   = 'id';
    const TABLE         = 'track';

    public $id;
    public $name;
    public $artist;
    public $mbid;

    const MBID     = 'mbid';
}