// import * as URLCONST from "./constantes.js"

// ----- VARIABLES -----
const URL_BASE = "http://localhost:3000/";
const ENDPOINT_GET = "api/products/";
let myBasket = [] // Variable du panier
// ----- FIN VARIABLES -----


// ----- FONCTIONS DU PANIER -----
// ! Fonction pour exporter le panier JS dans le storage
const saveCartInStorage = obj => window.localStorage.setItem("basket", JSON.stringify(obj))

// ! Fonction pour importer le panier du storage vers un objet JavaScript
const exportCartFromStorage = () => {
    let rawData = window.localStorage.getItem("basket")
    let objectData = JSON.parse(rawData)
    return objectData;
}

/* ! Fonction pour ajouter un article au panier? si l'article est déjà présent : Incrémentation de la quantité */
const saveArticle = article => {
    let save = true

    for (let obj of myBasket){

        if(obj.id == article.id && obj.color == article.color){
            alert("Quantité modifiée")
            obj.quantity = parseInt(obj.quantity) + parseInt(article.quantity)
            save = false
            saveCartInStorage(myBasket)
        }
        
    }

    if (save){
        alert("Article ajouté au panier.")
        myBasket.push(article)
        saveCartInStorage(myBasket)
    }

}

// ----- INITIALISATION DU PANIER -----

// Récupération du panier existant
if (window.localStorage.getItem("basket")) myBasket = exportCartFromStorage()

// Création d'un panier
else window.localStorage.setItem("basket", JSON.stringify(myBasket))
// ----- FIN INITIALISATION DU PANIER -----


// ----- ELEMENTS HTML -----
const url = new URL(location.href); // Récupérer l'url
const id = url.searchParams.get("id"); // Récupérer la valeur de l'attribut id

const elementPicture = document.querySelector(".item__img")
const elementTitle = document.getElementById("title")
const elementDescription = document.getElementById("description")
const elementPrice = document.getElementById("price")
const elementChoiceColors = document.getElementById("colors")
const quantity = document.getElementById("quantity")
const button = document.getElementById("addToCart")
// ----- FIN DES ELEMENTS HTML -----


// ----- REQUETE API -----
fetch(`${URL_BASE}${ENDPOINT_GET}${id}`)
.then(res => {

    if (res.ok){

        res.json()
        .then(data => {
            // informations
            elementTitle.innerText = data.name
            elementPrice.innerText = data.price
            elementDescription.innerText = data.description
            quantity.value = 1
            // picture
            let img = document.createElement("a"); // Création d'un élément HTML img
            elementPicture.appendChild(img); // Ajout de l'élément crée dans le parent
            img.outerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`

            //title
            document.title = data.name

            // Add color choice
            for (const color of data.colors){
                let newColor = document.createElement("option");
                newColor.value = color;
                newColor.innerText = color
                elementChoiceColors.appendChild(newColor)
            }
        })
        .catch(err => console.log(err))
    }

    else {
        alert("Désolé, le produit que vous recherchez est introuvables ou n'est plus disponible. Nous allons vous rediriger vers la page d'accueil de Kanap.");
        let newUrl = location.href
        // Suppression des variables d'url puis remplacement de la page produit vers la page index
        newUrl = newUrl.slice(0, newUrl.indexOf("?")).replace("product.html", `index.html`)
        location.assign(newUrl)
    }
})
.catch(err => console.log(err))
// ----- FIN REQUETE API -----


// ----- AJOUT DU PRODUIT AU PANIER -----
button.addEventListener("click", () =>{
    // article du nouveau type de panier
    let newArticle = {
        id : id,
        idUnique : `${id} ${elementChoiceColors.value}` ,
        color : elementChoiceColors.value,
        quantity : parseInt(quantity.value)
    }

   // VERIFICATION DES CHAMPS DE FORMULAIRE
    if (!elementChoiceColors.value) alert("Veuillez sélectionner une couleur")

    else if (!parseInt(quantity.value)) alert("Veuillez saisir un nombre dans le champs 'nombre d'articles' svp");
    
    else if (quantity.value < 1 || quantity.value > 100) alert("Veuillez saisir un nombre entre 1 et 100 dans le champs 'nombre d'articles' svp");
    
    else saveArticle(newArticle)
 
})
// ----- FIN AJOUT DU PRODUIT AU PANIER -----