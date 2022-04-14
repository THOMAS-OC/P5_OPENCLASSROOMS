


console.log(window.localStorage); // C'EST UN OBJET
console.log(Object.keys(window.localStorage)); // liste des clefs du storage
let listIdArticleWithColors = Object.keys(window.localStorage)
let listIdArticle = []
for (let idArticle of listIdArticleWithColors){
    console.log(idArticle.split(" "));
    listIdArticle.push(idArticle.split(" ")[0])
}
console.log(listIdArticle);

// Création d'un nombre d'articles html égal au nombre d'élément dans le storage
nbArticles = window.localStorage.length
createIndex = 1
const sectionArticle = document.querySelector("#cart__items");
while (createIndex < nbArticles){
    createIndex = createIndex + 1
    let cloneArticle = document.querySelector(".cart__item").cloneNode(true)
    sectionArticle.appendChild(cloneArticle)
}

/* 
On parcours les identifiants des articles enregistrés
pour chaque identifiant on travaille dans l'élément html article suivant,
on insère le nom du produit, l'image de l'article, la couleur, le prix et la quantité
*/

let i = 0

for (let articlePanier of Object.values(window.localStorage)){

    console.log(articlePanier);

    const articleHTML = document.getElementsByTagName("article")

    articleHTML[i].querySelector("input").value = articlePanier;

    i ++

}
