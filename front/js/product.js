const url = new URL(location.href); // Récupérer l'url
const id = url.searchParams.get("id"); // Récupérer la valeur de l'attribut id

const elementPicture = document.querySelector(".item__img")
const elementTitle = document.getElementById("title")
const elementDescription = document.getElementById("description")
const elementPrice = document.getElementById("price")
const elementChoiceColors = document.getElementById("colors")
const quantity = document.getElementById("quantity")
const button = document.getElementById("addToCart")

fetch(`http://localhost:3000/api/products/${id}`)
.then( rep => 
    {
        if (rep.ok === true) 
            rep.json()
            .then(data => {
                console.log(data);
                // informations
                elementTitle.innerText = data.name
                elementPrice.innerText = data.price
                elementDescription.innerText = data.description
                
                // picture
                let img = document.createElement("img"); // Création d'un élément HTML img
                img.src = data.imageUrl;
                img.alt = data.altTxt;
                elementPicture.appendChild(img); // Ajout de l'élément crée dans le parent

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
            console.log(location.href);
            console.log(location.href.indexOf("html/"))
            let urlRedirect = location.href.slice(0, location.href.indexOf("html/") + 4)
            urlRedirect = urlRedirect + "/index.html"
            console.log(urlRedirect);
            location.assign(urlRedirect);

        }
    }
);




button.addEventListener("click", () =>{

   
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
        let quantityCommand = quantity.value;
        quantityCommand = parseInt(quantityCommand)
        console.log(quantityCommand);
        console.log(idUnique);
    
        if (localStorage.getItem(idUnique)){
            alert("Quantité d'article modifée !")
            let quantityPanier = localStorage.getItem(idUnique);
            quantityPanier = parseInt(quantityPanier)
            let newQuantityPanier = quantityPanier + quantityCommand;
            localStorage.removeItem(idUnique);
            localStorage.setItem(idUnique, newQuantityPanier);
        }

        else {
            alert("Article ajouté au panier !")
            localStorage.setItem(idUnique, quantityCommand) // enregistrement d'une data pour la session
        }

    }
 
})