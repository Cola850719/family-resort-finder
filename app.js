let allResorts = [];

let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

let votes = JSON.parse(localStorage.getItem("votes")) || {};


// LOAD RESORT DATA

fetch("data/resorts.json")

.then(response => response.json())

.then(resorts => {


    allResorts = resorts;


    populateCountries();

    populateBudgetResorts();

    displayResorts(allResorts);


})

.catch(error => {

    console.error("Error loading resorts:", error);

});


// DISPLAY RESORT CARDS

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
            data-resort="${encodeURIComponent(JSON.stringify(resort))}">
            View Resort
            </button>




            <button
            class="favourite-button"
            data-resort="${encodeURIComponent(JSON.stringify(resort))}">

            ❤️ Save Favourite

            </button>



        </div>


        `;



        container.appendChild(card);



    });



    updateFavouriteButtons();


}





// UPDATE SAVED BUTTON STATUS

function updateFavouriteButtons(){


    document.querySelectorAll(".favourite-button")

    .forEach(button => {



        const resort = JSON.parse(
    decodeURIComponent(button.dataset.resort)
);



        const saved = favourites.some(

            f => f.resort === resort.resort

        );



        if(saved){


            button.textContent = "💚 Saved";


            button.classList.add("saved");



        }


        else {


            button.textContent = "❤️ Save Favourite";


            button.classList.remove("saved");


        }



    });



}

function displayVoting(){

    const list =
    document.getElementById("voting-list");

    if(favourites.length === 0){

        list.innerHTML =
        "<p>Add favourites before voting.</p>";

        return;

    }

    list.innerHTML = favourites.map(resort => `

        <div class="recommend-card">

            <h3>${resort.resort}</h3>

            <p>${resort.country}</p>

            <button
            class="vote-button"
            data-name="${resort.resort}">
            ⭐ Vote
            </button>

            <p>
            Votes:
            ${votes[resort.resort] || 0}
            </p>

        </div>

    `).join("");

}



// COUNTRY FILTER OPTIONS

function populateCountries(){

    const countrySelect = document.getElementById("country-filter");


    const countries = [
        ...new Set(allResorts.map(r => r.country))
    ];


    countries.forEach(country => {


        const option = document.createElement("option");


        option.value = country;


        option.textContent = country;


        countrySelect.appendChild(option);


    });

}



// POPULATE BUDGET RESORT DROPDOWN

function populateBudgetResorts(){

    const select = document.getElementById("budget-resort");


    if(!select){
        return;
    }


    select.innerHTML = "";


    allResorts.forEach(resort => {


        const option = document.createElement("option");


        option.value = resort.resort;


        option.textContent =
        `${resort.resort} - ${resort.priceDisplay}`;


        select.appendChild(option);


    });

}

function updateBudgetResortPreview(){

    const select =
    document.getElementById("budget-resort");

    const preview =
    document.getElementById("budget-resort-preview");

    if(!select || !preview || !allResorts){
        return;
    }

    const selectedResort =
    allResorts.find(
        r => r.resort === select.value
    );

    if(!selectedResort){
        preview.innerHTML = "";
        return;
    }

    preview.innerHTML = `

        <div class="budget-preview-card">

            <img
                src="${selectedResort.image}"
                alt="${selectedResort.resort}"
            >

            <div class="budget-preview-info">

                <h3>
                    ${selectedResort.resort}
                </h3>

                <p>
                    📍 ${selectedResort.city},
                    ${selectedResort.country}
                </p>

                <div class="budget-preview-details">

                    <span>
                        💰 ${selectedResort.priceDisplay}
                    </span>

                    <span>
                        ⭐ ${selectedResort.familyScore}/100
                    </span>

                </div>

            </div>

        </div>

    `;
}

document.addEventListener("change", function(e){

    if(e.target.id === "budget-resort"){

        updateBudgetResortPreview();

    }

});

// FILTER SYSTEM

function applyFilters(){


    let filtered = [...allResorts];



    const country =

    document.getElementById("country-filter").value;



    const score =

    Number(document.getElementById("score-filter").value);



    const sort =

    document.getElementById("sort-filter").value;



    if(country !== "all"){


        filtered = filtered.filter(

            r => r.country === country

        );


    }



    if(score > 0){


        filtered = filtered.filter(

            r => r.familyScore >= score

        );


    }




    if(sort === "price-low"){


        filtered.sort(

            (a,b)=>a.nightlyCost-b.nightlyCost

        );


    }




    if(sort === "score-high"){


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





// RESORT DETAILS POPUP

function openResort(resort){


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



    document.getElementById("resort-modal").style.display = "block";



}





document.addEventListener("click", function(e){

    if(e.target.classList.contains("favourite-button")){

        const resort = JSON.parse(
            decodeURIComponent(e.target.dataset.resort)
        );

        const exists = favourites.some(
            f => f.resort === resort.resort
        );

        if(!exists){

            favourites.push(resort);

            localStorage.setItem(
                "favourites",
                JSON.stringify(favourites)
            );

            updateFavouriteButtons();

        }

    }

});
// CALCULATE VOTING WINNER

document.addEventListener("click", function(e){

    if(e.target.id === "calculate-winner"){


        const results = Object.entries(votes)
        .sort((a,b) => b[1] - a[1]);


        const output = document.getElementById("voting-results");


        if(results.length === 0){

            output.innerHTML = `
            <p>No votes have been recorded yet.</p>
            `;

            return;

        }


        output.innerHTML = `

        <h2>
        🏆 Family Holiday Winner
        </h2>


        ${results.slice(0,3).map((result,index)=>`

            <div class="winner-card">

                <h3>
                ${["🥇","🥈","🥉"][index]}
                ${result[0]}
                </h3>

                <p>
                ${result[1]} votes
                </p>

            </div>


        `).join("")}


        `;


    }

});
// VIEW RESORT BUTTONS

document.addEventListener("click", function(e){

    if(e.target.classList.contains("view-button")){


        const resort = JSON.parse(
            decodeURIComponent(e.target.dataset.resort)
        );


        openResort(resort);


    }

});

// FIND MY RESORT POPUP

document.getElementById("find-resort").onclick = function(){

    document.getElementById("finder-modal").style.display = "block";

};





// RECOMMENDATION ENGINE

document.getElementById("recommend-button").onclick = function(){


    let budget = Number(
        document.getElementById("budget").value
    );


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



        return scoreB - scoreA;



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
            data-resort="${encodeURIComponent(JSON.stringify(resort))}">

            View Resort

            </button>



        </div>


        `;



    }).join("")}



    `;



};





// SAVE FAVOURITES

document.addEventListener("click", function(e){



    if(e.target.classList.contains("favourite-button")){



        const resort = JSON.parse(
    decodeURIComponent(e.target.dataset.resort)
);




        const exists = favourites.some(

            f => f.resort === resort.resort

        );





        if(!exists){



            favourites.push(resort);



            localStorage.setItem(

                "favourites",

                JSON.stringify(favourites)

            );



            updateFavouriteButtons();



        }




    }



});






// OPEN FAVOURITES


document.getElementById("show-favourites").onclick = function(){

    document.getElementById("show-voting").onclick = function(){

    displayVoting();

    document.getElementById("voting-modal")
    .style.display = "block";

};

    document.addEventListener("click", function(e){


    if(e.target.classList.contains("vote-button")){


        const resort = e.target.dataset.name;


        votes[resort] =
        (votes[resort] || 0) + 1;


        localStorage.setItem(
            "votes",
            JSON.stringify(votes)
        );


        displayVoting();


    }


});
document.querySelector(".voting-close").onclick = function(){

    document.getElementById("voting-modal")
    .style.display = "none";

};
    displayFavourites();

    // FAMILY VOTING DISPLAY

function displayVoting(){

    const list = document.getElementById("voting-list");


    if(favourites.length === 0){

        list.innerHTML = `
        <p>
        Save some favourite resorts first before voting.
        </p>
        `;

        return;

    }


    list.innerHTML = favourites.map(resort => {


        return `

        <div class="recommend-card">


            <img src="${resort.image}" width="100%">


            <h3>
            ${resort.resort}
            </h3>


            <p>
            ${resort.city}, ${resort.country}
            </p>


            <p>
            ⭐ ${resort.familyScore}/100 Family Score
            </p>


            <p>
            Votes:
            ${votes[resort.resort] || 0}
            </p>


            <button 
            class="vote-button"
            data-name="${resort.resort}">
            
            🗳 Vote For This Resort

            </button>


        </div>

        `;


    }).join("");

}


    document.getElementById("favourites-modal").style.display = "block";


};






function displayFavourites(){



    const list = document.getElementById("favourites-list");




    if(favourites.length === 0){


        list.innerHTML =

        "<p>No favourites saved yet.</p>";


        return;


    }
    
    // DISPLAY SAVED HOLIDAYS

function displaySavedHolidays(){

    const container =
        document.getElementById("saved-holidays-list");

    if(!container){
        return;
    }

    const savedHolidays =
        JSON.parse(
            localStorage.getItem("savedHolidays")
        ) || [];

    if(savedHolidays.length === 0){

        container.innerHTML =
            "<p>No saved holidays yet.</p>";

        return;

    }

    container.innerHTML =
        savedHolidays.map(holiday => `

        <div class="saved-holiday-card">

            <img
                src="${holiday.image}"
                alt="${holiday.resort}"
            >

            <div class="saved-holiday-info">

                <h3>${holiday.resort}</h3>

                <p>
                    📍 ${holiday.city},
                    ${holiday.country}
                </p>

                <p>
                    👨‍👩‍👧‍👦
                    ${holiday.adults} Adults +
                    ${holiday.children} Children
                </p>

                <p>
                    🌙 ${holiday.nights} Nights
                </p>

                <strong class="saved-holiday-total">
                    $${holiday.total.toLocaleString()}
                </strong>

                <small>
                    Saved ${holiday.savedDate}
                </small>

                <button
                    class="delete-saved-holiday"
                    data-id="${holiday.id}">

                    🗑 Delete

                </button>

            </div>

        </div>

    `).join("");

}
    

// SAVED HOLIDAYS

document.addEventListener("click", function(e){

    if(e.target.id === "show-saved-holidays"){

        displaySavedHolidays();

        document.getElementById(
            "saved-holidays-modal"
        ).style.display = "block";

    }

});


// DISPLAY SAVED HOLIDAYS

function displaySavedHolidays(){

    const container =
        document.getElementById(
            "saved-holidays-list"
        );

    // ...the rest of Step 7D...
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
            data-resort="${encodeURIComponent(JSON.stringify(resort))}">

            View Resort

            </button>




            <button

            class="remove-favourite"

            data-name="${resort.resort}">

            ❌ Remove

            </button>



        </div>



    `).join("");



}

