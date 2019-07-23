DOGS_URL = 'http://localhost:3000/pups'
DOG_BAR = document.querySelector('#dog-bar');
DOG_INFO = document.querySelector('#dog-info');
FILTER_BUTTON = document.querySelector('#good-dog-filter');

class Pup {
  constructor(pupJson) {
    this.id = pupJson['id'];
    this.name = pupJson['name'];
    this.isGoodDog = pupJson['isGoodDog'];
    this.image = pupJson['image'];
    this.renderDogBarEntry();
    this.dogBarListener();
    this.goodDogToggler();
  }

  renderDogBarEntry() {
    this.barSpan = document.createElement('span');
    this.barSpan.textContent = this.name;
    this.barSpan.dataset.isGoodDog = this.isGoodDog;
    DOG_BAR.append(this.barSpan);
  }

  dogBarListener(barSpan=this.barSpan, dogInfo=this.renderDogInfo()) {
    barSpan.addEventListener('click', function(e) {
      DOG_INFO.innerHTML = '';
      DOG_INFO.append(dogInfo);
    });
  }

  renderDogInfo() {
    this.dogInfoDiv = document.createElement('div');
    this.dogInfoImg = document.createElement('img');
    this.dogInfoH2 = document.createElement('h2');
    this.br = document.createElement('br');
    this.dogInfoButton = document.createElement('button');

    this.dogInfoImg.src = this.image;
    this.dogInfoH2.textContent = this.name;

    if (this.isGoodDog) {
      this.dogInfoButton.textContent = 'Good Dog!'
    }
    else {
      this.dogInfoButton.textContent = 'Bad Dog!'
    }

    this.dogInfoDiv.append(this.dogInfoH2);
    this.dogInfoDiv.append(this.dogInfoImg);
    this.dogInfoDiv.append(this.br);
    this.dogInfoDiv.append(this.dogInfoButton);
    return this.dogInfoDiv;
  }

  goodDogToggler(button=this.dogInfoButton, span=this.barSpan, patch=this.patchGoodDog, id=this.id, isGoodDog=this.isGoodDog) {
    button.addEventListener('click', function(e) {
      isGoodDog = !isGoodDog;

      if (isGoodDog) {
        button.textContent = 'Good Dog!'
        span.style.visibility = 'visible';
      }
      else {
        button.textContent = 'Bad Dog!'
        if (FILTER_BUTTON.dataset.filter === 'false') {
          span.style.visibility = 'hidden';
        }
      }
      patch(id, isGoodDog);
      this.isGoodDog = isGoodDog;
    });
  }

  patchGoodDog(id, isGoodDog) {
    return fetch(DOGS_URL + `/${id}`, {
      method: 'PATCH',
      body: {'isGoodDog': isGoodDog}
    })
    .then(res => res.json())
  }
}

function fetchDogs() {
  fetch(DOGS_URL)
  .then(res => res.json())
  .then(myJson => {
    myJson.forEach(function(elem) {
      new Pup(elem)
    });
  })
}

function filterGoodDogs() {
  FILTER_BUTTON.addEventListener('click', function(e) {
    if (FILTER_BUTTON.dataset.filter == 'false') {
      FILTER_BUTTON.dataset.filter = 'true';
      FILTER_BUTTON.textContent = 'Filter good dogs: ON';
      for (var i = 0; i < DOG_BAR.children.length; i++) {
        if (DOG_BAR.children[i].dataset.isGoodDog === 'false') {
          DOG_BAR.children[i].style.visibility = 'visible';
        }
      }
    }
    else {
      FILTER_BUTTON.dataset.filter = 'false';
      FILTER_BUTTON.textContent = 'Filter good dogs: OFF';
      for (var i = 0; i < DOG_BAR.children.length; i++) {
        if (DOG_BAR.children[i].dataset.isGoodDog === 'false') {
          DOG_BAR.children[i].style.visibility = 'hidden';
        }
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', function(e) {
  filterGoodDogs();
  fetchDogs();
});
