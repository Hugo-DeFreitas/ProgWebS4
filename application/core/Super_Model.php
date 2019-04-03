<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Modèle permettant de faciliter la gestion des modèles en BDD.
 */
class Super_Model extends CI_Model
{
    /**
     * CONSTANTES
     */
    const TABLE = null;
    const PRIMARY_KEY = null;
    const DATETIME_FORMAT = 'Y-m-d H:i:s';
    const DATE_FORMAT = 'Y-m-d';
    const TIME_FORMAT = 'H:i:s';

    /**
     * @var $_loaded, correspond au bon déroulenment de l'appel du constructeur parent du MY_Model, le CI_Model.
     * Utile pour être appelé de manière interne dans les fonctions de ce modèle.
     */
    protected static $_loaded;

    protected $_dependencies = array();
    protected $_mass_assignment = array();

    /**
     * MY_Model constructor.
     */
    public function __construct()
    {
        /*
         * On construit comme un CI_Model
         */
        parent::__construct();
        /*
         * Si tout s'est bien passée lors de la construction héritée du CI_Model
         * et que la donnée membre _loaded n'est pas déjà établie, alors on la met à 'true'.
         * Grâce à '_loaded', on peut donc établir rapidement de manière interne à la classe, si le lien
         * avec la BD a pu être effectué.
         */
        if (!static::$_loaded) {
            //
            static::$_loaded = true;
            foreach ($this->_dependencies as $depend) {
                $this->load->model($depend, basename($depend));
            }
        }
    }

    /**
     * Cette fonction permet d'initialiser et de créer une entité en BDD.
     * @param array|stdClass $args,
     * @return Super_Model
     * @throws Exception
     */
    public function create($args)
    {
        /*
         * On créé un nouveau modèle.
         * On assigne à cet objet toutes les données membres qui lui sont passées
         * (ces données peuvent être issues d'un tableau, mais le plus souvent on aura un objet de la stdClass,
         * ce qui est bien plus propre).
         */
        $new = new $this();
        $new->populate($args);
        /*
         * Une fois que l'objet a récupéré toutes ses données membres,
         * on tente une insertion. si elle échoue -> Exception.
         */
        if (!$new->insert()) {
            throw new Exception(EXCEPTION_CREATION_MY_MODEL);
        }
        return $new;
    }

    /**
     * Fonction basique qui permet de récupérer une entité en BD par rapport à son id, directement
     * en fonction du modèle auqelle cette entité correspond.
     * @param int $id, la clé primaire en BD de la table concernée par le modèle que l'on instancie
     * @return $this
     */
    public function get($id)
    {
        /*
         * A l'aide du Query Builder,
         * le custom_row_object permet de cast une ligne récupérée en BD dans un objet de la stdClass,
         * correspondant au modèle concerné.
         */
        $model = $this->db->from($this::TABLE)
            ->where($this::PRIMARY_KEY, $id)
            ->limit(1)
            ->get()
            ->custom_row_object(0, get_class($this));

        return $model;
    }

    /**
     * Cette fonction est l'équivalent d'une requête de type 'SELECT ... FROM ... WHERE $param = $value' en BD.
     * @param  string $param
     * @param null|string $value
     * @return $this
     */
    public function find_with_param($param, $value = null)
    {
        $model = $this->db->from($this::TABLE)
            ->where($param, $value)
            ->limit(1)
            ->get()
            ->custom_row_object(0, get_class($this));
        return $model;
    }

    /**
     * Cette fonction permet de récupérer toutes les entités d'une table en BD,
     * qui sont toutes formatées et cast dans un objet stdClass correspondant au modèle concerné.
     *
     * @return array($this), un tableau d'objet de la stdClass
     */
    public function all()
    {
        return $this->db->from($this::TABLE)
            ->get()
            ->custom_result_object(get_class($this));
    }

    /**
     * Fonction Wrapper de la fonction interne privée '_populate'.
     * Cette fonction est particulièrement utile si l'on veut créer rapidement des nouvelles entités à insérer en BD de la sorte :
     *
     * Ex:
    $reservation = new Reservation_model();

    $uneNouvelleRésa = $reservation->populate([
    'prestation_id'=> $prestaToReserve["prestation_id"],
    'startDate'=>$startDate,
    'startTime'=>$startTime,
    'endDate'=>$endDateReservation,
    'reservationDateTime'=> date('Y-m-d H:i:s'),
    'nbParticipants'=>$prestaToReserve["nb"],
    'language_id'=>1 /
    ])->insert();
     *
     * De cette manière on peut faire des insertions/update/délétions à la volée après une création.
     *
     * @param array|stdClass $args
     * @return $this
     */
    public function populate($args, $prefix = null)
    {
        return $this->_populate($args, $prefix);
    }

