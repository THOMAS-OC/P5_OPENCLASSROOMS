const sectionArticle = document.querySelector("#cart__items");
const articleHTML = document.getElementsByTagName("article")
const buttonSubmit = document.getElementById("order")
let myCart = [];
let listIdCart = []

// Fonction de rafraichissement du nombre d'articles
function refreshNbArticles() {
    let nbArticle = localStorage.length;
    let ifPlural = nbArticle > 1 ? "s":"";
    document.querySelector("#totalQuantity").innerText = `${nbArticle} article${ifPlural}`;
}

// Price total refresh function
function refreshPrixTotal() {
    let priceTotal = 0;
    for (let priceArticle of articleHTML){
        priceTotal = priceTotal + priceArticle.querySelector(".articlePrice").innerText * priceArticle.querySelector(".itemQuantity").value
    }
    document.querySelector("#totalPrice").innerText = priceTotal;
}

// Fonction de rafraichissement du tableau
function refreshArrayCart(){
    myCart = []
    listIdCart = []
    for (let details of Object.keys(localStorage)){
        productArray = [];
        productArray.push(details.split(" ")[0]);
        listIdCart.push(details.split(" ")[0]);
        productArray.push(details.split(" ")[1]);
        productArray.push(localStorage.getItem(details));
        myCart.push(productArray);
    }
}

refreshArrayCart()

// Création d'un nombre d'articles html égal au nombre d'élément dans le storage
nbArticles = localStorage.length
createIndex = 1
while (createIndex < nbArticles){
    createIndex ++
    let cloneArticle = document.querySelector(".cart__item").cloneNode(true)
    sectionArticle.appendChild(cloneArticle)
}
refreshNbArticles()

// On requête l'API pour obtenir les infos
let i = 0 // variable de l'élément html "article" en cours !
for (let info of myCart){
    
    fetch(`http://localhost:3000/api/products/${info[0]}`)
    .then(res => res.json())
    .then(data => {
        articleHTML[i].setAttribute("data-id", info[0])
        articleHTML[i].setAttribute("data-color", info[1])
        articleHTML[i].querySelector(".cart__item__content__description").innerHTML = `<h2> ${data.name} <h2> <p> ${info[1]} </p> <p> <span class="articlePrice"> ${data.price} </span> € </p>`
        articleHTML[i].querySelector("img").src = data.imageUrl
        articleHTML[i].querySelector(".itemQuantity").value = info[2]; // quantité de produit
        articleHTML[i].querySelector(".itemQuantity").setAttribute("value", info[2]) // quantité de produit dans l'attribut
        articleHTML[i].style.display = "flex";
        i ++
        refreshPrixTotal()
    });
}

const buttonsDelete = document.querySelectorAll(".deleteItem");

// Gérer la suppression d'un élément
buttonsDelete.forEach((btndelete) => {
    btndelete.addEventListener("click", ()=>{
        parentButton = btndelete.parentElement.parentElement.parentElement.parentElement
        idDelete = `${parentButton.getAttribute("data-id")} ${parentButton.getAttribute("data-color")}`
        localStorage.removeItem(idDelete)
        btndelete.parentElement.parentElement.parentElement.parentElement.remove();
        refreshNbArticles()
        refreshPrixTotal()
        refreshArrayCart()
    })
})

const quantityItems = document.querySelectorAll(".itemQuantity");

// Gérer la modification de quantité d'un article
quantityItems.forEach((quantityItem) => {
    quantityItem.addEventListener("change", () => {
        parentQuantity = quantityItem.parentElement.parentElement.parentElement.parentElement;
        idChange = `${parentQuantity.getAttribute("data-id")} ${parentQuantity.getAttribute("data-color")}`
        quantityItem.setAttribute("value", quantityItem.value)
        localStorage.setItem(idChange, quantityItem.value)
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

let products = listIdCart

// VALIDATION FORM


buttonSubmit.addEventListener("click", (button)=>{
    button.preventDefault()
    validForm = false;

    // pour chaque clefs de l'objet contact, on associe la valeur du champs correspondant dans le HTML
    for (let keys of Object.keys(contact)){
        contact[keys] = document.getElementById(keys).value.trim() // propriétés de l'objets et ID Html correspondant nommés identiquement
    }

    let nameRegex = /^[A-Za-z]+$/;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let cityRegex = "";

    console.log(contact.lastName);

    if (!contact.lastName.match(nameRegex)){
        alert("Veuillez saisir nom svp ")
    }
    else if (!contact.firstName.match(nameRegex)){
        alert("Veuillez saisir prenom svp ")
    }
    else if (!contact.email.match(emailRegex)) {
        alert("Veuillez saisir une adresse email valide svp !")
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
    
    contact.lastName = contact.lastName.toUpperCase()
    contact.firstName = contact.firstName.toLowerCase()
    

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

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

    if (validForm){

        fetch("http://localhost:3000/api/products/order", requestOptions)
        .then(response => response.json())
        .then((result) => {
            location.assign(location.href.replace("cart.html", `confirmation.html?id=${result.orderId}`))
        })
        .catch(error => console.log('error', error));

    }


})