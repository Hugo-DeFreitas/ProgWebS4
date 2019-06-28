/**
 * Classe utilitaire de tout ce qui touche aux utilisateurs : connexion, déconnexion, inscription, etc...
 */
class Connect {
    /**
     * Permet de savoir si l'utilisateur est connecté ou non. On lance cette fonction en arrière plan,
     * et on la vérifie toutes les 15 secondes sur la SPA.
     */
    static isConnected(){
        window.setInterval(()=>{
            $.ajax( {
                url : "User/is_connected/",
                method : 'POST',
            })
                .done(function(response) {
                    //la variable "response" est un bool, renvoyé par le serveur. A la moindre erreur, le serveur renvoie faux.
                    if(response.connection){
                        console.log("L'utilisateur est connecté.");
                    }
                    else {
                        console.log("L'utilisateur n'est pas connecté.");
                        location.reload(true);
                    }
                })
                .fail(function(){
                    alert('Erreur interne critique.');
                });
        }, 15000);
    }

    /**
     * Gestion de l'inscription
     * @param event
     * @param domElement
     */
    static signUp(event,domElement) {
        //On empêche l'envoi du formulaire vers le serveur
        event.preventDefault();
        //On récupère les données du formulaire dans un objet JSON.
        let signUpObject = Connect.transformFormDataIntoObject(domElement);
        let callBackDiv  = $('#callback-sign-up-message');
        if(signUpObject.hasOwnProperty('signUpLogin') && signUpObject['signUpLogin'] === ""){
            callBackDiv.displayAlertInDiv("Votre login unique est nécessaire. Veuillez renseigner le champs.",2000);
        }
        else {
            if(signUpObject.hasOwnProperty('signUpPassword') && signUpObject['signUpPassword'] === ""){
                callBackDiv.displayAlertInDiv("Pour des questions de sécurité, votre password est nécessaire. Veuillez renseigner le champs.",2000);
            }
            else {
                $.ajax( {
                    url : "User/try_inscription/",
                    method : 'POST',
                    data : {
                        signUpData : signUpObject
                    }
                })
                    .done(function(response) {
                        if(response.success){
                            $('#sign-up-modal').modal('hide');
                            location.reload(true);
                        }
                        else {
                            callBackDiv.displayAlertInDiv(response.error,1500);
                        }
                    })
                    .fail(function(){
                        callBackDiv.displayAlertInDiv('Erreur interne. Veuillez contactez un développeur de la plateforme.',1500);
                    });
            }
        }
    }

    /**
     * Gestion de la connexion
     * @param event
     * @param domElement
     */
    static signIn(event,domElement) {
        //On empêche l'envoi du formulaire vers le serveur
        event.preventDefault();
        //On récupère les données du formulaire dans un objet JSON.
        let signInObject = Connect.transformFormDataIntoObject(domElement);
        let callBackDiv  = $('#callback-sign-in-message');
        if(signInObject.hasOwnProperty('signInLogin') && signInObject['signInLogin'] === "") {
            callBackDiv.displayAlertInDiv("Votre login unique est nécessaire. Veuillez renseigner le champs.",2000);
        }
        else {
            if(signInObject.hasOwnProperty('signInPassword') && signInObject['signInPassword'] === "") {
                callBackDiv.displayAlertInDiv("Pour des questions de sécurité, votre password est nécessaire. Veuillez renseigner le champs.",2000);
            }
            else {
                showLoader();
                $.ajax({
                    url : "User/try_connection/" + signInObject.signInLogin + "/" +signInObject.signInPassword,
                    method : 'POST'})
                    .done(function(response) {
                        console.log(response);
                        hideLoader();
                        if(response.connection){
                            $('#sign-in-modal').modal('hide');
                            location.reload(true);
                        }
                        else {
                            callBackDiv.displayAlertInDiv(response.error,1500);
                        }
                    })
                    .fail(function() {
                        displayWarningInDiv('Erreur interne. Veuillez contactez un développeur de la plateforme.',callBackDiv,1500);
                    });
            }
        }
    }

    /**
     * Gestion de la déconnexion
     */
    static logout() {
        return new Promise((resolve, reject) => {
            $.ajax( {
                url : "User/logout/",
                method : 'POST'
            }).done((result) => {
                resolve(result);
                console.log("Déconnexion de l'utilisateur.");
            }).fail(()=>{
                alert('Une erreur est survenue sur le serveur lors de la déconnexion.');
            });
        });
    }

    /**
     * Fonction utilitaire.
     * Renvoie un objet JSON à partir d'un formulaire, qui contiendra la valeur des inputs.
     * @param formData
     */
    static transformFormDataIntoObject(formData){
        console.log(formData);
        let signInObject = {};
        let signInFormData = new FormData(formData);
        for (const [key, value]  of signInFormData.entries()) {
            signInObject[key] = value;
        }
        return signInObject;
    }
}