    /**
     *  Voir le fonctionnement de sa fonction Wrapper : populate()
     * @param stdClass|array $args
     * @param null $prefix
     * @param bool $check_assignement
     * @return $this
     */
    private function _populate($args, $prefix = null, $check_assignement = false)
    {
        /*
         * On regarde si les args passés en paramètres est en réalité un objet de la stdClass.
         * Si c'est le cas, alors on récupère les propriétés non-statiques de '$args', accessibles depuis le contexte.
         */
        if (is_object($args)) {
            $args = get_object_vars($args);
        }
        /*
         * Une deuxième couche de vérification pour bien vérifier que la récupération s'est bien déroulée si il s'agissait d'un
         * objet stdClass, et si ce n'était pas le cas, que les args passés en paramètres est bien un tableau).
         */
        if (is_array($args)) {
            //Si il y a des arguments, ou que l'argument passé n'est pas nul.
            if ($args) {
                /*
                 * Pour chaque argument passé:
                 *  -   si un préfixe a été passé en paramètres, et que le préfixe est trouvé dans le nom de la donnée membre
                 *  (c'est à dire, en suivant la norme de nomenclature selon laquelle on nomme les données membres privées telles que '_nomDeLaDonnéeMembre')
                 *  et qu'il n'est pas trouvé dans la clé passé en paramètre, on enlève le '_' ou le préfixe de la clé du tableau (donc si on avait passé un objet stdClass en paramètres
                 *  les clés correspondent aux données membres de l'objet).
                 *
                 *  -   on repasse un couche de sécurité puis on va regarder si la donnée membre à assigner est bien disponible dans le modèle de l'objet que l'on souhaite
                 *  créer (pour ne pas avoir des erreurs du genre 'property doesn't exist'),  c'est à dire dans la donnée protégée _mass_assignment, si $check_assignment
                 *  est à true. Sinon on regarde uniquement la correspondance entre la clé du tableau et les données membres du modèle.
                 * et la
                 *
                 * -    on l'ajoute au tableau que l'on veut construire.
                 *
                 */
                foreach ($args as $key => $value) {
                    if (null !== $prefix) {
                        if (false === strpos($key, $prefix)) {
                            continue;
                        }

                        $key = substr($key, strlen($prefix));
                    }
                    if (0 !== strpos($key, '_') && property_exists($this, $key) && (!$check_assignement || in_array($key, $this->_mass_assignment))) {
                        $this->$key = $value;
                    }
                }
            }
        }
        /*On renvoit l'entité créée*/
        return $this;
    }

    /**
     * Wrapper de populate, mais ici on vient mettre la variable check_assignment à true :
     *
     * Ainsi, on vient regarder lors du test de l'insertion d'une valeur pour une donnée membre si la clé du tableau / la donnée de l'objet stdClass $args
     * correspond bien au nom de la donnée membre du modèle que l'on veut assigner.
     * @param array|stdClass $args
     * @return $this
     */
    public function assign($args, $prefix = null)
    {
        return $this->_populate($args, $prefix, true);
    }

    /**
     * Transforme un modèle en tableau associatif clé => valeur.
     * @@return array
     */
    public function to_array()
    {
        $arr = array();
        $args = get_object_vars($this);
        if ($args && is_array($args)) {
            foreach ($args as $key => $value) {
                if (0 !== strpos($key, '_')) {
                    $arr[$key] = $value;
                }
            }
        }
        return $arr;
    }

    /**
     * Fonctionqui permet de se débarrasser des tests sur l'existence ou non d'un tuple pour voir si l'on fait un update ou
     * un insert.
     * @return bool
     */
    public function save()
    {
        /*
         * Si l'objet que l'on manipule disposes d'une PRIMARY_KEY, c'est que vraisemblablement il provient d'une récupération de la base de donnée.
         * Ainsi, si PRIMARY_KEY est définie, alors on update(), sinon on insert le nouveau tuple.
         */
        if ($this->{$this::PRIMARY_KEY}) {
            return $this->update();
        } else {
            return $this->insert();
        }
    }

