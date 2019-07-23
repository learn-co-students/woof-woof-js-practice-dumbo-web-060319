document.addEventListener("DOMContentLoaded", function(e) {

    fetch(" http://localhost:3000/pups")
    .then(response => response.json())
    .then(showDogs)


    function showDogs(data) {
        console.log(data)
        const dogBar = document.querySelector("#dog-bar")
        
        
        data.forEach(dog => {
            const span = document.createElement("span")
            dogBar.append(span)
            span.id = dog.id
            span.className = "hidden"
            span.innerText = dog.name
            span.addEventListener("click", function(e) {
                
                getDogInfo(e)
            })
            
        })
        function getDogInfo(event) {
            console.log(event.target.id)
            const dogId = event.target.id
            fetch(`http://localhost:3000/pups/${dogId}`)
            .then(response => response.json())
            .then(showDogInfo)
            
        }

        function showDogInfo(dog) {
            console.log(dog)
            let name = dog.name
            let image = dog.image 
            let dogId = dog.id 
            let dogStatus = dog.isGoodDog
            let innerText;
            if (dogStatus == true) {
                 innerText = "Good Dog!"
            } else {
                innerText = "Bad Dog!"
            }

            const div = document.querySelector("#dog-info")

            div.innerHTML = `
                            <h2> ${dog.name} </h2>
                            <img src=${dog.image}>
                            <button id=${dog.id} class="dog-button">${innerText}</button>
                            `
            const button = document.querySelector(".dog-button")
            button.addEventListener("click", function(e) {
                console.log(e.target.id)
                const dogId = e.target.id 
                
                fetch(`http://localhost:3000/pups/${dogId}`, {
                    method: "PATCH",
                    headers: {"Content-Type": "application/json",
                    "Accept": "application/json" },
                    body: JSON.stringify({
                        "isGoodDog": e.target.isGoodDog 
                    })
                }).then(response => response.json())
                .then(changeBoolean)
                
                function changeBoolean(dog) {
                if (dog.isGoodDog = false) {
                    dog.isGoodDog = true
                    button.innerText = "Good Dog!"
                } else {
                    dog.isGoodDog = false 
                    button.innerText = "Bad Dog!"
                }
                }
                
            })
        }


        const filterButton = document.querySelector("#good-dog-filter")
            filterButton.addEventListener("click", function(e) {
                if (filterButton.innerText == "Filter good dogs: OFF") {
                    console.log(data)
                    data.forEach(dog => {
                        let dogStatus = dog.isGoodDog
                        if (dogStatus == false) {
                            debugger 

                        }
                    })
                }
            })
    }
        



})