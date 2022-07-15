// ----- VARIABLES -----
const url = new URL(location.href); // Récupérer l'url
const id = url.searchParams.get("id"); // Récupérer la valeur de l'attribut id
// ----- FIN DES VARIABLES -----


document.getElementById("orderId").innerText = id // Affichage de l'identifiant de commande à l'utilisateur
window.localStorage.clear() // Vidage du storage après finalisation de la commande
