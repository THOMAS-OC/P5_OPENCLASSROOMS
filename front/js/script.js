let counter = 0
const sectionArticles = document.querySelector(".items"); // Selection du parent

fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(data => {

        while(counter < data.length){
  
            let newProduct = document.createElement("a"); // Création d'un élément HTML
            newProduct.href = `./product.html?id=${data[counter]._id}` // Ajout de l'attribut href
            sectionArticles.appendChild(newProduct); // Ajout de l'élément crée dans le parent
            
            let article = document.createElement("article");
            newProduct.appendChild(article);
            
            let articlePicture = document.createElement("img");
            articlePicture.src = data[counter].imageUrl
            articlePicture.alt = data[counter].altTxt
            
            let articleTitle = document.createElement("h3");
            articleTitle.className = "productName";
            articleTitle.innerText = data[counter].name
            
            let articleDescription = document.createElement("p");
            articleDescription.className = "productDescription";
            articleDescription.innerText = data[counter].description
            
            article.appendChild(articlePicture)
            article.appendChild(articleTitle)
            article.appendChild(articleDescription)
            counter ++

        }

});
