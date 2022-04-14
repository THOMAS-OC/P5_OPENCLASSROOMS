let j = 0

fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(data => {
        console.log(data);
        console.log(data.length);

        while(j < data.length){
  
            const sectionArticles = document.querySelector(".items"); // Selection du parent
            let newProduct = document.createElement("a"); // Création d'un élément HTML
            newProduct.href = "www.google.fr" // Ajout de l'attribut href
            sectionArticles.appendChild(newProduct); // Ajout de l'élément crée dans le parent
            
            let article = document.createElement("article");
            newProduct.appendChild(article);
            
            let articlePicture = document.createElement("img");
            articlePicture.src = data[j].imageUrl
            articlePicture.alt = data[j].altTxt
            
            let articleTitle = document.createElement("h3");
            articleTitle.className = "productName";
            articleTitle.innerText = data[j].name
            
            let articleDescription = document.createElement("p");
            articleDescription.className = "productDescription";
            articleDescription.innerText = data[j].description
            
            article.appendChild(articlePicture)
            article.appendChild(articleTitle)
            article.appendChild(articleDescription)
            j = j + 1
        
        }

});