document.addEventListener("click", function(e){

    if(
        e.target.classList.contains(
            "saved-holidays-close"
        )
    ){

        document.getElementById(
            "saved-holidays-modal"
        ).style.display = "none";

    }

});
document.addEventListener("click", function(e){

    if(
        !e.target.classList.contains(
            "delete-saved-holiday"
        )
    ){
        return;
    }

    const id =
        Number(e.target.dataset.id);

    let savedHolidays =
        JSON.parse(
            localStorage.getItem("savedHolidays")
        ) || [];

    savedHolidays =
        savedHolidays.filter(
            holiday => holiday.id !== id
        );

    localStorage.setItem(
        "savedHolidays",
        JSON.stringify(savedHolidays)
    );

    displaySavedHolidays();

});
document.getElementById("show-voting").onclick = function(){

    displayVoting();

    document.getElementById("voting-modal")
    .style.display = "block";

};

document.addEventListener("click", function(e){

    if(e.target.classList.contains("vote-button")){

        const resort =
        e.target.dataset.name;

        votes[resort] =
        (votes[resort] || 0) + 1;

        localStorage.setItem(
            "votes",
            JSON.stringify(votes)
        );

        displayVoting();

    }

});

document.getElementById("calculate-winner").onclick = function(){

    const results = Object.entries(votes)
    .sort((a,b) => b[1] - a[1]);


    const output = document.getElementById("voting-results");


    if(results.length === 0){

        output.innerHTML = `
        <p>No votes yet.</p>
        `;

        return;

    }


    let medals = [
        "🥇",
        "🥈",
        "🥉"
    ];


    output.innerHTML = `

    <h2>
    🏆 Family Holiday Winner
    </h2>


    ${results.slice(0,3).map((result,index)=>`

        <div class="winner-card">

            <h3>
            ${medals[index] || "🏅"} ${result[0]}
            </h3>


            <p>
            ${result[1]} votes
            </p>

        </div>


    `).join("")}


    `;


};

