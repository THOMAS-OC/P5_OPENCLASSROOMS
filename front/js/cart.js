const sectionArticle = document.querySelector("#cart__items");
const articleHTML = document.getElementsByTagName("article")
const buttonSubmit = document.getElementById("order")
let myCart = [];

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

// Consitution d'un tableau du panier

for (let details of Object.keys(localStorage)){
    productArray = [];
    productArray.push(details.split(" ")[0]);
    productArray.push(details.split(" ")[1]);
    productArray.push(localStorage.getItem(details));
    myCart.push(productArray);
}

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
    })
})

//Récupérer les info de l'utilisateur

let contact = {
    firstName : "",
    lastName : "",
    address : "",
    city : "",
    email : "",
}

let contactExample = {
    firstName : "Thomas",
    lastName : "ESTIVAL",
    address : "1496",
    city : "St maximin",
    email : "estival.t@hotmail.com",
}

let Products = ["choco", "Vanille"]

console.log(JSON.stringify({
    contact: {
        firstName : "Thomas",
        lastName : "ESTIVAL",
        address : "1496",
        city : "St maximin",
        email : "estival.t@hotmail.com",
    },
    products: ["choco", "Vanille"]
}));

buttonSubmit.addEventListener("click", ()=>{

    // pour chaque clefs de l'objet contact, on associe la valeur du champs correspondant dans le HTML
    for (let keys of Object.keys(contact)){
        contact[keys] = document.getElementById(keys).value // propriétés de l'objets et ID Html correspondant nommés identiquement
    }
    console.log(contact);
    contact = JSON.stringify(contactExample)
    console.log(contact);
    let urlOrder = "http://localhost:3000/api/products/order"
      
    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            contact: {
                firstName : "Thomas",
                lastName : "ESTIVAL",
                address : "1496",
                city : "St maximin",
                email : "estival.t@hotmail.com",
            },
            products: ["choco", "Vanille"]
        })

      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })


    // Envoie des data au backend
    // fetch(urlOrder,{
    //     method : "POST",
    //     body : contact,
    //     headers : {
    //         "Content-Type" : "application/json"
    //     },
    // } )

})