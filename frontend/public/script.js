//Forms
const formComponent = () => `
  <form id="upload-file">
    <input type="text" placeholder="Image name" name="name">
    <input type="file" name="file">
    <button>SEND</button>
  </form>
`
const newBeerComponent = () => `
  <form id="add-beer">
    <input type="text" name="beerName" placeholder="Beer name">
    <input type="text" name="abv" placeholder="beer abv">
    <input type="text" name="brewery" placeholder="brewery">
    <button>Add new</button>
  </form>
`
const rootElement = document.querySelector('#root')

rootElement.insertAdjacentHTML('afterbegin', formComponent())
rootElement.insertAdjacentHTML('beforeend', newBeerComponent())

rootElement.insertAdjacentHTML('beforeend', "<div id='beer-list'></div>")
const beerListElement = document.querySelector('#beer-list')

//Retrive data from file
const getBeers =() => { 
  fetch(`http://127.0.0.1:9000/data`) // fontos, hogy itt az endpoint url-t adjuk meg
  .then(response => {
    if (response.status === 201) {
      console.log('ok')
    }
    return response.json()
  })
  .then(responseJson => {
    const data = responseJson
    let html = ''
    data.forEach(element => {
      html = html + `<h3>${element.name}</h3>
      <span><strong>Abv.: </strong> ${element.abv}</span>
      <span><strong>Brewery: </strong>${element.brewery}</span>
      `});

    beerListElement.innerHTML = html
  })
}
getBeers()

// UPLOAD DATA AND FILES 
const uploadFileFormElement = document.querySelector('#upload-file')

uploadFileFormElement.addEventListener('submit', (event)=> {
  event.preventDefault()
  console.log("Submitted")

  const formData = new FormData()
  formData.append('name', document.querySelector(`input[type='text']`).value)
  formData.append('image', document.querySelector(`input[type='file']`).files[0])

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(res => {
    console.log("res", res)
    if(res.status === 200) {
      console.log('Success!')
      return res.json()
    }else {
      console.log("ERROR!")
    }
  })
  .then(resData => { // resData = "pelda"
    console.log(resData)
    rootElement.insertAdjacentHTML('beforeend', `<img src="./public/${resData}.jpg">`)
  })
  .catch(error => console.log(error))
})

const addNewFormElement = document.querySelector('#add-beer')

addNewFormElement.addEventListener("submit", (event) => {
  event.preventDefault()
  const product = {
    name: document.querySelector(`input[name='beerName']`).value,
    abv: parseInt(document.querySelector(`input[name='abv']`).value),
    brewery: document.querySelector(`input[name='brewery']`).value,
  }
  console.log("product", product)  

  fetch("/new", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(product),
  })
  .then(response => {
    getBeers()
  })
})