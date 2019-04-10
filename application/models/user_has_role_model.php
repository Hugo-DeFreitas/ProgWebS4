<?php

class User_has_role_Model extends Super_Model
{
    const TABLE = 'user_has_role';

    const SIMPLE_USER_ROLE = 1;
    const ADMIN_USER_ROLE = 0;

    public $user_id;
    public $role_id;

    const USER_ID = 'user_id';
    const ROLE_ID = 'role_id';
}