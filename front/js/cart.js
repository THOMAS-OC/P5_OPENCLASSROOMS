

// Consitution d'un tableau du panier
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

// On requête l'API pour obtenir les infos
let i = 0 // variable de l'élément html "article" en cours !
for (let info of myCart){
    console.log(info[0]);

    fetch(`http://localhost:3000/api/products/${info[0]}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        let articleHTML = document.getElementsByTagName("article")
        articleHTML[i].querySelector(".cart__item__content__description").innerHTML = `<h2> ${data.name} <h2> <p> ${info[1]} </p> <p> ${data.price}€ </p>`
        articleHTML[i].querySelector("img").src = data.imageUrl
        articleHTML[i].querySelector("input").value = info[2]; // quantité de produit
        i ++
    });
}

// Gérer la suppression d'un élément
const buttonsDelete = document.querySelectorAll(".deleteItem");
buttonsDelete.forEach((btndelete) => {
    btndelete.addEventListener("click", ()=>{
        btndelete.parentElement.parentElement.parentElement.parentElement.remove();
    })
})



// /* 
// On parcours les identifiants des articles enregistrés
// pour chaque identifiant on travaille dans l'élément html article suivant,
// on insère le nom du produit, l'image de l'article, la couleur, le prix et la quantité
// */

// let i = 0

// for (let articlePanier of Object.values(window.localStorage)){

//     console.log(articlePanier);

//     const articleHTML = document.getElementsByTagName("article")

//     articleHTML[i].querySelector("input").value = articlePanier;

//     i ++

// }
