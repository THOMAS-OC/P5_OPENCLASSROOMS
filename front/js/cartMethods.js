import * as URLCONST from "./constantes.js"

const sectionArticle = document.querySelector("#cart__items");
const articleHTML = document.getElementsByTagName("article")
const buttonSubmit = document.getElementById("order")
const orderForm = document.querySelector(".cart__order")

let myCart = [];
let listIdCart = []

// Fonction d'affichage du formulaire
const displayForm = () => {
    orderForm.style.visibility = localStorage ? "hidden":"visible"
}
displayForm()


// Fonction de rafraichissement du nombre d'articles
const refreshNbArticles = () => {
    let nbArticle = localStorage.length;
    let ifPlural = nbArticle > 1 ? "s":"";
    document.querySelector("#totalQuantity").innerText = `${nbArticle} article${ifPlural}`;
}

// Fonction de rafraichissement du prix total
const refreshPrixTotal = () => {
    let priceTotal = 0;
    for (const priceArticle of articleHTML){
        priceTotal = priceTotal + priceArticle.querySelector(".articlePrice").innerText * priceArticle.querySelector(".itemQuantity").value
    }
    document.querySelector("#totalPrice").innerText = priceTotal;
}

// Fonction de rafraichissement du panier JavaScript
const refreshArrayCart = () => {
    myCart = []
    listIdCart = []
    for (const details of Object.keys(localStorage)){
        let productArray = [];
        productArray.push(details.split(" ")[0]);
        listIdCart.push(details.split(" ")[0]);
        productArray.push(details.split(" ")[1]);
        productArray.push(localStorage.getItem(details));
        myCart.push(productArray);
    }
}

refreshArrayCart()
console.log(myCart);

// Gérer la suppression d'un élément
const buttonsDelete = document.querySelectorAll(".deleteItem");
buttonsDelete.forEach((btndelete) => {
    btndelete.addEventListener("click", ()=>{
        alert("test")
        let parentButton = btndelete.parentElement.parentElement.parentElement.parentElement
        let idDelete = `${parentButton.getAttribute("data-id")} ${parentButton.getAttribute("data-color")}`
        localStorage.removeItem(idDelete)
        btndelete.parentElement.parentElement.parentElement.parentElement.remove();
        refreshNbArticles()
        refreshPrixTotal()
        refreshArrayCart()
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

        // Actualisation du storage
        localStorage.setItem(idChange, quantityItem.value)

        // actualisation du prix et du panier
        refreshPrixTotal()
        refreshArrayCart()
    })
})

// Récupérer les info de l'utilisateur

let contact = {
    firstName : "",
    lastName : "",
    address : "",
    city : "",
    email : "",
}

// VALIDATION FORM
buttonSubmit.addEventListener("click", (button)=>{
    button.preventDefault()
    let validForm = false;  

    // pour chaque clefs de l'objet contact, on associe la valeur du champs correspondant dans le HTML
    for (const keys of Object.keys(contact)){
        contact[keys] = document.getElementById(keys).value.trim() // propriétés de l'objets et ID Html correspondant nommés identiquement
    }

    contact.lastName = contact.lastName.toUpperCase()
    contact.firstName = contact.firstName.toLowerCase()
    
    let nameRegex = /^[A-Za-zéàè]+$/;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Validation du nom de famille

    if (!contact.lastName || !contact.lastName.match(nameRegex)){
        if (!contact.lastName){
            alert("Veuillez saisir votre nom svp ")
        }
        else {
            alert("Veuillez ne saisir que des lettres dans le champs nom svp ")
        }
    }

    // Validation du prenom

    else if (!contact.firstName || !contact.firstName.match(nameRegex)){
        if (!contact.firstName){
            alert("Veuillez saisir votre prénom svp ")
        }
        else {
            alert("Veuillez ne saisir que des lettres dans le champs prénom svp ")
        }
    }

    // VALIDATION DE l'EMAIL

    else if (!contact.email || !contact.email.match(emailRegex)){
        if (!contact.email){
            alert("Veuillez saisir votre email svp ")
        }
        else {
            alert("Veuillez saisir une adresse email valide svp ")
        }
    }


    else if (!contact.city){
        alert("Veuillez renseigner une ville")
    }
    
    else if (!contact.address){
        alert("Veuillez renseigner votre adresse")
    }

    else {
        validForm = true;
    }

    
    // Paramétrage de la requete post
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let products = listIdCart // Affectation des id produits dans la clef attendu par le back-end
    let rawData = JSON.stringify({
        contact,
        products
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: rawData,
        redirect: 'follow'
    };

    // Envoie des données au back-end
    if (validForm){
        fetch(`${URLCONST.URL_BASE}${URLCONST.ENDPOINT_POST}`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            location.assign(location.href.replace("cart.html", `confirmation.html?id=${result.orderId}`))
        })
        .catch(error => console.log('error', error));
    }


})