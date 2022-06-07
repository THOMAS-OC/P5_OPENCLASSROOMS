const sectionArticles = document.querySelector(".items"); // Selection du parent

fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(database => {


        for(const data of database){
  
            let newProduct = document.createElement("a"); // Création d'un élément HTML
            newProduct.href = `./product.html?id=${data._id}` // Ajout de l'attribut href
            sectionArticles.appendChild(newProduct); // Ajout de l'élément crée dans le parent
            
            let article = document.createElement("article");
            newProduct.appendChild(article);
            
            let articlePicture = document.createElement("img");
            articlePicture.src = data.imageUrl
            articlePicture.alt = data.altTxt
            
            let articleTitle = document.createElement("h3");
            articleTitle.className = "productName";
            articleTitle.innerText = data.name
            
            let articleDescription = document.createElement("p");
            articleDescription.className = "productDescription";
            articleDescription.innerText = data.description
            
            article.appendChild(articlePicture)
            article.appendChild(articleTitle)
            article.appendChild(articleDescription)

        }

});