document.querySelector(".voting-close").onclick = function(){

    document.getElementById("voting-modal")
    .style.display = "none";

};

document.getElementById("open-budget").onclick = function(){

    document.getElementById("budget-modal")
    .style.display = "block";

};


document.querySelector(".budget-close").onclick = function(){

    document.getElementById("budget-modal")
    .style.display = "none";

};
document.getElementById("calculate-budget").onclick = function(){


let adults =
Number(document.getElementById("budget-adults").value);


let children =
Number(document.getElementById("budget-children").value);


let people = adults + children;


let nights =
Number(document.getElementById("budget-nights").value);


let selectedResort =
document.getElementById("budget-resort").value;


let resort =
allResorts.find(
    r => r.resort === selectedResort
);


let resortCost =
resort.nightlyCost * nights;


let flights =
people *
Number(document.getElementById("budget-flight").value);


let food =
Number(document.getElementById("budget-food").value)
* nights;


let activities =
Number(document.getElementById("budget-activities").value);


let transfers =
Number(document.getElementById("budget-transfers").value);



let total =
resortCost +
flights +
food +
activities +
transfers;



let valueBadge = "💰 Great Value";

if(resort.familyScore >= 95){
    valueBadge = "🏆 Family Favourite";
}
else if(resort.nightlyCost >= 300){
    valueBadge = "💎 Luxury Escape";
}
else if(resort.nightlyCost <= 220){
    valueBadge = "🔥 Budget Friendly";
}

document.getElementById("budget-results").innerHTML = `

<div class="budget-result-card">

    <img
        src="${resort.image}"
        class="budget-image"
    >

    <h2>${resort.resort}</h2>

    <div class="value-badge">
        ${valueBadge}
    </div>

    <div class="budget-breakdown">

    <h3>💰 Where Your Money Goes</h3>

    <div class="cost-item">

        <div class="cost-header">
            <span>🏨 Accommodation</span>
            <strong>$${resortCost.toLocaleString()}</strong>
        </div>

        <div class="cost-bar">
            <div
                class="cost-fill accommodation"
                style="width: ${total > 0 ? (resortCost / total * 100) : 0}%">
            </div>
        </div>

    </div>


    <div class="cost-item">

        <div class="cost-header">
            <span>✈️ Flights</span>
            <strong>$${flights.toLocaleString()}</strong>
        </div>

        <div class="cost-bar">
            <div
                class="cost-fill flights"
                style="width: ${total > 0 ? (flights / total * 100) : 0}%">
            </div>
        </div>

    </div>


    <div class="cost-item">

        <div class="cost-header">
            <span>🍽 Food</span>
            <strong>$${food.toLocaleString()}</strong>
        </div>

        <div class="cost-bar">
            <div
                class="cost-fill food"
                style="width: ${total > 0 ? (food / total * 100) : 0}%">
            </div>
        </div>

    </div>


    <div class="cost-item">

        <div class="cost-header">
            <span>🎢 Activities</span>
            <strong>$${activities.toLocaleString()}</strong>
        </div>

        <div class="cost-bar">
            <div
                class="cost-fill activities"
                style="width: ${total > 0 ? (activities / total * 100) : 0}%">
            </div>
        </div>

    </div>


    <div class="cost-item">

        <div class="cost-header">
            <span>🚕 Transfers</span>
            <strong>$${transfers.toLocaleString()}</strong>
        </div>

        <div class="cost-bar">
            <div
                class="cost-fill transfers"
                style="width: ${total > 0 ? (transfers / total * 100) : 0}%">
            </div>
        </div>

    </div>

</div>

    <hr>

    <div class="budget-total">

    <div class="total-main">
        <span>💰 Total Holiday Cost</span>
        <strong>$${total.toLocaleString()}</strong>
    </div>

    <div class="budget-stats">

        <div>
            <span>👨‍👩‍👧‍👦 Per Person</span>
            <strong>$${Math.round(total / people).toLocaleString()}</strong>
        </div>

        <div>
            <span>🌙 Per Night</span>
            <strong>$${Math.round(total / nights).toLocaleString()}</strong>
        </div>

    </div>

</div>

    <p>⭐ Family Score: ${resort.familyScore}/100</p>
    <p>🏊 Pool Rating: ${resort.poolRating}/5</p>
    <p>👧 Kids Club Rating: ${resort.kidsClubRating}/5</p>
    <p>🏖 Beach Rating: ${resort.beachRating}/5</p>

    <button
    id="save-holiday"
    class="save-holiday-button">

    💾 Save This Holiday

</button>
    
    <div class="budget-comparison">

    <h3>🔄 Compare Your Resort</h3>

    <div id="budget-comparison-options"></div>

</div>

</div>

`;
const cheaperResorts =
    allResorts
    .filter(r => r.nightlyCost < resort.nightlyCost)
    .sort((a, b) => b.nightlyCost - a.nightlyCost);

const luxuryResorts =
    allResorts
    .filter(r => r.nightlyCost > resort.nightlyCost)
    .sort((a, b) => a.nightlyCost - b.nightlyCost);


const budgetOption =
    cheaperResorts.length
    ? cheaperResorts[0]
    : null;


const luxuryOption =
    luxuryResorts.length
    ? luxuryResorts[0]
    : null;


let comparisonHTML = "";


if(budgetOption){

    const budgetTotal =
        (budgetOption.nightlyCost * nights) +
        flights +
        food +
        activities +
        transfers;

    const saving =
        total - budgetTotal;

    comparisonHTML += `

        <div class="comparison-card budget-option">

            <div class="comparison-icon">
                🔥
            </div>

            <div class="comparison-info">

                <h4>Budget Option</h4>

                <strong>
                    ${budgetOption.resort}
                </strong>

                <span>
                    ${budgetOption.priceDisplay}
                </span>

                <span class="comparison-total">
                    $${budgetTotal.toLocaleString()} total
                </span>

                <span class="saving">
                    Save $${saving.toLocaleString()}
                </span>

            </div>

        </div>

    `;

}


if(luxuryOption){

    const luxuryTotal =
        (luxuryOption.nightlyCost * nights) +
        flights +
        food +
        activities +
        transfers;

    const difference =
        luxuryTotal - total;

    comparisonHTML += `

        <div class="comparison-card luxury-option">

            <div class="comparison-icon">
                💎
            </div>

            <div class="comparison-info">

                <h4>Luxury Option</h4>

                <strong>
                    ${luxuryOption.resort}
                </strong>

                <span>
                    ${luxuryOption.priceDisplay}
                </span>

                <span class="comparison-total">
                    $${luxuryTotal.toLocaleString()} total
                </span>

                <span class="difference">
                    +$${difference.toLocaleString()}
                </span>

            </div>

        </div>

    `;

}


const comparisonContainer =
    document.getElementById(
        "budget-comparison-options"
    );


if(comparisonContainer){

    comparisonContainer.innerHTML =
        comparisonHTML;

}
};

