<?php

/**
 * Class User
 * Controller de tout ce qui a un lien avec la gestion des utilisateurs.
 * @property User_Model             $user_model
 * @property User_has_role_Model    $user_has_role_model
 * @property Role_Model             $role_model
 * @property CI_DB_driver $db
 * @property  CI_Input $input
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

    public function get_user($login,$mdp){
        $result = new stdClass();
        $result->success = false;
        $concernedUser = $this->user_model->find_with_param(User_Model::LOGIN,$login);
        if($concernedUser){
            if($concernedUser->password == $mdp){
                $result->success = true;
                $result->user    = $concernedUser;
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
     * @return bool
     */
    public function is_login_already_taken($login){
        $success = $this->user_model->find_with_param(User_Model::LOGIN,$login);
        return $success ? true : false;
    }

    /**
     * WebService d'inscription sur la plateforme.
     *
     * @param $login
     * @param $password
     * @param $confirmedPassword
     */
    public function try_inscription(){
        $postData = (object) ($this->input->post('signUpData'));
        $login = $postData->signUpLogin;
        $password = $postData->signUpPassword;
        $result = new stdClass();
        $result->success = false;
        if(!$this->is_login_already_taken($login)){
            if(isset($postData->signUpPasswordConfirmation) && $password == $postData->signUpPasswordConfirmation){
                //Création du nouvel utilisateur
                $newUser = new User_Model();
                $newUser->login = $login;
                $newUser->password = $password;

                //Valeurs non obligatoires
                $newUser->first_name = $postData->signUpFirstName ? $postData->signUpFirstName : 'Personne sans prénom :(';
                $newUser->last_name = $postData->signUpLastName ? $postData->signUpLastName : 'Personne sans nom :(';
                $newUser->bio = $postData->signUpUserBio ? $postData->signUpUserBio : 'Aucune description fournie.';
                $newUser->picture_profile_url = $postData->signUpUserPP ? $postData->signUpUserPP : User_Model::DEFAULT_PP;
                $newUser->id = @$newUser->save();

                //On lie l'utilisateur à un rôle simple
                $insertRoleForUser = new User_has_role_Model();
                $insertRoleForUser->role_id = User_has_role_Model::SIMPLE_USER_ROLE;
                $insertRoleForUser->user_id = $newUser->id;
                if(@$insertRoleForUser->save()){
                    $result->success = true;
                }
                else{
                    $result->error = "Erreur interne. L'inscription est momentanément indisponible.";
                }

            }
            else{
                $result->error = 'Les mots de passes ne concordent pas.';
            }
        }
        else{
            $result->error = 'Ce login est déjà utilisé.';
        }
        echo json_encode($result);
    }
}