    /**
     * Effectue l'insertion d'une entité en BD.
     * @return mixed
     */
    public function insert()
    {
        /*
         * Si la donnée liée à la date de création fait bien partie du modèle et qu'elle n'est pas encore définie,
         * alors on la rajoute sur l'entité que l'on veut insérer.
         * De plus, s'il la donnée liée à la date de dernière modification existe, on lui attribue la date de création
         * (vu qu'il s'agit d'une insertion).
         */
        if (property_exists($this, 'created_at') && !$this->created_at) {
            $this->created_at = date(self::DATETIME_FORMAT);
            if (property_exists($this, 'updated_at')) {
                $this->updated_at = $this->created_at;
            }
        }
        /*
         * On récupère toutes les données membres sous forme de tableau associatif.
         * On s'assure de ne pas pouvoir insérer en BD, un objet qui dispose d'une clé primaire,
         * en faisant un unset si jamais elle est définie.
         */
        $array_values = $this->to_array();
        if ($this::PRIMARY_KEY) {
            unset($array_values[$this::PRIMARY_KEY]);
        }
        //On essaye d'insérer.
        $result = $this->db->insert($this::TABLE, $array_values);
        if ($result && $this::PRIMARY_KEY) {
            //insert_id() : Retourne l'identifiant automatiquement généré utilisé par la dernière requête
            $this->{$this::PRIMARY_KEY} = $this->db->insert_id();
            $result = $this->{$this::PRIMARY_KEY};
        }
        //On renvoit l'id généré par la table.
        return $result;
    }

    /**
     * Fonction permettant de mettre à jour un tuple en BD.
     * @return bool
     */
    public function update()
    {
        //ret détermine le bon déroulement ou non de l'opération de mise à jour d'un tuple.
        $ret = false;
        /*
         *On vérifie que l'objet que l'on veut mettre à jour dispose d'une clé primaire.
         * Si la donnée updated_at existe, alors on lui assigne la date courante..
         */
        if ($this::PRIMARY_KEY) {
            if (property_exists($this, 'updated_at') && !$this->updated_at) {
                $this->updated_at = date(self::DATETIME_FORMAT);
            }
            $array_values = $this->to_array();
            unset($array_values[$this::PRIMARY_KEY]);
            $ret = $this->db->where($this::PRIMARY_KEY, $this->{$this::PRIMARY_KEY})
                ->update($this::TABLE, $array_values);
        }
        // On renvoit le succès ou non de l'opération.
        return $ret;
    }

    /**
     * Permet d'effectuer un delete en BD :
     * - si il n'y pas d'id, alors il s'agit de la délétion de l'objet via lequel l'appel de la méthode a été effectué.
     * - si il y un id renseigné en paramètre, alors on tente de supprimer le tuple qui fait référence en BD.
     * @param null|int $id
     * @return bool
     */
    public function delete($id = null)
    {
        //On regarde que la clé primaire est bien présente sur l'objet que l'on tente de supprimer.
        if ($this::PRIMARY_KEY) {
            /*
             * Si l'on a pas passé d'id en paramètres, et que la clé primaire de l'objet courant
             * n'est pas nulle, alors la variable $id prend la valeur de la clé primaire de l'objet courant
             * afin de pouvoir effectuer un delete propre.
             */
            if ($id === null && $this->{$this::PRIMARY_KEY}) {
                $id = $this->{$this::PRIMARY_KEY};
            }
            if ($id) {
                return $this->db->where($this::PRIMARY_KEY, $id)
                    ->delete($this::TABLE);
            }
        }
        return false;
    }

    /**
     * Récupère toutes les entités disponibles en Base pour un modèle donné.
     * @return mixed
     */
    public function get_all(){
        return $this->db->from($this::TABLE)->get()->result_object();
    }

