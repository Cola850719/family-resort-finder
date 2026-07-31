fetch("data/resorts.json")
    .then(response => response.json())
    .then(resorts => {

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

                    <p class="score">
                    ⭐ ${resort.familyScore}/100 Family Rating
                    </p>

                    <p class="price">
                    ${resort.priceDisplay}
                    </p>

                    <p>
                    ${resort.description}
                    </p>

                   <button onclick="openResort(${JSON.stringify(resort).replace(/"/g, '&quot;')})">
                   View Resort
                   </button>

                </div>

            `;

            container.appendChild(card);

        });

    })

    .catch(error => {
        console.error("Error loading resorts:", error);
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


    document.getElementById("resort-modal").style.display = "block";
}


document.querySelector(".close").onclick = function() {
    document.getElementById("resort-modal").style.display = "none";
}


window.onclick = function(event) {

    const modal = document.getElementById("resort-modal");

    if (event.target == modal) {
        modal.style.display = "none";
    }

}
