let panier = [
  
  [
    "454545 red", 10
  ],
  
  [
    "646464 green", 2
  ],
  
  [
    "787878 gray", 4
  ],
  
]

console.log(panier[2])

let listID = []

for (let id of panier){
  listID.push(id[0])
}

console.log(listID)