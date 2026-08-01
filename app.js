let allResorts = [];
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];


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


            <button 
            class="view-button"
            data-resort='${JSON.stringify(resort)}'>
            View Resort
            </button>



            <button 
            class="favourite-button"
            data-resort='${JSON.stringify(resort)}'>

            ${favourites.some(f => f.resort === resort.resort)

            ? "💚 Saved"

            : "❤️ Save Favourite"}

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
document.getElementById("find-resort").onclick = function(){

    document.getElementById("finder-modal").style.display="block";

};
document.querySelector(".finder-close").onclick = function(){

    document.getElementById("finder-modal").style.display="none";

};
document.getElementById("recommend-button").onclick = function(){


let budget =
Number(document.getElementById("budget").value);


let priority =
document.getElementById("priority").value;



let ranked = [...allResorts];



ranked = ranked.filter(resort =>

    resort.nightlyCost <= budget

);



ranked.sort((a,b)=>{


let scoreA = a.familyScore;

let scoreB = b.familyScore;



if(priority === "kids"){

scoreA += a.kidsClubRating * 5;

scoreB += b.kidsClubRating * 5;

}


if(priority === "beach"){

scoreA += a.beachRating * 5;

scoreB += b.beachRating * 5;

}


if(priority === "pool"){

scoreA += a.poolRating * 5;

scoreB += b.poolRating * 5;

}


if(priority === "allinclusive"){

if(a.allInclusive === "Yes")
scoreA += 10;

if(b.allInclusive === "Yes")
scoreB += 10;

}



return scoreB-scoreA;


});



let results = ranked.slice(0,3);



const output =
document.getElementById("recommendations");



output.innerHTML = `

<h3>🏆 Your Top Matches</h3>

${results.map(r => {


let reasons = [];


if(r.familyScore >= 95){

reasons.push("⭐ Excellent family rating");

}


if(r.kidsClubRating >= 5){

reasons.push("👧 Outstanding kids club");

}


if(r.poolRating >= 5){

reasons.push("🏊 Amazing pool facilities");

}


if(r.beachRating >= 5){

reasons.push("🏖 Beautiful beach location");

}


if(r.allInclusive === "Yes"){

reasons.push("🍽 All-inclusive experience");

}


return `

<div class="recommend-card">

<h4>${r.resort}</h4>


<p>
🏆 Match Score: ${r.familyScore}/100
</p>


<p>
${r.country} - ${r.city}
</p>


<h5>
Why we picked it:
</h5>


<ul>

${reasons.map(reason =>

`<li>${reason}</li>`

).join("")}

</ul>


<p>
${r.priceDisplay}
</p>


<button 
class="view-button"
data-resort='${JSON.stringify(r)}'>
View Resort
</button>


</div>

`;

}).join("")}

`;

};
document.addEventListener("click", function(e){


if(e.target.classList.contains("favourite-button")) {


const resort = JSON.parse(e.target.dataset.resort);


const exists = favourites.find(
r => r.resort === resort.resort
);


if(!exists){

    favourites.push(resort);

    localStorage.setItem(
        "favourites",
        JSON.stringify(favourites)
    );

    e.target.textContent = "💚 Saved";

    e.target.classList.add("saved");

}


e.target.textContent = "💚 Saved";


}

else {

alert("Already saved in favourites");



});
document.getElementById("show-favourites").onclick = function(){

    displayFavourites();

    document.getElementById("favourites-modal").style.display="block";

};
function displayFavourites(){

    const list = document.getElementById("favourites-list");


    if(favourites.length === 0){

        list.innerHTML = "<p>No favourites saved yet.</p>";

        return;

    }


    list.innerHTML = favourites.map(resort => `

        <div class="recommend-card">

            <img src="${resort.image}" width="100%">


            <h3>${resort.resort}</h3>


            <p>
            ${resort.city}, ${resort.country}
            </p>


            <p>
            ⭐ ${resort.familyScore}/100 Family Score
            </p>


            <p>
            ${resort.priceDisplay}
            </p>


            <button 
            class="view-button"
            data-resort='${JSON.stringify(resort)}'>
            View Resort
            </button>


        </div>


    `).join("");

}
document.querySelector(".favourites-close").onclick = function(){

    document.getElementById("favourites-modal").style.display="none";

};
document.addEventListener("click", function(e){


if(e.target.classList.contains("remove-favourite")) {


const name = e.target.dataset.name;


favourites = favourites.filter(
r => r.resort !== name
);


localStorage.setItem(
"favourites",
JSON.stringify(favourites)
);


displayFavourites();


}


});
document.getElementById("clear-favourites").onclick = function(){

favourites = [];

localStorage.removeItem("favourites");

displayFavourites();

};
document.getElementById("compare-favourites").onclick = function(){

    showComparison();

    document.getElementById("compare-modal").style.display="block";

};
function showComparison(){


const table =
document.getElementById("comparison-table");


if(favourites.length < 2){

table.innerHTML =
"<p>Please save at least 2 resorts to compare.</p>";

return;

}



table.innerHTML = `

<table class="compare-table">

<tr>

<th>Feature</th>

${favourites.map(r =>
`<th>${r.resort}</th>`
).join("")}

</tr>


<tr>

<td>Family Score</td>

${favourites.map(r =>
`<td>⭐ ${r.familyScore}/100</td>`
).join("")}

</tr>


<tr>

<td>Price</td>

${favourites.map(r =>
`<td>${r.priceDisplay}</td>`
).join("")}

</tr>


<tr>

<td>Kids Club</td>

${favourites.map(r =>
`<td>${r.kidsClubRating}/5</td>`
).join("")}

</tr>


<tr>

<td>Pool</td>

${favourites.map(r =>
`<td>${r.poolRating}/5</td>`
).join("")}

</tr>


<tr>

<td>Beach</td>

${favourites.map(r =>
`<td>${r.beachRating}/5</td>`
).join("")}

</tr>


<tr>

<td>All Inclusive</td>

${favourites.map(r =>
`<td>${r.allInclusive}</td>`
).join("")}

</tr>


</table>

`;

}
document.addEventListener("click", function(e){

    if(e.target.classList.contains("compare-close")){

        document.getElementById("compare-modal").style.display = "none";

    }

});

};
window.onclick = function(event) {


    const resortModal = document.getElementById("resort-modal");

    const finderModal = document.getElementById("finder-modal");

    const favouritesModal = document.getElementById("favourites-modal");

    const compareModal = document.getElementById("compare-modal");



    if (event.target === resortModal) {

        resortModal.style.display = "none";

    }



    if (event.target === finderModal) {

        finderModal.style.display = "none";

    }



    if (event.target === favouritesModal) {

        favouritesModal.style.display = "none";

    }



    if (event.target === compareModal) {

        compareModal.style.display = "none";

    }


};
