<?php

use GuzzleHttp\Client;
use MusicBrainz\HttpAdapter\GuzzleHttpAdapter;
use MusicBrainz\MusicBrainz;

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, OPTIONS");
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
    public $music_brainz;
    private $main_page;
    public $is_connected;
    public function getMainPage(){return $this->main_page;}
    public function setMainPage($main_page){$this->main_page = $main_page;}

    public function __construct()
    {
        parent::__construct();
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        $this->data = new stdClass();
        $guzzleHttpAdapter = new GuzzleHttpAdapter(new Client);
        $this->music_brainz       = new MusicBrainz($guzzleHttpAdapter);
        $this->music_brainz->config()
            ->setUsername(MUSICBRAINZ_LOGIN)
            ->setPassword(MUSICBRAINZ_PWD);
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
     * Exécute une requête HTTP de type GET vers une API musicale.
     * @param $suburl
     * @return bool|\Psr\Http\Message\StreamInterface
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get_mb_api_request($suburl){
        try {
            $client = new \GuzzleHttp\Client();
            $url = BASE_URL_MB_API.$suburl.'?inc=url-rels&fmt=json';
            $response = $client->request('GET', $url);

            if($response->getStatusCode() == 200){
                return $response->getBody()->getContents();
            }
            else {
                return false;
            }
        }
        catch (Exception $e){
            return false;
        }

    }

    /**
     * Prépare le statut d'un retour JSON Ajax et fais un echo.
     */
    protected function send_output_for_rest_api($objectOrArray){
        $this->output->set_content_type('application/json');
        $this->output->set_header('Cache-Control: no-cache, must-revalidate');
        $this->output->set_header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        $this->output->set_header('Content-type: application/json');
        if(is_array($objectOrArray) || is_object($objectOrArray)){
            if($objectOrArray){
                $this->output->set_output(json_encode($objectOrArray,JSON_PRETTY_PRINT));
            }
            else{
                $resultError = new stdClass();
                $resultError->message = 'Le WebService n\'a rien à retourner.';
                $resultError->result = 'error';
                $this->output->set_output(json_encode($resultError,JSON_PRETTY_PRINT));
            }
        }
        else{
            if($objectOrArray){
                //Vraisemblablement on a déjà un JSON
                $this->output->set_output($objectOrArray);
            }
            else{
                $resultError = new stdClass();
                $resultError->message = 'Le WebService n\'a rien à retourner.';
                $resultError->result = 'error';
                $this->output->set_output(json_encode($resultError,JSON_PRETTY_PRINT));
            }
        }
        return;
    }

    /**
     * Déconnecte un utilisateur
     */
    public function logout(){
        $result = new stdClass();
        $result->deconnection = false;
        if($this->isConnected()){
            $sessionData = (object) $this->session->get_userdata();
            $result->user_deconnected = $sessionData->user_connected;
            $result->deconnection = true;
            $this->session->unset_userdata('user_connected');
        }
        $this->send_output_for_rest_api($result);
    }

    /**
     * Connecte un utilisateur
     * @param User_Model $user
     */
    protected function login(User_Model $user){
        $this->session->set_userdata('user_connected',$user);
        $this->input->set_cookie('login',$user->login);
        $this->input->set_cookie('user_id',$user->id);
    }

    /**
     * Fonction membre privée, qui est le véritable de test de la connection d'un utilisateur,
     * en allant regarder dans les variables de session.
     *
     * @return bool
     */
    protected function isConnected(){
        $sessionData = (object) ($this->session->get_userdata());
        if(isset($sessionData->user_connected) && isset($sessionData->user_connected->id)){
            $testedUser = $this->user_model->get($sessionData->user_connected->id);
            if($testedUser) {
                return true;
            }
            else{
                return false;
            }
        }
        else {
            return false;
        }
    }
}