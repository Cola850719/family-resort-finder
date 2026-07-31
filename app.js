let allResorts = [];


fetch("data/resorts.json")
.then(response => response.json())
.then(resorts => {

    allResorts = resorts;

    populateCountries();

    displayResorts(allResorts);

});


function displayResorts(resorts) {

    const container = document.getElementById("resort-grid");

    container.innerHTML = "";


    resorts.forEach(resort => {


        const card = document.createElement("div");

        card.className = "resort-card";


        card.innerHTML = `

        <img src="${resort.image}" alt="${resort.resort}">


        <div class="resort-info">

            <h2>${resort.resort}</h2>

            <p>
            ${resort.city}, ${resort.country}
            </p>


            <div class="badges">

                <div class="badge family">
                    ⭐ ${resort.familyScore}/100
                    <span>Family</span>
                </div>


                <div class="badge">
                    🏊 ${resort.poolRating}/5
                    <span>Pool</span>
                </div>


                <div class="badge">
                    🏖 ${resort.beachRating}/5
                    <span>Beach</span>
                </div>


                <div class="badge">
                    👧 ${resort.kidsClubRating}/5
                    <span>Kids Club</span>
                </div>

            </div>


            <p class="price">
            ${resort.priceDisplay}
            </p>


            <button class="view-button" data-resort='${JSON.stringify(resort)}'>
            View Resort
            </button>


        </div>

        `;


        container.appendChild(card);


    });

}



function populateCountries() {

    const countrySelect = document.getElementById("country-filter");

    const countries = [...new Set(allResorts.map(r => r.country))];


    countries.forEach(country => {

        const option = document.createElement("option");

        option.value = country;

        option.textContent = country;

        countrySelect.appendChild(option);

    });

}



function applyFilters() {


    let filtered = [...allResorts];


    const country =
    document.getElementById("country-filter").value;


    const score =
    Number(document.getElementById("score-filter").value);


    const sort =
    document.getElementById("sort-filter").value;



    if(country !== "all") {

        filtered = filtered.filter(
            r => r.country === country
        );

    }



    if(score > 0) {

        filtered = filtered.filter(
            r => r.familyScore >= score
        );

    }



    if(sort === "price-low") {

        filtered.sort(
            (a,b)=>a.nightlyCost-b.nightlyCost
        );

    }



    if(sort === "score-high") {

        filtered.sort(
            (a,b)=>b.familyScore-a.familyScore
        );

    }


    displayResorts(filtered);

}



document.addEventListener("change", function(e){

    if(
        e.target.id === "country-filter" ||
        e.target.id === "score-filter" ||
        e.target.id === "sort-filter"
    ){

        applyFilters();

    }

});



function openResort(resort) {


document.getElementById("modal-image").src = resort.image;

document.getElementById("modal-title").textContent = resort.resort;

document.getElementById("modal-location").textContent =
resort.city + ", " + resort.country;


document.getElementById("modal-score").textContent =
"⭐ " + resort.familyScore + "/100 Family Rating";


document.getElementById("modal-price").textContent =
resort.priceDisplay;


document.getElementById("modal-description").textContent =
resort.description;


document.getElementById("modal-best").textContent =
"Best for: " + resort.bestFor;


document.getElementById("resort-modal").style.display="block";


}



document.addEventListener("click", function(e){


if(e.target.classList.contains("view-button")) {


const resort =
JSON.parse(e.target.dataset.resort);


openResort(resort);


}


});



document.querySelector(".close").onclick = function(){

document.getElementById("resort-modal").style.display="none";

};
