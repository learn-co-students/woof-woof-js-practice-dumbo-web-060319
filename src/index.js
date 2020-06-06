
document.addEventListener("DOMContentLoaded", function()
{
    dogbar = document.querySelector("#dog-bar");
    doginfo = document.querySelector("#dog-info");
    fillDogbar();
});




function fillDogbar()
{
    fetch(" http://localhost:3000/pups")
    .then(function(resp)
    {
        return resp.json();
    })
    .then(function(data)
    {
        parseDogs(data);
    })
}

function parseDogs(data)
{
    
    for (let i=0; i < data.length; i++)
    {
        let newSpan = document.createElement("span");
        newSpan.innerText = data[i].name;
        newSpan.dataset.dog_id = data[i].id;
        addEventListenerToDogSpans(newSpan,data[i]);
        dogbar.append(newSpan);
    }
}

function addEventListenerToDogSpans(info, dogeData)
{

    info.addEventListener("click", function()
    {
        doginfo.innerHTML = "";
        let newImg = document.createElement("img");
        newImg.src = dogeData.image;

        let newName = document.createElement("h2");
        newName.innerText = dogeData.name;

        let newButton = document.createElement("button");
        let inner;
        if (dogeData.isGoodDog == true)
        {
            inner = "Good Dog!"
        }
        else
        {
            inner = "Bad Dog!"
        }
        newButton.innerText = inner;
        addEventListenerToGoodBadDogButton(newButton,dogeData);
        doginfo.append(newImg);
        doginfo.append(newName);
        doginfo.append(newButton);
    })
}
function addEventListenerToGoodBadDogButton(btn, dogeData)
{

    btn.addEventListener("click", function()
    {
        let x; 
        let xvalue;
        if (btn.innerText == "Good Dog!")
        {
            x = "Bad Dog!";
            xvalue = true;
        }
        else 
        {
            x = "Good Dog!";
            xvalue = false;
        }

        btn.innerText = x;     
        
        fetch(`http://localhost:3000/pups/${dogeData.id}`,
        {
            method: "PATCH",
            headers: 
            {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify
            ({
                "isGoodDog": xvalue
            })
        })


    });
}