import * as URLCONST from "./constantes.js"

const sectionArticles = document.querySelector(".items"); // Selection du parent
fetch(`${URLCONST.URL_BASE}${URLCONST.ENDPOINT_GET}`)
    .then(res => res.json())
    .then(database => {


        for(const data of database){
  
            let newProduct = document.createElement("a"); // Création d'un élément HTML
            newProduct.href = `./product.html?id=${data._id}` // Ajout de l'attribut href
            sectionArticles.appendChild(newProduct); // Ajout de l'élément crée dans le parent
            
            newProduct.innerHTML = 
            `<article> 
                <img src=${data.imageUrl} alt=${data.altTxt}>
                <h3 class="productName"> ${data.name} </h3>
                <p class="productDescription"> ${data.description} </p>
            </article>`

        }

});
