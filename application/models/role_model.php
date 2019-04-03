<?php

class Role_Model extends Super_Model
{
    const PRIMARY_KEY   = 'id';
    const TABLE         = 'role';

    public $id;
    public $name;
    public $description;

    const NAME            = 'first_name';
    const DESCRIPTION     = 'last_name';
}