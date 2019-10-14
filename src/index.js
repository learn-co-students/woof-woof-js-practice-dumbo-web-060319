
// CLICK ON "FILTER GOOD DOGS" BUTTON IN ORDER TO JUST SEE GOOD DOGS OR SEE ALL DOGS IN DOG BAR


// Constants
const URL = 'http://localhost:3000/pups';
const dog_Bar = document.querySelector('#dog-bar');
const dog_Info = document.querySelector('#dog-info');
const dog_Filter_Div = document.querySelector('#filter-div');
const filter_Button = dog_Filter_Div.querySelector('#good-dog-filter')


// GET all Dog names, add to dog_Bar as <span>Name</span>
fetch(URL)
  .then(resp => resp.json())
  .then(DOGS => {
    console.log(DOGS)
    DOGS.forEach(dog => {
      dog_Bar.innerHTML +=
        `
      <span data-id=${dog.id} data-name=${dog.name} data-image=${dog.image} 
        data-isGoodDog=${dog.isGoodDog}>${dog.name}</span>
      `
    });
  })
  .catch(err => console.log(err.message));



// CLICK ON A DOG IN THE DOG BAR TO SEE name, image, AND A DOG BUTTON THAT INDICATES isGoodDog status in #dog-info
dog_Bar.addEventListener('click', event => {
  let id = event.target.dataset.id;
  let name = event.target.dataset.name;
  let image = event.target.dataset.image;
  let isGoodDog = event.target.dataset.isGoodDog;
  let statement;
  if (isGoodDog) {
    statement = "Good Dog!"
  } else {
    statement = "Bad Dog!"
  }
  dog_Info.dataset.id = id;
  console.log(dog_Info)
  dog_Info.innerHTML =
    `
      <h2>${name}</h2>
      <img src="${image}" alt="${image}">
      <button>${statement}</button>
    `
})


// CLICK ON GOOD DOG/BAD DOG BUTTON IN ORDER TO UPDATE PUP GOODNESS

dog_Info.addEventListener('click', event => {
  if (event.target.tagName == "BUTTON") {
    console.log(event.target.textContent);
    let isGoodDog;
    if (event.target.textContent === "Good Dog!") {
      isGoodDog = false
    } else if (event.target.textContent === "Bad Dog!") {
      isGoodDog = true
    }
    console.log(isGoodDog)
    let id = event.currentTarget.dataset.id;

    fetch(`${URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "isGoodDog": isGoodDog
      })
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data)
        console.log(isGoodDog)
        console.log(event.target)
        console.log(event.target.innerHTML)
        if (isGoodDog) {
          event.target.innerHTML = "Good Dog!"
        } else {
          event.target.innerHTML = "Bad Dog!"
        }
      })
      .catch(err => console.log(err.message))
  }
})


// When a user clicks on the Filter Good Dogs button, two things should happen:

// The button's text should change from "Filter good dogs: OFF" to "Filter good dogs: ON", or vice versa.
// If the button now says "ON"(meaning the filter is on), then the Dog Bar should only show pups whose isGoodDog attribute is true.If the filter is off, the Dog Bar should show all pups(like normal).

filter_Button.addEventListener('click', event => {
  event.preventDefault();
  console.log(event.target);

  if (event.target.textContent == "Filter good dogs: OFF") {
    event.target.textContent = "Filter good dogs: ON";
    fetch(URL)
      .then(resp => resp.json())
      .then(DOGS => {
        dog_Bar.innerHTML = ""
        DOGS.forEach(dog => {
          if (dog.isGoodDog) {
            dog_Bar.innerHTML +=
              `<span data-id=${dog.id} data-name=${dog.name} data-image=${dog.image} 
              data-isGoodDog=${dog.isGoodDog}>${dog.name}</span>`
          }
        });
      })
      .catch(err => console.log(err.message));
  } else {
    event.target.textContent = "Filter good dogs: OFF";
    fetch(URL)
      .then(resp => resp.json())
      .then(DOGS => {
        dog_Bar.innerHTML = ""
        DOGS.forEach(dog => {
          dog_Bar.innerHTML +=
            `<span data-id=${dog.id} data-name=${dog.name} data-image=${dog.image} 
            data-isGoodDog=${dog.isGoodDog}>${dog.name}</span>`
        });
      })
      .catch(err => console.log(err.message));
  }


})

