

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
        const articleHTML = document.getElementsByTagName("article")
        // data.price; // prix de l'article
        articleHTML[i].querySelector("h2").innerText = data.name
        // data.imageUrl // url de l'image

        // console.log(info[1]); // Couleur du produit
        // console.log(info[2]); // quantité de produit
        articleHTML[i].querySelector("input").value = info[2]; // quantité de produit
        i ++
    });
}





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
