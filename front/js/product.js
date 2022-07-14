import * as URLCONST from "./constantes.js"
let myBasket = [] // Variable du panier

// ----- FUNCTIONS BASKET

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

/* ! Fonction pour ajouter un article au panier si l'article est déjà présent, incrémentation de la quantité */

const pushArticle = (article) => {
    let method = "push"

    for (let obj of myBasket){

        if(obj.id == article.id && obj.color == article.color){
            alert("Modification des quantités")
            obj.quantity = parseInt(obj.quantity) + parseInt(article.quantity)
            method = "notPush"
            saveCartInStorage(myBasket)
        }
        
    }

    if (method == "push"){
        alert("Nouvel article")
        myBasket.push(article)
        saveCartInStorage(myBasket)
    }

}


// Si panier existant
if (window.localStorage.getItem("basket")){
    myBasket = exportCartFromStorage()
}

else {
    window.localStorage.setItem("basket", JSON.stringify(myBasket))
}




const url = new URL(location.href); // Récupérer l'url
const id = url.searchParams.get("id"); // Récupérer la valeur de l'attribut id

const elementPicture = document.querySelector(".item__img")
const elementTitle = document.getElementById("title")
const elementDescription = document.getElementById("description")
const elementPrice = document.getElementById("price")
const elementChoiceColors = document.getElementById("colors")
const quantity = document.getElementById("quantity")
const button = document.getElementById("addToCart")


fetch(`${URLCONST.URL_BASE}${URLCONST.ENDPOINT_GET}${id}`)
.then( rep => 
    {
        if (rep.ok === true)
            rep.json()
            .then(data => {
                // informations
                elementTitle.innerText = data.name
                elementPrice.innerText = data.price
                elementDescription.innerText = data.description
                
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
        });
        else {
            alert("Le produit est introuvable, nous vous redirigeons vers la page d'accueil");
            let urlRedirect = location.href.slice(0, location.href.indexOf("html/") + 4)
            urlRedirect = urlRedirect + "/index.html"
            location.assign(urlRedirect);

        }
    }
);

button.addEventListener("click", () =>{
    // article du nouveau type de panier
    let newArticle = {
        id : id,
        idUnique : `${id} ${elementChoiceColors.value}` ,
        color : elementChoiceColors.value,
        quantity : parseInt(quantity.value)
    }


   // VERIFICATION DES CHAMPS DE FORMULAIRE
    if (!elementChoiceColors.value) {
        alert("Veuillez sélectionner une couleur")
    }

    else if (!parseInt(quantity.value)){
        alert("Veuillez saisir un nombre dans le champs 'nombre d'articles' svp");
    }

    else if (quantity.value < 1 || quantity.value > 100){
        alert("Veuillez saisir un nombre entre 1 et 100 dans le champs 'nombre d'articles' svp");
    }

    else {

        // push vers le nouveau type de panier
        pushArticle(newArticle)

        let idUnique = `${id} ${elementChoiceColors.value}`

        // MODIFICATION DES QUANITTES
        if (localStorage.getItem(idUnique)){
            localStorage.setItem(idUnique, parseInt(localStorage.getItem(idUnique)) + parseInt(quantity.value));
            alert("Quantité d'article modifiée ! quantité totale = " + localStorage.getItem(idUnique))
        }
        
        // AJOUT DE l'ARTICLE AU PANIER
        else {
            localStorage.setItem(idUnique, parseInt(quantity.value))
            alert("Article ajouté au panier !")
        }

    }
 
})