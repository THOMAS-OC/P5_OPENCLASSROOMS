/* Travailler avec le panier Javascript et à chaque opération CRUD, 
enregistrer ce panier dans le storage  */

// PANIER TYPE
let example = [

    { id: "1",
      prix: 25,
      color: "red",
      quantity: 1
    }

]
window.localStorage.setItem("panier", JSON.stringify(example))

// !!------- Fonction pour envoyer le panier JS dans le storage : OK
const saveCartInStorage = (obj) => {
    window.localStorage.setItem("panier", JSON.stringify(obj))
}


// !!------- Fonction pour convertir le panier du storage vers un panier JS : OK
const exportCartFromStorage = () => {
    let rawCart = window.localStorage.getItem("panier")
    let objectCart = JSON.parse(rawCart)
    return objectCart;
}

let myCart = exportCartFromStorage()



/* !!------- Fonction pour ajouter un article au panier
Si l'article est déjà présent, incrémenter la quantité */

const pushArticle = (article) => {
    method = "push"

    for (let obj of myCart){

        if(obj.id == article.id && obj.color == article.color){
            console.log("ARTICLE DEJA PRESENT !!");
            obj.quantity += article.quantity
            method = "notPush"
            saveCartInStorage(myCart)
        }
        
    }

    if (method == "push"){
        myCart.push(article)
        saveCartInStorage(myCart)
    }

}

let newArticle = {
    id: "1",
    prix: 50,
    color: "blue",
    quantity: 4
}

pushArticle(newArticle)
pushArticle(newArticle)
console.log(myCart);


// !!------- Fonction pour retirer un article du panier


// !!------- Fonction pour modifier la quantité d'un article dans le panier
const updateArticle = (article, newQuantity) => {

    for (let obj of myCart){

        if(obj.id == article.id && obj.color == article.color){
            console.log("Modif des quantités");
            obj.quantity = newQuantity
            saveCartInStorage(myCart)
        }
        
    }

}

let newArticle2 = {
    id: "1",
    prix: 50,
    color: "blue",
    quantity: 100
}

updateArticle(newArticle2, newArticle2.quantity)

// !!------- Fonction pour faire la somme du nombre d'articles
