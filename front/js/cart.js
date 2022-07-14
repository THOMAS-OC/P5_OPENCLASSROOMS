import * as URLCONST from "./constantes.js"
let myBasket = [] // Variable du panier
let listIdBasket = []
// NOUVEAU PANIER

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

// !!------- Fonction pour modifier la quantité d'un article dans le basket
const updateQuantity = (article, newQuantity) => {
    for (let obj of myBasket){
        if(obj.id == article.id && obj.color == article.color){
            console.log("Modif des quantités");
            obj.quantity = newQuantity
            saveCartInStorage(myBasket)
        }
    }
}



// INITIALISATION DU PANIER

if (window.localStorage.getItem("basket")){
    myBasket = exportCartFromStorage()
}

else {
    window.localStorage.setItem("basket", JSON.stringify(myBasket))
}

// Fonctions pour faire une liste des identifiants
const listIds = () => {
    listIdBasket = []
    for (let article of myBasket){
        listIdBasket.push(article.id)
    }
}

listIds()


// ELEMENTS HTML
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

let contactForm = {
    firstName : "",
    lastName : "",
    address : "",
    city : "",
    email : "",
}

// Fonction d'affichage du formulaire
const displayForm = () => {

    if (localStorage.getItem("basket") == "[]"){
        document.querySelector("h1").innerText = "Votre panier est vide"
        document.querySelector("#cart__items").removeChild(document.querySelector(".cart__item"))
        orderForm.style.visibility = "hidden"
        
    }

    else {
        orderForm.style.visibility = "visible"
    }

    // Affichage du formulaire et du titre

}

displayForm()


// Fonction de rafraichissement du nombre d'articles


// Fonction de rafraichissement du prix total
const refreshPrixTotal = () => {
    let priceTotal = 0;
    for (const priceArticle of articleHTML){
        priceTotal = priceTotal + priceArticle.querySelector(".articlePrice").innerText * priceArticle.querySelector(".itemQuantity").value
    }
    document.querySelector("#totalPrice").innerText = priceTotal;
}


// Création d'un nombre d'articles html égal au nombre d'élément dans le storage
let nbArticles = myBasket.length
let createIndex = 1
while (createIndex < nbArticles){
    createIndex ++
    let cloneArticle = document.querySelector(".cart__item").cloneNode(true)
    sectionArticle.appendChild(cloneArticle)
}

window.setTimeout( () =>{
    // AFFICHAGE DES INFOS
    let index = 0 // variable de l'élément html "article" en cours !
    for (const info of myBasket){
        
        fetch(`${URLCONST.URL_BASE}${URLCONST.ENDPOINT_GET}${info.id}`)
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
    }},100
  
)



// Gérer la suppression d'un élément
const buttonsDelete = document.querySelectorAll(".deleteItem");
buttonsDelete.forEach((btndelete) => {
    btndelete.addEventListener("click", ()=>{
        let parentButton = btndelete.parentElement.parentElement.parentElement.parentElement
        let idUnique = `${parentButton.getAttribute("data-id")} ${parentButton.getAttribute("data-color")}`
        console.log(myBasket);
        myBasket = myBasket.filter((item) => item.idUnique !== idUnique)
        saveCartInStorage(myBasket)
        btndelete.parentElement.parentElement.parentElement.parentElement.remove();
        refreshPrixTotal()
        displayForm()
    })
})


// Gérer la modification de quantité d'un article
const quantityItems = document.querySelectorAll(".itemQuantity");

quantityItems.forEach((quantityItem) => {
    quantityItem.addEventListener("change", () => {

        if (!quantityItem.value || quantityItem.value == 0 || quantityItem.value < 0){
            quantityItem.value = 1
        }

        else if (quantityItem.value > 100) {
            quantityItem.value = 100
            alert("Attention quantité maximum de 100 !")
        }

        else {
            quantityItem.setAttribute("value", quantityItem.value)
        }
        
        let parentQuantity = quantityItem.parentElement.parentElement.parentElement.parentElement;
        let idChange = `${parentQuantity.getAttribute("data-id")} ${parentQuantity.getAttribute("data-color")}`

        // MODIFICATION DANS LE NOUVEAU PANIER
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

    // pour chaque clefs de l'objet contactForm, on associe la valeur du champs correspondant dans le HTML
    for (const keys of Object.keys(contactForm)){
        contactForm[keys] = document.getElementById(keys).value.trim() // propriétés de l'objets et ID Html correspondant nommés identiquement
    }

    contactForm.lastName = contactForm.lastName.toUpperCase()
    contactForm.firstName = contactForm.firstName.toLowerCase()
    
    let nameRegex = /^[A-Za-zéàè]+$/;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    allForm.forEach((form) => {
        let inputForm = form.querySelector("input")
        console.log(inputForm.getAttribute("name"));

        // validation du prenom
        if (inputForm.getAttribute("name") == "firstName"){

            if (!contactForm.firstName || !contactForm.firstName.match(nameRegex)){
                validForm.push(false)

                if (!contactForm.firstName) firstNameErrorMsg.innerText = "Veuillez saisir votre prénom svp"
                    
                else firstNameErrorMsg.innerText = "Veuillez ne saisir que des lettres dans le champs prénom svp "
                    
            }

            else{
                validForm.push(true)
            }

        }

        // validation du nom
        else if (inputForm.getAttribute("name") == "lastName"){

            if (!contactForm.lastName || !contactForm.lastName.match(nameRegex)){
                validForm.push(false)

                if (!contactForm.lastName) lastNameErrorMsg.innerHTML = "Veuillez saisir votre nom svp";
                
                else lastNameErrorMsg.innerText = "Veuillez ne saisir que des lettres dans le champs nom svp "
                
            }

            else{
                validForm.push(true)
            }

        }

        // validation de l'adresse

        else if (inputForm.getAttribute("name") == "address"){

            if (!contactForm.address){
                validForm.push(false)
                addressErrorMsg.innerText = "Veuillez renseigner votre adresse";
            } 

            else{
                validForm.push(true)
            }

        }

        // validation de la ville

        else if (inputForm.getAttribute("name") == "city"){
        
            if (!contactForm.city) {
                validForm.push(false)
                cityErrorMsg.innerText = "Veuillez renseigner une ville";
            } 

            else{
                validForm.push(true)
            }

        }

        // Validation de l'email

        else if (inputForm.getAttribute("name") == "email"){

            if (!contactForm.email || !contactForm.email.match(emailRegex)){

                validForm.push(false)

                if (!contactForm.email) emailErrorMsg.innerHTML = "Veuillez saisir un email svp";
                
                else emailErrorMsg.innerText = "Veuillez saisir un email valide svp"
                
            }

            else{
                validForm.push(true)
            }

        }

    })

    // Paramétrage de la requete post
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let products = listIdBasket // Affectation des id produits dans la clef attendu par le back-end
    let rawData = JSON.stringify({
        contactForm,
        products
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: rawData,
        redirect: 'follow'
    };

    // formulaire non valide

    if(validForm.includes(false)){
    }

    // Envoie des données au back-end
    else{
        
        fetch(`${URLCONST.URL_BASE}${URLCONST.ENDPOINT_POST}`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            location.assign(location.href.replace("cart.html", `confirmation.html?id=${result.orderId}`))
        })
        .catch(error => console.log('error', error));
        
    }

})