// SAVE HOLIDAY BUDGET

document.addEventListener("click", function(e){

    if(e.target.id !== "save-holiday"){
        return;
    }

    const selectedResort =
        document.getElementById("budget-resort").value;

    const resort =
        allResorts.find(
            r => r.resort === selectedResort
        );

    if(!resort){
        return;
    }

    const adults =
        Number(
            document.getElementById("budget-adults").value
        );

    const children =
        Number(
            document.getElementById("budget-children").value
        );

    const nights =
        Number(
            document.getElementById("budget-nights").value
        );

    const flights =
        (adults + children) *
        Number(
            document.getElementById("budget-flight").value
        );

    const food =
        Number(
            document.getElementById("budget-food").value
        ) *
        nights;

    const activities =
        Number(
            document.getElementById("budget-activities").value
        );

    const transfers =
        Number(
            document.getElementById("budget-transfers").value
        );

    const accommodation =
        resort.nightlyCost * nights;

    const total =
        accommodation +
        flights +
        food +
        activities +
        transfers;

    const savedHoliday = {

        id: Date.now(),

        resort: resort.resort,

        country: resort.country,

        city: resort.city,

        image: resort.image,

        adults: adults,

        children: children,

        nights: nights,

        flights: flights,

        food: food,

        activities: activities,

        transfers: transfers,

        accommodation: accommodation,

        total: total,

        savedDate:
            new Date().toLocaleDateString()

    };

    let savedHolidays =
        JSON.parse(
            localStorage.getItem("savedHolidays")
        ) || [];

    savedHolidays.push(savedHoliday);

    localStorage.setItem(
        "savedHolidays",
        JSON.stringify(savedHolidays)
    );

    alert("💾 Holiday saved successfully!");

});

