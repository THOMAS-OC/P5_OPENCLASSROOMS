const url = new URL(location.href); // Récupérer l'url
const id = url.searchParams.get("id"); // Récupérer la valeur de l'attribut id

document.getElementById("orderId").innerText = id