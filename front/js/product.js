import * as URLCONST from "./constantes.js"

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