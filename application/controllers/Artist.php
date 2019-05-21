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

    public function search_artist_by_mbid($mbid){
        $this->send_output_for_rest_api($this->get_mb_api_request('artist/'.$mbid));
    }


    /**
     * Permet de rechercher un id unique d'artiste sur l'API MusicXMatch
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get_top_artists()
    {
        $this->send_output_for_rest_api($this->get_api_request('chart.gettopartists'));
    }

    /**
     * Permet d'obtenir les tops artistes en fonction des pays.
     *
     * @param $country
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
        public function get_top_artists_by_country($country){
        $this->send_output_for_rest_api($this->get_api_request('geo.gettopartists&country='.$country));
    }
}