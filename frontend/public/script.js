console.log('loaded')

fetch(`http://127.0.0.1:9000/data`) // fontos, hogy itt az endpoint url-t adjuk meg
.then(response => {
  console.log(response)
  if (response.status === 201) {
    console.log('ok')
  }
  return response.json()
})
.then(responseJson => {
  console.log(responseJson)
  const data = responseJson
  data.forEach(element => {
    console.log(element.name)
    document.querySelector('#root').insertAdjacentHTML('beforeend', `<h2>${element.name}</h2>`)
  });
})


// UPLOAD DATA AND FILES 
const formComponent = () => `
  <form>
    <input type="text" placeholder="Image name" name="name">
    <input type="file" name="file">
    <button>SEND</button>
  </form>
`

const rootElement = document.querySelector('#root')

rootElement.insertAdjacentHTML('beforeend', formComponent())

const formElement = document.querySelector('form')

formElement.addEventListener('submit', (event)=> {
  event.preventDefault()
  console.log("Submitted")

  const formData = new FormData()
  formData.append('name', document.querySelector(`input[type='text']`).value)//!!! Attribútum alapján kiszelektálni elemeket
  formData.append('image', document.querySelector(`input[type='file']`).files[0]) // ez mindig egy tömb lesz meg ha egy eleme van is

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
  }) // kicsomagoljuk
  .then(resData => { // resData = "pelda"
    console.log(resData)
    rootElement.insertAdjacentHTML('beforeend', `<img src="./public/${resData}.jpg">`)
  })
  .catch(error => console.log(error))
})