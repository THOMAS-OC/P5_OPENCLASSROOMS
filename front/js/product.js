let url = new URL(window.location.href); // Récupérer l'url
let id = url.searchParams.get("id"); // Récupérer la valeur de l'attribut id

const elementPicture = document.querySelector(".item__img")
const elementTitle = document.getElementById("title")
const elementDescription = document.getElementById("description")
const elementPrice = document.getElementById("price")
let elementChoiceColors = document.getElementById("colors")
let quantity = document.getElementById("quantity")

const button = document.getElementById("addToCart")

fetch(`http://localhost:3000/api/products/${id}`)
    .then(res => res.json())
    .then(data => {
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
        let nbColors = data.colors.length; // nombres de couleurs
        for (let color of data.colors){
            let newColor = document.createElement("option");
            newColor.value = color;
            newColor.innerText = color
            elementChoiceColors.appendChild(newColor)
          }

        // <option value="vert">vert</option>  
        // let img = document.createElement("img"); // Création d'un élément HTML img

});

console.log(window.localStorage);
// window.localStorage.clear()

button.addEventListener("click", () =>{

    if (elementChoiceColors.value == "" && quantity.value == 0) {
        alert("Veuillez sélectionner une couleur et indiquez un nombre d'article supérieur à 0")
    }

    else if (quantity.value == 0){
        alert("quantité insuffisante");
    }

    else if (elementChoiceColors.value == "") {
        alert("Veuillez sélectionner une couleur")
    }

    else {
        let idUnique = id + " " + elementChoiceColors.value;
        let quantityCommand = quantity.value;
        quantityCommand = parseInt(quantityCommand)
        console.log(quantityCommand);
        console.log(idUnique);
    
        if (window.localStorage.getItem(idUnique)){
            alert("Quantité d'article modifée !")
            let quantityPanier = window.localStorage.getItem(idUnique);
            quantityPanier = parseInt(quantityPanier)
            let newQuantityPanier = quantityPanier + quantityCommand;
            window.localStorage.removeItem(idUnique);
            window.localStorage.setItem(idUnique, newQuantityPanier);
        }

        else {
            alert("Article ajouté au panier !")
            window.localStorage.setItem(idUnique, quantityCommand) // enregistrement d'une data pour la session
        }

    }
 
})