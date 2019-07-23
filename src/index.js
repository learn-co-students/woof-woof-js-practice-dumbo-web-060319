

fetch ('http://localhost:3000/pups')
.then(resp => resp.json())
.then(addPupToDom)


function addPupToDom(pups) {
  const dogBar = document.querySelector('#dog-bar')
  for(pup of pups) {

    const span = document.createElement('span');
    span.id = pup.id

    span.addEventListener('click', function(event){
      const id = event.target.id
      fetch (`http://localhost:3000/pups/${id}`)
      .then(response => response.json())
      .then(function(data){
        const parentOfDogDiv = document.querySelector("#dog-info")

        parentOfDogDiv.innerHTML = ''

        const dogDiv = document.createElement('div')

        dogDiv.innerHTML = `
        <img src="${data.image}">
        <h2>${data.name}</h2>
        <button class="doggie" id=${id}>${data.isGoodDog}</button>
        `

        parentOfDogDiv.append(dogDiv)
        
      })
      changeGoodDog(pups)
      
    })
    
    span.innerText = pup.name;
    dogBar.append(span);
    console.log(pup.name);
  }
}

function changeGoodDog(pups) {

  // function goodDog(data) {
  //   if (data.isGoodDog) {
  //     data.isGoodDog = 'false';
  //     event.target.innerText = 'false';
  //  } else {
  //    data.isGoodDog = 'true';
  //    event.target.innerText = 'true';
  //  }
  // }

 
  const button = document.querySelector('#dog-info');
  button.addEventListener('click', (event) => {
    // event.preventDefault;
    if(event.target.classList.contains('doggie')){
      console.log(event.target)
      
      fetch (`http://localhost:3000/pups/${event.target.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': "application/json",
          'Accepts': "application/json"
      },
      body: JSON.stringify({
        'isGoodDog': `${event.target.innerText === 'true' ? 'false' : 'true' }`
      })
      }).then(response => response.json())
        .then(function(data){
          if (event.target.innerText === "true") {
             event.target.innerText = 'false';
          } else { 
            event.target.innerText = 'true';
          }
        })
    }
    

    // if(pups.isGoodDog) {
    //   // data.isGoodDog = false;
    //   button.innerText = 'false';
    // } else {
    //   // data.isGoodDog = true;
    //   button.innerText = 'true';
    // }
  })
}