    /**
     * Fonction magique qui permet au modèle d'appeler une fonction qui n'a pas été déclarée dans ntore modèle.
     *
     * Le premier contient le nom de la méthode que l'on cherche à appeler, le second contient les arguments qu'on lui a passé.
     * @param $name
     * @param $arguments
     * @return DateTime|string
     * @throws Exception
     */
    public function __call($name, $arguments)
    {
        $instance = $this;
        $func_prop = function ($func_name) use ($instance, $name) {
            $str_pos = strpos($name, $func_name);
            if (0 === $str_pos) {
                $property = substr($name, strlen($func_name));
                if (property_exists($instance, $property)) {
                    return $property;
                }
            } else if ((strlen($name) - strlen($func_name)) === $str_pos) {
                $property = substr($name, strlen($func_name));
                if (property_exists($instance, $property)) {
                    return $property;
                }
            }
            return false;
        };
        if ($property = $func_prop('get_date_')) {
            return $this->get_date($this->$property, array_shift($arguments));
        } else if ($property = $func_prop('format_')) {
            return $this->format(array_shift($arguments), $this->get_date($this->$property, array_shift($arguments)));
        }
        throw new Exception(EXCEPTION_CALL_TO_UNDEFINED_FUNCTION_MY_MODEL);
    }

    /**
     * Fonction qui permet d'avoir la date courante.
     * @param string $value
     * @return DateTime
     */
    protected function get_date($value, $format = null)
    {
        /*
         * Si le format n'est pas fourni dans les paramètres alors on créé
         */
        if (!$format) {
            //Si $value s'agit déjà d'une date, alors on renvoit  $value telle quelle.
            if ($value instanceof DateTime) {
                return $value;
            }
            /*
             * Si value à une longueur de 10, il s'agit vraisemblablement d'une date YYYY/mm/dd.
             * On remplace donc la valeur de format par le format des DATES.
             * Sinon, on utilise le format des DATETIME Fournit pour le modèle.
             */
            if (10 == strlen($value)) {
                $format = self::DATE_FORMAT;
            } else {
                $format = self::DATETIME_FORMAT;
            }
        }
        return DateTime::createFromFormat($format, $value);
    }

    /**
     * Fonction de formattage sur une donnée membre qui est déjà de type DateTime. (Utile avant les insertions en BD).
     * @param string   $format
     * @param DateTime $datetime
     * @return string
     */
    protected function format($format, $datetime)
    {
        if ($datetime && $datetime instanceof DateTime) {
            return $datetime->format($format);
        }
        return false;
    }

    /**
     * Permet de faire une jointure avec une entité parente
     *
     * @param string $foreign_key column in parent table
     * @param string $key_id      column in current table
     * @param string $property    property to set
     * @param string $model       model of parent entity
     * @param bool   $force
     *
     * @return mixed
     */
    protected function has_one($foreign_key, $key_id, $property, $model, $force = false)
    {
        if(!isset($this->$property)){
            return $this->db->from(constant($model . '::TABLE'))
                ->where($foreign_key, $this->$key_id)
                ->limit(1)
                ->get()
                ->custom_row_object(0, $model);
        }
        if ((!$this->$property || $force) && $this->$key_id) {
            $this->$property = $this->db->from(constant($model . '::TABLE'))
                ->where($foreign_key, $this->$key_id)
                ->limit(1)
                ->get()
                ->custom_row_object(0, $model);
        }

        return $this->$property ?: null;
    }

    /**
     * Permet de faire une jointure avec une entité parente
     * même fonctionnement que has_one mais gère un cache très utile pour les tables de typage ou label
     *
     * @param string $foreign_key column in parent table
     * @param string $key_id      column in current table
     * @param string $property    property to set
     * @param string $model       model of parent entity
     * @param bool   $force
     *
     * @return mixed
     */
    protected function has_one_of($foreign_key, $key_id, $property, $model, $force = false)
    {
        static $entities = array();

        $model = strtolower($model);

        if (!isset($entities[$model]) || $force) {
            $arr = array();
            $all = $this->$model->all();
            foreach ($all as $row) {
                $arr[$row->$foreign_key] = $row;
            }

            $entities[$model] = $arr;
        }

        if ((!$this->$property || $force) && $this->$key_id) {
            if (isset($entities[$model], $entities[$model][$this->$key_id])) {
                $this->$property = $entities[$model][$this->$key_id];
            }
        }

        return $this->$property;
    }

