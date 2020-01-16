const DOG_BAR = document.querySelector('#dog-bar');
const DOG_INFO = document.querySelector('#dog-info');
const GOOD_DOG_FILTER = document.querySelector('#good-dog-filter');

// adds dogs to the page 
function addDogs(dogs) {
	DOG_BAR.innerHTML = "";
	for (dog of dogs) {
		// console.log(dog);
		let tempSpan = document.createElement('span');
		tempSpan.setAttribute('id', `dog-id-${dog.id}`);
		tempSpan.innerText = dog.name;
		DOG_BAR.append(tempSpan);
	}
}

//fetching the dog dat from the backend api
function fetchDogs() {
	return fetch("http://localhost:3000/pups")
	.then(resp => resp.json())
}

document.addEventListener("DOMContentLoaded", event => {
	fetchDogs()
	.then(addDogs);
});

// returns the response to whether the dog is good or bad
function goodDog(goodDog) {
	if (goodDog) {
		return "Good Dog!";
	}
	else {
		return "Bad Dog!";
	}
}

function showDog(dog) {
	DOG_INFO.innerHTML = "";
	let img = document.createElement('img');
	img.setAttribute('src', `${dog.image}`);
	DOG_INFO.append(img);
	DOG_INFO.innerHTML += `<h2>${dog.name}</h2>`
	DOG_INFO.innerHTML += `<button data-dog-id="${dog.id}">${goodDog(dog.isGoodDog)}</button>`
}

//listens for the clikc of a dog-bar span element and then searches databse for matching id
DOG_BAR.addEventListener("click", event => {
	if (event.target.nodeName == "SPAN") {
		// gets the array of dogs from the database
		fetchDogs()
		.then(dogs => {
			//compares the dogs to the dog that was clicked on
			for (dog of dogs) {
				if (`dog-id-${dog.id}` == event.target.id) {
					showDog(dog)
				}
			}
		});   
	}
});

// updates the dogs behavior in the database
function updateDog(dog) {
	fetch(`http://localhost:3000/pups/${dog.id}`, {
		method: 'PATCH',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({"isGoodDog": !dog.isGoodDog})
	});
}

// finds the dog to update its behavior
function findDog(dogId) {
	fetchDogs()
	.then(dogs => {
		//compares the dogs to the dog that was clicked on
		for (dog of dogs) {
			if (dog.id == parseInt(dogId)) {
				updateDog(dog);
			}
		}
	});  
}

// toggles the event without having to refresh the page
function toggle(innerText) {
	if (innerText == "Good Dog!") {
		return "Bad Dog!";
	}
	else {
		return "Good Dog!";
	}
}

// listening event that toggles the dog between good or bad
DOG_INFO.addEventListener("click", event => {
	if (event.target.nodeName == "BUTTON") {
		console.log(event.target);
		// debugger;
		findDog(event.target.dataset.dogId);
		event.target.innerText = `${toggle(event.target.innerText)}`;
	}
});

GOOD_DOG_FILTER.addEventListener("click", event => {
	let dogs = document.querySelectorAll('span');
	if (event.target.innerText.includes("OFF")) {
		event.target.innerText = "Filter good dogs: ON";
		fetchDogs()
		.then(dogs => {
			DOG_BAR.innerHTML = "";
			for (dog of dogs) {
				if (dog.isGoodDog) {
					let tempSpan = document.createElement('span');
					tempSpan.setAttribute('id', `dog-id-${dog.id}`);
					tempSpan.innerText = dog.name;
					DOG_BAR.append(tempSpan);
					document.querySelector(`#dog-id-${dog.id}`).hidden = true;
				}
			}
		});
	}
	else {
		event.target.innerText = "Filter good dogs: OFF";
		fetchDogs()
		.then(addDogs);
	}
})

