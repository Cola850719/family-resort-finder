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

                    <button>
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
