<?php

/**
 * Class Super_Controller
 *
 * @property CI_DB_driver $db
 * @property  CI_Input $input
 * @property CI_Output $output
 * @property CI_Session $session
 */
class Super_Controller extends CI_Controller
{

    protected $data;
    private $main_page;
    public function getMainPage(){return $this->main_page;}
    public function setMainPage($main_page){$this->main_page = $main_page;}

    public function __construct()
    {
        parent::__construct();
        $this->data = new stdClass();
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

    /**
     * Exécute une requête HTTP de type GET vers une API musicale.
     * @param $api_method
     * @return bool|\Psr\Http\Message\StreamInterface
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get_api_request($api_method){
        $client = new \GuzzleHttp\Client();
        $response = $client->request('GET', BASE_URL_LAST_FM_API.'?method='.$api_method.'&api_key='.LAST_FM_API_KEY.'&format=json');

        if($response->getStatusCode() == 200){
            return $response->getBody()->getContents();
        }
        else {
            return false;
        }
    }

    /**
     * Prépare le statut d'un retour JSON Ajax
     */
    protected function send_output_for_rest_api($objectOrArray){
        $this->output->set_content_type('application/json')
            ->set_status_header(200)
            ->set_output(json_encode($objectOrArray));
    }
}