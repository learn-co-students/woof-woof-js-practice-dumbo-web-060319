document.addEventListener("DOMContentLoaded", function(){
    const dogPanel = document.getElementById('dog-bar')
    const dogInfoPanel = document.getElementById('dog-info')
    const dogFilter  = document.getElementById('good-dog-filter')
    
    fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then(listDogs)

    function listDogs(dogJson){
        dogJson.forEach(listSingleDog)
    }

    function listSingleDog(dog){
        dogSpan = document.createElement('span')
        dogSpan.setAttribute('id', `spn-${dog.id}`)
        dogSpan.dataset.id = dog.id 
        dogSpan.innerText = dog.name
        dogSpan.addEventListener('click', listDogInfo)
        dogPanel.append(dogSpan)
    }

    function listDogInfo(event){
        dogId = event.target.dataset.id

        fetch(`http://localhost:3000/pups/${dogId}`)
        .then(res => res.json())
        .then(postDogInfo)
    }

    function postDogInfo(dogInfo){
        dogInfoPanel.innerHTML = `
        <h2>${dogInfo.name}</h2>
        <img src="${dogInfo.image}">
        `
        const goodOrBadBTn = document.createElement('button')
        goodOrBadBTn.dataset.id = dogInfo.id
        goodOrBadBTn.className = "goodOrBad"
        if (dogInfo.isGoodDog == true){
            goodOrBadBTn.innerText = "Good Dog!"
            goodOrBadBTn.dataset.gob = dogInfo.isGoodDog
        } else {
            goodOrBadBTn.innerText = "Bad Dog!"
            goodOrBadBTn.dataset.gob = dogInfo.isGoodDog
        }
        dogInfoPanel.append(goodOrBadBTn)
    }

    dogInfoPanel.addEventListener('click', function(){
        if(event.target.classList.contains('goodOrBad'))
        getDogStatus(event.target)
    })

    function getDogStatus(dogBtn){
        const dogId = dogBtn.dataset.id 
        const dogStatus = dogBtn.dataset.gob
        if(dogStatus == 'true'){
        fetch(`http://localhost:3000/pups/${dogId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                isGoodDog: false
            })
        }).then(res => res.json())
        .then(postDogInfo)
        } else if(dogStatus == 'false'){
            fetch(`http://localhost:3000/pups/${dogId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                isGoodDog: true
            })
        }).then(res => res.json())
        .then(postDogInfo)
        }
    }

    dogFilter.addEventListener('click', function(event){
        const filterStatus = event.target
       if(filterStatus.innerText == 'Filter good dogs: OFF'){
           filterStatus.innerText = 'Filter good dogs: ON'
           fetch('http://localhost:3000/pups')
            .then(res => res.json())
            .then(listOnlyGoodDogs)
       } else if(filterStatus.innerText == 'Filter good dogs: ON'){
           filterStatus.innerText = 'Filter good dogs: OFF'
           fetch('http://localhost:3000/pups')
            .then(res => res.json())
            .then(displayAllDogs)
       }
    })

    function listOnlyGoodDogs(dogJson){
        dogJson.forEach(filterGoodDog)
    }

    function filterGoodDog(dog){
        const dogId = dog.id
        const dogSpn = document.getElementById(`spn-${dogId}`)
        if(dog.isGoodDog == false){
            dogSpn.style.display = 'none'
        } 
    }

    function displayAllDogs(dogJson){
        dogJson.forEach(displayDogAgain)
    }

    function displayDogAgain(dog){
        const dogId = dog.id
        const dogSpn = document.getElementById(`spn-${dogId}`)
        dogSpn.style.display = 'block'
    }


})