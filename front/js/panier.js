/* Travailler avec le basket Javascript et à chaque opération CRUD, 
puis enregistrer le basket modifié dans le storage. */

// BASKET TYPE
let example = [

    { id: "1",
      color: "red",
      quantity: 1
    }

]
window.localStorage.setItem("basket", JSON.stringify(example))

// ! Fonction pour envoyer le basket JS dans le storage : OK
const saveCartInStorage = (obj) => {
    window.localStorage.setItem("basket", JSON.stringify(obj))
}


// ! Fonction pour convertir le basket du storage vers un basket JS : OK
const exportCartFromStorage = () => {
    let rawCart = window.localStorage.getItem("basket")
    let objectCart = JSON.parse(rawCart)
    return objectCart;
}

let myCart = exportCartFromStorage()



/* !!------- Fonction pour ajouter un article au basket
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
    color: "blue",
    quantity: 4
}

pushArticle(newArticle)
pushArticle(newArticle)
console.log(myCart);


// !!------- Fonction pour retirer un article du basket


// !!------- Fonction pour modifier la quantité d'un article dans le basket
const updateQuantity = (article, newQuantity) => {

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
    color: "blue",
    quantity: 100
}

updateArticle(newArticle2, newArticle2.quantity)

// !!------- Fonction pour faire la somme du nombre d'articles
