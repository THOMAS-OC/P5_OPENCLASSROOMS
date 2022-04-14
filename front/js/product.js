let url = new URL(window.location.href); // Récupérer l'url
let id = url.searchParams.get("id"); // Récupérer la valeur de l'attribut id

const elementPicture = document.querySelector(".item__img")
const elementTitle = document.getElementById("title")
const elementDescription = document.getElementById("description")
const elementPrice = document.getElementById("price")
const elementChoiceColors = document.getElementById("colors")


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

