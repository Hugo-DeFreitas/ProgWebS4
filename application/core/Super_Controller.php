<?php

/**
 * Class Super_Controller
 */
class Super_Controller extends CI_Controller
{

    protected $data = array();
    private $main_page;
    public function getMainPage(){return $this->main_page;}
    public function setMainPage($main_page){$this->main_page = $main_page;}

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Fonction permettant de load les modèles nécessaires au bon fonctionnement du controller
     *
     */
    public function load_models(){
        foreach (func_get_args() as $arg){
            if(is_string($arg)){
                $this->load->model($arg);
            }
        }
    }

}