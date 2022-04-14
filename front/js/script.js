let i = 1
while(i<9){
  
    const sectionArticles = document.querySelector(".items"); // Selection du parent
    let newProduct = document.createElement("a"); // Création d'un élément HTML
    newProduct.href = "www.google.fr" // Ajout de l'attribut href
    sectionArticles.appendChild(newProduct); // Ajout de l'élément crée dans le parent
    
    let article = document.createElement("article");
    newProduct.appendChild(article);
    
    let articlePicture = document.createElement("img");
    articlePicture.src = `../../back/images/kanap0${i}.jpeg`
    articlePicture.alt = "lorem super texte alternatif"
    
    let articleTitle = document.createElement("h3");
    articleTitle.className = "productName"
    articleTitle.innerText = "Kanap name2";
    
    let articleDescription = document.createElement("p");
    articleDescription.className = "productDescription";
    articleDescription.innerText = "Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu."
    
    article.appendChild(articlePicture)
    article.appendChild(articleTitle)
    article.appendChild(articleDescription)
    i = i + 1

}

let j = 1

fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(data => {
        console.log(data);
        console.log(data.length);
        console.log(j);

        // while (j < data.length){
        //     j = j + 1
        //     console.log(j);
        // }
});