    /**
     * Permet de faire une jointure avec plusieurs enfants
     *
     * @param string $foreign_key column in parent table
     * @param string $key_id      column in current table
     * @param string $property    property to set
     * @param string $model       model of parent entity
     * @param bool   $force
     *
     * @return mixed
     */
    protected function has_many($foreign_key, $key_id, $property, $model, $force = false)
    {
        if ((!$this->$property || $force) && $this->$key_id) {
            $this->$property = $this->db->from(constant($model . '::TABLE'))
                ->where($foreign_key, $this->$key_id)
                ->get()
                ->custom_result_object($model);
        }

        return $this->$property;
    }

    /**
     * Même fonction qu'un has_many(), mais il s'agit ici d'une relation n*n.
     *
     * Par exemple, on pourra utiliser cette fonction dans cet exemple : récupérer tous les rôles d'un user donné.
     * Pour cette exemple, on a donc 3 tables :
     * - la table 'user'
     * - la table 'user_has_role', qui est composé de deux colonnes. D'une part une clé étrangère qui vaut la clé primaire de user,
     *      et d'autre part, une clé étrangère qui vaut la clé primaire de role.
     * - la table 'role'.
     * La fonction has_many_n_n() permettra ainsi d'aller récupérer tous les roles (cast du role dans un objet correspondant à son modèle!!!!!), associé à un user_id.
     * @param $primary_key
     * @param $model
     * @param $other_table_primary_key
     * @return mixed
     */
    protected function has_many_n_n($primary_key, $model, $other_table_primary_key)
    {
        //Si la clé primaire existe
        if($primary_key){

            /* ============
             * 1ère ETAPE :
             * On va récupérer tous les tuples existants dans la table 'has' (voir exemple au dessus de la signature de la fonction).
             * ============*/
            $allConcernedElementsFromHasTable = $this->db->
            from($this::TABLE.'_has_'.$model::TABLE)->
            where($this::TABLE.'_id',$primary_key)->
            get()->
            custom_result_object($model);
            /*
             * Désormais on vient récupérer toutes les clés primaires pour pouvoir passer à la deuxième étape.
             */
            $allPrimaryKeysOfSearchedTable = array();
            if ($allConcernedElementsFromHasTable){
                //On décompose le résultat de la BD.
                foreach ($allConcernedElementsFromHasTable as $object){
                    array_push($allPrimaryKeysOfSearchedTable,$object->$other_table_primary_key);
                }

                /* ============
                * 2ème ETAPE :
                * On va récupérer tous les tuples existants dans la table avec laquelle on veut communiquer (voir exemple au dessus de la signature de la fonction).
                * ============*/

                // On vient récupérer les entités concernés en base, en les castant dans le modèle approprié.
                $temp = array();
                //On récupère une instance du modèle pour pouvoir faire le cast.
                $classToCast = new $model;
                foreach ($allPrimaryKeysOfSearchedTable as $primaryKey){
                    //On cast dans la classe concernée puis on incrémente le tableau.
                    $currentObject = $this->db->from($model::TABLE)->where($model::PRIMARY_KEY,$primaryKey)->limit(1)->get()->custom_row_object(0,get_class($classToCast));
                    array_push($temp,$currentObject);
                }
                return $temp ? $temp : null;
            }
            return null;
        }
        return null;
    }

    /**
     * Cette fonction permet de réaliser le setter d'un modèle lié à l'entité, pour une donnée membre.
     * Ex:
     *
    J'ai un modèle Salarié, dont l'une des données membres est une foreign_key $id_patron, l'id du modèle Patron correspondant.
    Cette fonction me permet sur un objet Salarié d'aller set le Patron du salarié.

    -- Autre Exemple --
    public function set_customer($customer)
    {
    $this->_set_model_object($customer, 'id', 'client_id', '_customer', Customer_model::class);
    return $this;
    }

     * @param $object
     * @param $key
     * @param $property
     * @param $object_property
     * @param $class
     *
     * @return $this
     */
    protected function _set_model_object($object, $key, $property, $object_property, $class)
    {
        //Si l'objet n'est pas nul
        if ($object) {
            //Si l'objet que l'on souhaite set est bien de la classe renseignée.
            if (get_class($object) == $class) {
                $this->$object_property = $object;
                $this->$property = $object->$key;
            } else {
                if ($object = $this->$class->get($object)) {
                    $this->_set_model_object($object, $key, $property, $object_property, $class);
                }
            }
        }

        return $this;
    }
}