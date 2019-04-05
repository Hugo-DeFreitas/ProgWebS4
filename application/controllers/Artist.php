<?php
/**
 * Class Artist
 *
 * Controller de recherche musicale liée aux artistes, cablé avec l'API MusicXMatch.
 *
 * @property User_Model             $user_model
 * @property User_has_role_Model    $user_has_role_model
 * @property Role_Model             $role_model
 */
class Artist extends Super_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load_models('user_model',
            'user_has_role_model',
            'role_model');
    }


    /**
     * Permet de rechercher un id unique d'artiste sur l'API MusicXMatch
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get_top_artists()
    {
        echo $this->get_api_request('chart.gettopartists');
    }

    /**
     * Permet d'obtenir les tops artistes en fonction des pays.
     *
     * @param $country
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
        public function get_top_artists_by_country($country){
        echo $this->get_api_request('geo.gettopartists&country='.$country);
    }
}