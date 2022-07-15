// import * as URLCONST from "./constantes.js"

const URL_BASE = "http://localhost:3000/";
const ENDPOINT_GET = "api/products/";
const ENDPOINT_POST = "api/products/order/";
// ----- INITIALISATION DU PANIER -----

let myBasket = [] // Variable du panier
let listIdBasket = [] // liste des ientifiants produits

// ! Fonction de rafraichissement du nombre d'articles
const refreshNbArticle = () => {
    let numberArticle = 0

    for (let article of myBasket){
        numberArticle += parseInt(article.quantity)
    }

    if (numberArticle > 1){
        document.getElementById("totalQuantity").innerText = `${numberArticle} articles`
    }

    else {
        document.getElementById("totalQuantity").innerText = `${numberArticle} article`
    }
}

// ! Fonction pour exporter le panier JS dans le storage
const saveCartInStorage = (obj) => {
    window.localStorage.setItem("basket", JSON.stringify(obj))
}

// ! Fonction pour importer le panier du storage vers un objet JavaScript
const exportCartFromStorage = () => {
    let rawCart = window.localStorage.getItem("basket")
    let objectCart = JSON.parse(rawCart)
    return objectCart;
}

if (window.localStorage.getItem("basket")){
    myBasket = exportCartFromStorage()
    refreshNbArticle()
}

else {
    window.localStorage.setItem("basket", JSON.stringify(myBasket))
    refreshNbArticle()
}

// ----- FIN INITIALISATION DU PANIER -----

// ----- ELEMENTS HTML -----
const sectionArticle = document.querySelector("#cart__items");
const articleHTML = document.getElementsByTagName("article")
const buttonSubmit = document.getElementById("order")
const orderForm = document.querySelector(".cart__order")

const firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
const addressErrorMsg = document.getElementById("addressErrorMsg")
const cityErrorMsg = document.getElementById("cityErrorMsg")
const emailErrorMsg = document.getElementById("emailErrorMsg")

const allForm = document.querySelectorAll(".cart__order__form__question")
// ----- FIN ELEMENTS HTML -----

// ----- VARIABLES -----
let contact = {
    firstName : "",
    lastName : "",
    address : "",
    city : "",
    email : "",
}

// ----- FIN VARIABLES -----

// ----- FONCTIONS -----

// ! Fonction pour modifier la quantité d'un article dans le basket
const updateQuantity = (article, newQuantity) => {
    for (let obj of myBasket){
        if(obj.id == article.id && obj.color == article.color){
            obj.quantity = newQuantity
            saveCartInStorage(myBasket)
            refreshNbArticle()
        }
    }
}

// ! Fonctions pour faire une liste des identifiants
const listIds = () => {
    listIdBasket = []
    for (let article of myBasket){
        listIdBasket.push(article.id)
    }
}

listIds()


// ! Fonction d'affichage du formulaire
const displayForm = () => {
    if (localStorage.getItem("basket") == "[]"){
        document.querySelector("h1").innerText = "Votre panier est vide"
        orderForm.style.visibility = "hidden"
        document.querySelector("#cart__items").removeChild(document.querySelector(".cart__item"))
    }

    else {
        orderForm.style.visibility = "visible"
    }
}

displayForm()

// ! Fonction de rafraichissement du prix total
const refreshPrixTotal = () => {
    let priceTotal = 0;
    for (const priceArticle of articleHTML){
        priceTotal = priceTotal + priceArticle.querySelector(".articlePrice").innerText * priceArticle.querySelector(".itemQuantity").value
    }
    document.querySelector("#totalPrice").innerText = priceTotal;
}

// ----- FIN DES FONCTIONS -----

// ----- AFFICHAGE DU PANIER -----

// Création d'un nombre d'articles html égal au nombre d'élément dans le storage
let nbArticles = myBasket.length
let createIndex = 1
while (createIndex < nbArticles){
    createIndex ++
    let cloneArticle = document.querySelector(".cart__item").cloneNode(true)
    sectionArticle.appendChild(cloneArticle)
}

// Requête API pour renseigner les articles
window.setTimeout( () =>{
    // AFFICHAGE DES INFOS
    let index = 0 // variable de l'élément html <article> en cours
    for (const info of myBasket){
        
        fetch(`${URL_BASE}${ENDPOINT_GET}${info.id}`)
        .then(res => res.json())
        .then(data => {
            articleHTML[index].setAttribute("data-id", info.id)
            articleHTML[index].setAttribute("data-color", info.color)
            articleHTML[index].querySelector(".cart__item__content__description").innerHTML = `<h2> ${data.name} <h2> <p> ${info.color} </p> <p> <span class="articlePrice"> ${data.price} </span> € </p>`
            articleHTML[index].querySelector("img").src = data.imageUrl
            articleHTML[index].querySelector(".itemQuantity").value = info.quantity; // quantité de produit
            articleHTML[index].querySelector(".itemQuantity").setAttribute("value", info.quantity) // quantité de produit dans l'attribut
            index ++
            refreshPrixTotal()
        }); 
    }},50
  
)
// ----- FIN AFFICHAGE DU PANIER -----

// ----- GESTION DES EVENEMENTS -----

