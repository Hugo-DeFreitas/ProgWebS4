<?php

class Track_Model extends Super_Model
{
    const PRIMARY_KEY   = 'id';
    const TABLE         = 'track';

    public $id;
    public $mbid;
    public $description;

    const MBID     = 'mbid';
}