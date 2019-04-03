<?php

class User_has_role_Model extends Super_Model
{
    const TABLE = 'user_has_role';

    public $user_id;
    public $role_id;

    const USER_ID = 'user_id';
    const ROLE_ID = 'role_id';
}