// FAMILY PRESETS

document.addEventListener("click", function(e){

    if(!e.target.classList.contains("family-preset")){
        return;
    }

    const adults =
    e.target.dataset.adults;

    const children =
    e.target.dataset.children;

    document.getElementById("budget-adults").value = adults;

    document.getElementById("budget-children").value = children;

    document.querySelectorAll(".family-preset").forEach(button => {
        button.classList.remove("active");
    });

    e.target.classList.add("active");

});

// REMOVE FAVOURITE


document.addEventListener("click", function(e){



    if(e.target.classList.contains("remove-favourite")){



        const name = e.target.dataset.name;



        favourites = favourites.filter(

            r => r.resort !== name

        );



        localStorage.setItem(

            "favourites",

            JSON.stringify(favourites)

        );



        displayFavourites();

        updateFavouriteButtons();



    }



});





// CLEAR ALL FAVOURITES


document.getElementById("clear-favourites").onclick = function(){


    favourites = [];


    localStorage.removeItem("favourites");


    displayFavourites();


    updateFavouriteButtons();


};

// COMPARE FAVOURITES


document.getElementById("compare-favourites").onclick = function(){


    showComparison();


    document.getElementById("compare-modal").style.display = "block";


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







document.querySelector(".close").onclick = function(){


    document.getElementById("resort-modal").style.display = "none";


};






document.querySelector(".finder-close").onclick = function(){


    document.getElementById("finder-modal").style.display = "none";


};






document.querySelector(".favourites-close").onclick = function(){


    document.getElementById("favourites-modal").style.display = "none";


};






document.addEventListener("click", function(e){


    if(e.target.classList.contains("compare-close")){


        document.getElementById("compare-modal").style.display = "none";


    }


});
// OPEN BUDGET FROM HERO BUTTON

document.addEventListener("click", function(e){

    if(e.target.id === "open-budget"){

        document.getElementById("budget-modal")
        .style.display = "block";

    }

});

document.querySelector(".budget-close").onclick = function(){

    document.getElementById("budget-modal")
    .style.display = "none";

};

// CLICK OUTSIDE POPUPS TO CLOSE

window.onclick = function(event){

    const resortModal =
    document.getElementById("resort-modal");

    const finderModal =
    document.getElementById("finder-modal");

    const favouritesModal =
    document.getElementById("favourites-modal");

    const compareModal =
    document.getElementById("compare-modal");

    if(event.target === resortModal){
        resortModal.style.display = "none";
    }

    if(event.target === finderModal){
        finderModal.style.display = "none";
    }

    if(event.target === favouritesModal){
        favouritesModal.style.display = "none";
    }

    if(event.target === compareModal){
        compareModal.style.display = "none";
    }

};

// DISPLAY SAVED HOLIDAYS

function displaySavedHolidays(){

    const container =
        document.getElementById("saved-holidays-list");

    if(!container){
        return;
    }

    const savedHolidays =
        JSON.parse(
            localStorage.getItem("savedHolidays")
        ) || [];

    if(savedHolidays.length === 0){

        container.innerHTML =
            "<p>No saved holidays yet.</p>";

        return;
    }

    container.innerHTML =
        savedHolidays.map(holiday => `

        <div class="saved-holiday-card">

            <img
                src="${holiday.image}"
                alt="${holiday.resort}"
            >

            <div class="saved-holiday-info">

                <h3>${holiday.resort}</h3>

                <p>
                    📍 ${holiday.city},
                    ${holiday.country}
                </p>

                <p>
                    👨‍👩‍👧‍👦
                    ${holiday.adults} Adults +
                    ${holiday.children} Children
                </p>

                <p>
                    🌙 ${holiday.nights} Nights
                </p>

                <strong class="saved-holiday-total">
                    $${holiday.total.toLocaleString()}
                </strong>

                <small>
                    Saved ${holiday.savedDate}
                </small>

                <button
                    class="delete-saved-holiday"
                    data-id="${holiday.id}">
                    🗑 Delete
                </button>

            </div>

        </div>

    `).join("");

}


// OPEN SAVED HOLIDAYS

document.addEventListener("click", function(e){

    if(e.target.id === "show-saved-holidays"){

        displaySavedHolidays();

        document.getElementById(
            "saved-holidays-modal"
        ).style.display = "block";

    }

});

// SAVED HOLIDAYS BUTTON

const savedHolidayButton =
    document.getElementById("show-saved-holidays");

if(savedHolidayButton){

    savedHolidayButton.onclick = function(){

        displaySavedHolidays();

        document.getElementById(
            "saved-holidays-modal"
        ).style.display = "block";

    };

}
console.log("APP JS FINISHED LOADING");