// event : suppression d'un article
const buttonsDelete = document.querySelectorAll(".deleteItem");
buttonsDelete.forEach((btndelete) => {
    btndelete.addEventListener("click", ()=>{
        let parentButton = btndelete.parentElement.parentElement.parentElement.parentElement
        let idUnique = `${parentButton.getAttribute("data-id")} ${parentButton.getAttribute("data-color")}`
        myBasket = myBasket.filter((item) => item.idUnique !== idUnique)
        btndelete.parentElement.parentElement.parentElement.parentElement.remove();
        saveCartInStorage(myBasket)
        listIds()
        refreshNbArticle()
        refreshPrixTotal()
        displayForm()
    })
})


// event : Modification de quantité d'un article
const quantityItems = document.querySelectorAll(".itemQuantity");

quantityItems.forEach((quantityItem) => {
    quantityItem.addEventListener("change", () => {
        // validation de données
        if (!quantityItem.value || quantityItem.value == 0 || quantityItem.value < 0){
            quantityItem.value = 1
        }

        else if (quantityItem.value > 100) {
            quantityItem.value = 100
            alert("Attention quantité maximum de 100 !")
        }

        else quantityItem.setAttribute("value", quantityItem.value)
        
        // Selection du parent
        let parentQuantity = quantityItem.parentElement.parentElement.parentElement.parentElement;

        // Mise à jour du panier et du storage
        let updateArticle = {
            id : parentQuantity.getAttribute("data-id"),
            color : parentQuantity.getAttribute("data-color"),
            quantity : quantityItem.value
        }
        updateQuantity(updateArticle, updateArticle.quantity)

        // actualisation du prix et du panier
        refreshPrixTotal()
    })
})


// VALIDATION FORM


buttonSubmit.addEventListener("click", (button)=>{
    button.preventDefault()
    let validForm = [];  

    // pour chaque clefs de l'objet contact, on associe la valeur du champs correspondant dans le HTML
    for (const keys of Object.keys(contact)){
        contact[keys] = document.getElementById(keys).value.trim() // propriétés de l'objets et ID Html correspondant nommés identiquement
    }

    let nameRegex = /^[A-Za-zéàè]+$/;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    allForm.forEach((form) => {
        let inputForm = form.querySelector("input")

        // validation du prenom
        if (inputForm.getAttribute("name") == "firstName"){

            if (!contact.firstName || !contact.firstName.match(nameRegex) || contact.firstName.length < 3){
                validForm.push(false)

                if (!contact.firstName || contact.firstName.length < 3) firstNameErrorMsg.innerText = "Veuillez saisir votre prénom svp"
                    
                else if(!contact.firstName.match(nameRegex)) {
                    firstNameErrorMsg.innerText = "Veuillez ne saisir que des lettres dans le champs prénom svp "
                } 
                    
            }

            else {
                validForm.push(true)
                firstNameErrorMsg.innerText = ""
            }
        }

        // validation du nom
        else if (inputForm.getAttribute("name") == "lastName"){

            if (!contact.lastName || !contact.lastName.match(nameRegex)){
                validForm.push(false)

                if (!contact.lastName) lastNameErrorMsg.innerText = "Veuillez saisir votre nom svp";
                
                else lastNameErrorMsg.innerText = "Veuillez ne saisir que des lettres dans le champs nom svp "
                
            }

            else {
                validForm.push(true)
                lastNameErrorMsg.innerText = ""
            } 

        }

        // validation de l'adresse

        else if (inputForm.getAttribute("name") == "address"){

            if (!contact.address){
                validForm.push(false)
                addressErrorMsg.innerText = "Veuillez renseigner votre adresse";
            } 

            else{
                validForm.push(true)
                addressErrorMsg.innerText = ""
            }
            
        }

        // validation de la ville

        else if (inputForm.getAttribute("name") == "city"){
        
            if (!contact.city) {
                validForm.push(false)
                cityErrorMsg.innerText = "Veuillez renseigner une ville";
            } 

            else {
                validForm.push(true)
                cityErrorMsg.innerText = ""
            } 
            
        }

        // Validation de l'email

        else if (inputForm.getAttribute("name") == "email"){

            if (!contact.email || !contact.email.match(emailRegex)){

                validForm.push(false)

                if (!contact.email) emailErrorMsg.innerText = "Veuillez saisir un email svp";
                
                else emailErrorMsg.innerText = "Veuillez saisir un email valide svp"
                
            }

            else {
                validForm.push(true)
                emailErrorMsg.innerText = ""
            }

        }

    })

    contact.lastName = contact.lastName.toUpperCase()
    contact.firstName = contact.firstName.toLowerCase()

    let products = listIdBasket // Affectation des id produits dans la clef attendu par le back-end
    let rawData = JSON.stringify({
        contact,
        products
    });

    // formulaire non valide
    if(validForm.includes(false)){
    }
    
    // Envoie des données au back-end
    else{
        fetch(`${URL_BASE}${ENDPOINT_POST}`, {
            method: "POST",
            body : rawData,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })

        .then(res => {
            console.log(res);

            if (res.ok){
                res.json()
                .then((result) => {
                    console.log(result);
                    location.assign(location.href.replace("cart.html", `confirmation.html?id=${result.orderId}`))
                })
            }

            else {
                alert("Erreur lors de l'envoi des données")
            }
            
        })

        .catch(error => console.log('error', error));
    }

})