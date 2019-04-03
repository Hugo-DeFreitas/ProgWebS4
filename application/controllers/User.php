<?php

/**
 * Class User
 * Controller de tout ce qui a un lien avec la gestion des utilisateurs.
 * @property User_Model             $user_model
 * @property User_has_role_Model    $user_has_role_model
 * @property Role_Model             $role_model
 */
class User extends Super_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load_models('user_model',
            'user_has_role_model',
            'role_model');
    }


    /**
     * WebService permettant de tenter une connexion à la BDD.
     *
     * @param $login
     * @param $mdp
     */
    public function try_connection($login,$mdp){
        $result = new stdClass();
        $result->success = false;
        $concernedUser = $this->user_model->find_with_param(User_Model::LOGIN,$login);
        if($concernedUser){
            if($concernedUser->password == $mdp){
                $result->success = true;
            }
            else {
                $result->error = 'Mot de passe incorrect.';
            }
        }
        else{
            $result->error = 'Utilisateur inexistant.';
        }
        echo json_encode($result);
    }

    /**
     * Permet de savoir si un compte (via le login) est déjà présent en base.
     * @param $login
     */
    public function is_login_already_taken($login){
        $success = $this->user_model->find_with_param(User_Model::LOGIN,$login);
        echo $success ? 'true' : 'false';
    }
}