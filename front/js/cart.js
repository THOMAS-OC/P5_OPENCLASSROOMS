let articleHTML = document.getElementsByTagName("article")
console.log(document.querySelector(".articlePrice").innerText);

// Fonction de rafraichissement du nombre d'articles
function refreshNbArticles() {
    let nbArticles = window.localStorage.length;
    let pluriel = nbArticles > 1 ? "s":"";
    document.querySelector("#totalQuantity").innerText = `${nbArticles} article${pluriel}`;
}

// Fonction de rafraichissement du prix total
function refreshPrixTotal() {
    let priceTotal = 0;

    for (let priceArticle of articleHTML){

        console.log(priceArticle.querySelector(".articlePrice").innerText);
        console.log(priceArticle.querySelector(".itemQuantity").value);

        priceTotal = priceTotal + priceArticle.querySelector(".articlePrice").innerText * priceArticle.querySelector(".itemQuantity").value
    }

    console.log(priceTotal);
    document.querySelector("#totalPrice").innerText = priceTotal;
}

// Consitution d'un tableau du panier
console.log(localStorage);
let myCart = [];

for (let details of Object.keys(window.localStorage)){
    productArray = [];
    productArray.push(details.split(" ")[0]);
    productArray.push(details.split(" ")[1]);
    productArray.push(window.localStorage.getItem(details));
    myCart.push(productArray);
}

// On génère autant d'article html que le panier en contient

// Création d'un nombre d'articles html égal au nombre d'élément dans le storage
nbArticles = window.localStorage.length
createIndex = 1
const sectionArticle = document.querySelector("#cart__items");
while (createIndex < nbArticles){
    createIndex = createIndex + 1
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
        articleHTML[i].querySelector(".cart__item__content__description").innerHTML = `<h2> ${data.name} <h2> <p> ${info[1]} </p> <p class="articlePrice"> ${data.price} </p>`
        articleHTML[i].querySelector("img").src = data.imageUrl
        articleHTML[i].querySelector(".itemQuantity").value = info[2]; // quantité de produit
        articleHTML[i].querySelector(".itemQuantity").setAttribute("value", info[2]) // quantité de produit dans l'attribut
        articleHTML[i].style.display = "flex";
        i ++
    });
}

// Gérer la suppression d'un élément
const buttonsDelete = document.querySelectorAll(".deleteItem");
buttonsDelete.forEach((btndelete) => {
    btndelete.addEventListener("click", ()=>{
        parentButton = btndelete.parentElement.parentElement.parentElement.parentElement
        idDelete = parentButton.getAttribute("data-id") + " " + parentButton.getAttribute("data-color")
        window.localStorage.removeItem(idDelete)
        btndelete.parentElement.parentElement.parentElement.parentElement.remove();
        refreshNbArticles()
        refreshPrixTotal()
    })
})

// Gérer la modification de quantité d'un article
const quantityItems = document.querySelectorAll(".itemQuantity");
quantityItems.forEach((quantityItem) => {
    quantityItem.addEventListener("change", () => {
        parentQuantity = quantityItem.parentElement.parentElement.parentElement.parentElement;
        idChange = parentQuantity.getAttribute("data-id") + " " + parentQuantity.getAttribute("data-color")
        console.log(idChange);
        quantityItem.setAttribute("value", quantityItem.value) // modification dans le DOM
        window.localStorage.setItem(idChange, quantityItem.value)
        console.log(localStorage);
        refreshPrixTotal()
    })
})

// Afficher le prix total