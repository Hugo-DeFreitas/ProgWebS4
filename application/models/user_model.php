<?php

class User_Model extends Super_Model
{
    const PRIMARY_KEY   = 'id';
    const TABLE         = 'user';

    public $id;
    public $first_name;
    public $last_name;
    public $login;
    public $password;
    public $bio;
    public $picture_profile_url;

    const FIRST_NAME    = 'first_name';
    const LAST_NAME     = 'last_name';
    const LOGIN         = 'login';
    const PASSWORD      = 'password';
    const BIO           = 'bio';
    const PICTURE_PROFILE_URL = 'picture_profile_url';
}