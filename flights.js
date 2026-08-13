// ==========================================
// FLIGHTS.JS
// ==========================================

const FLIGHTS_API_URL =
    "https://family-resort-finder.vercel.app/api/flights";

const flightMaps = {};

let currentFlightResults = [];

let currentFlightSearch = null;

let currentFlightAdults = 0;

let currentFlightChildren = 0;

console.log("Flights JS loaded");

document.addEventListener("DOMContentLoaded", function () {

    console.log("Initialising Flights");


    // ==========================================
    // FIND FLIGHTS BUTTON
    // ==========================================

    const findFlightsButton =
        document.getElementById("find-flights");

    if (findFlightsButton) {

        console.log("Find Flights button found");

        findFlightsButton.addEventListener("click", function () {

            const flightSection =
                document.getElementById("flight-search-section");

            if (!flightSection) {

                console.error(
                    "Flight Search section not found"
                );

                return;
            }

            flightSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }

const searchFlightsButton =
    document.getElementById(
        "search-flights-button"
    );

if (!searchFlightsButton) {

    console.error(
        "Search Flights button not found"
    );

    return;

}

console.log(
    "Search Flights button found"
);
    
   searchFlightsButton.onclick =
    async function () {

        const fromElement =
            document.getElementById("flight-from");

        const toElement =
            document.getElementById("flight-to");

        const departureElement =
            document.getElementById("flight-departure");

        const returnElement =
            document.getElementById("flight-return");

        const adultsElement =
            document.getElementById("flight-adults");

        const childrenElement =
            document.getElementById("flight-children");

        const cabinElement =
            document.getElementById("flight-class");

        const message =
            document.getElementById(
                "flight-search-message"
            );


        if (
            !fromElement ||
            !toElement ||
            !departureElement ||
            !returnElement ||
            !adultsElement ||
            !childrenElement ||
            !cabinElement ||
            !message
        ) {

            console.error(
                "One or more flight form elements are missing."
            );

            return;
        }


        const from =
            fromElement.value;

        const to =
            toElement.value;

        const departure =
            departureElement.value;

        const returnDate =
            returnElement.value;

        const adults =
            Number(
                adultsElement.value
            );

        const children =
            Number(
                childrenElement.value
            );

        const cabin =
            cabinElement.value;


        if (!to) {

            message.innerHTML =
                "⚠️ Please select a destination.";

            return;
        }


        if (!departure) {

            message.innerHTML =
                "⚠️ Please select a departure date.";

            return;
        }


        if (!returnDate) {

            message.innerHTML =
                "⚠️ Please select a return date.";

            return;
        }


        if (
            new Date(returnDate) <=
            new Date(departure)
        ) {

            message.innerHTML =
                "⚠️ Return date must be after the departure date.";

            return;
        }


        message.innerHTML =
            "✈️ Searching Google Flights...";

        searchFlightsButton.disabled =
            true;


        try {

            const params =
                new URLSearchParams({

                    departure_id: from,

                    arrival_id: to,

                    outbound_date: departure,

                    return_date: returnDate,

                    travel_class: cabin

                });


            const response =
                await fetch(
                    FLIGHTS_API_URL +
                    "?" +
                    params.toString()
                );


            const data =
                await response.json();


            console.log(
                "Flight API response:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Flight search failed."
                );

            }


            if (
                !data.results ||
                data.results.length === 0
            ) {

                message.innerHTML =
                    data.message ||
                    "😕 No flights were found.";

                removeFlightResults();

                function removeFlightResults() {

    const existing =
        document.getElementById(
            "flight-results"
        );

    if (existing) {

        existing.remove();

    }

}

                return;
            }

currentFlightResults =
    data.results;

currentFlightSearch =
    data.search;

currentFlightAdults =
    adults;

currentFlightChildren =
    children;

currentFlightSort =
    "best";
            
            displayFlightResults(
                data.results,
                data.search,
                adults,
                children
            );

            addFlightSortControls();

        } catch (error) {

            console.error(
                "Flight search error:",
                error
            );

            message.innerHTML =
                "❌ Flight search failed. " +
                error.message;


        } finally {

            searchFlightsButton.disabled =
                false;
    }

    };

});

// ==========================================
// DISPLAY FLIGHT RESULTS
// ==========================================

function displayFlightResults(
    results,
    search,
    adults,
    children
) {

    const section =
        document.getElementById(
            "flight-search-section"
        );

    const message =
        document.getElementById(
            "flight-search-message"
        );

    if (!section) {
        return;
    }


    // ==========================================
    // LOCAL HELPERS
    // ==========================================

    function formatDate(value) {

        if (!value) {
            return "";
        }

        const date =
            new Date(
                value + "T00:00:00"
            );

        return date.toLocaleDateString(
            "en-AU",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    function formatTime(value) {

        if (!value) {
            return "";
        }

        const date =
            new Date(
                value.replace(
                    " ",
                    "T"
                )
            );

        return date.toLocaleTimeString(
            "en-AU",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    function formatDuration(minutes) {

        if (
            typeof minutes !== "number" ||
            !minutes
        ) {
            return "";
        }

        const hours =
            Math.floor(
                minutes / 60
            );

        const mins =
            minutes % 60;

        return mins === 0
            ? hours + "h"
            : hours + "h " + mins + "m";

    }


    function escapeHtml(value) {

        return String(
            value || ""
        )
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // ==========================================
    // RESULTS CONTAINER
    // ==========================================

    let resultsContainer =
        document.getElementById(
            "flight-results"
        );


    if (!resultsContainer) {

        resultsContainer =
            document.createElement(
                "div"
            );

        resultsContainer.id =
            "flight-results";

        resultsContainer.className =
            "flight-results";

        section.appendChild(
            resultsContainer
        );

    }


    // ==========================================
    // DATE MESSAGE
    // ==========================================

    const exactDates =
        search &&
        search.outbound_date ===
            search.requested_outbound_date &&
        search.return_date ===
            search.requested_return_date;


    if (message) {

        message.innerHTML =
            exactDates
                ? "✅ Flights found for your selected dates."
                : "ℹ️ Showing the nearest available dates.";

    }


    // ==========================================
    // SORT RESULTS
    // ==========================================

    const sorted =
        [...results].sort(
            function (a, b) {

                return (
                    Number(a.price || 999999) -
                    Number(b.price || 999999)
                );

            }
        );


    const cheapest =
        sorted[0];


    const fastest =
        [...results].sort(
            function (a, b) {

                return (
                    Number(a.total_duration || 999999) -
                    Number(b.total_duration || 999999)
                );

            }
        )[0];


    // ==========================================
    // RESULTS HEADER
    // ==========================================

    let html = `

        <div class="flight-results-header">

            <h2>✈️ Flight Results</h2>

            <p>
                ${formatDate(search.outbound_date)}
                →
                ${formatDate(search.return_date)}
            </p>

            <p>
                ${adults} Adults,
                ${children} Children
            </p>

        </div>

        <div class="flight-results-summary">

            <div>
                💰
                <strong>Cheapest</strong>
                <span>
                    $${Number(
                        cheapest.price || 0
                    ).toLocaleString("en-AU")}
                    AUD
                </span>
            </div>

            <div>
                ⚡
                <strong>Fastest</strong>
                <span>
                    ${formatDuration(
                        fastest.total_duration
                    )}
                </span>
            </div>

        </div>

    `;


    // ==========================================
    // RESULT CARDS
    // ==========================================

    sorted
        .slice(0, 10)
        .forEach(
            function (flight) {

                const segments =
                    Array.isArray(
                        flight.flights
                    )
                        ? flight.flights
                        : [];


                if (!segments.length) {
                    return;
                }


                const first =
                    segments[0];

                const last =
                    segments[
                        segments.length - 1
                    ];


                const airline =
                    first.airline ||
                    "Airline";


                const departureCode =
                    first.departure_airport?.id ||
                    "";


                const arrivalCode =
                    last.arrival_airport?.id ||
                    "";


                const departureTime =
                    formatTime(
                        first.departure_airport?.time
                    );


                const arrivalTime =
                    formatTime(
                        last.arrival_airport?.time
                    );


                const duration =
                    formatDuration(
                        flight.total_duration
                    );


                const stops =
                    Math.max(
                        segments.length - 1,
                        0
                    );


                const stopText =
                    stops === 0
                        ? "Direct"
                        : stops +
                            " stop" +
                            (
                                stops > 1
                                    ? "s"
                                    : ""
                            );


                const price =
                    Number(
                        flight.price || 0
                    );


                const logo =
                    flight.airline_logo ||
                    first.airline_logo ||
                    "";


                let badge = "";


                if (
                    flight === cheapest &&
                    flight === fastest
                ) {

                    badge =
                        `<span class="flight-badge best">
                            🏆 BEST VALUE
                        </span>`;

                } else if (
                    flight === cheapest
                ) {

                    badge =
                        `<span class="flight-badge cheapest">
                            💰 CHEAPEST
                        </span>`;

                } else if (
                    flight === fastest
                ) {

                    badge =
                        `<span class="flight-badge fastest">
                            ⚡ FASTEST
                        </span>`;

                }


                html += `

                    <div class="flight-result-card">

                        ${badge}

                        <div class="flight-result-top">

                            <div class="flight-airline">

                                ${
                                    logo
                                        ? `
                                            <img
                                                src="${escapeHtml(logo)}"
                                                alt="${escapeHtml(airline)}"
                                                class="flight-airline-logo"
                                            >
                                        `
                                        : ""
                                }

                                <div>

                                    <strong>
                                        ${escapeHtml(airline)}
                                    </strong>

                                    <small>
                                        ${escapeHtml(
                                            first.flight_number || ""
                                        )}
                                    </small>

                                </div>

                            </div>


                            <div class="flight-price">

                                <strong>
                                    $${price.toLocaleString("en-AU")}
                                </strong>

                                <span>
                                    AUD
                                </span>

                            </div>

                        </div>


                        <div class="flight-route">

                            <div class="flight-time">

                                <strong>
                                    ${escapeHtml(
                                        departureTime
                                    )}
                                </strong>

                                <span>
                                    ${escapeHtml(
                                        departureCode
                                    )}
                                </span>

                            </div>


                            <div class="flight-route-middle">

                                <span>
                                    ${escapeHtml(
                                        duration
                                    )}
                                </span>

                                <div class="flight-line">
                                    ─────────✈
                                </div>

                                <span>
                                    ${escapeHtml(
                                        stopText
                                    )}
                                </span>

                            </div>


                            <div class="flight-time">

                                <strong>
                                    ${escapeHtml(
                                        arrivalTime
                                    )}
                                </strong>

                                <span>
                                    ${escapeHtml(
                                        arrivalCode
                                    )}
                                </span>

                            </div>

                        </div>


                        ${
                            stops > 0
                                ? `
                                    <div class="flight-layover">

                                        🔄
                                        ${stops}
                                        ${stops === 1 ? "stop" : "stops"}

                                        ${
                                            flight.layovers &&
                                            flight.layovers[0]
                                                ? "via " +
                                                  escapeHtml(
                                                      flight.layovers[0].id
                                                  )
                                                : ""
                                        }

                                    </div>
                                `
                                : `
                                    <div class="flight-direct">
                                        ✅ Direct flight
                                    </div>
                                `
                        }

<button
    type="button"
    class="flight-map-toggle"
    data-flight-index="${sorted.indexOf(flight)}"
>
    🗺 Show Flight Path
</button>

<div
    id="flight-map-${sorted.indexOf(flight)}"
    class="flight-path-map"
    style="display:none;"
></div>
                        <div class="flight-card-footer">

                        
    <span>
        ${escapeHtml(
            first.travel_class ||
            "Economy"
        )}
    </span>

    ${
        first.airplane
            ? `
                <span>
                    ✈️
                    ${escapeHtml(
                        first.airplane
                    )}
                </span>
              `
            : ""
    }

    <a
        href="${escapeHtml(
            search.google_flights_url || ""
        )}"
        target="_blank"
        rel="noopener noreferrer"
        class="flight-view-button"
    >
        View Flight ↗
    </a>

</div>

                    </div>

                `;

            }
        );


    resultsContainer.innerHTML =
        html;


    resultsContainer.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

}

// ==========================================
// AIRPORT COORDINATES
// ==========================================

const flightAirportCoordinates = {

    SYD: [-33.9399, 151.1753],

    SIN: [1.3644, 103.9915],

    HKT: [8.1132, 98.3169],

    KUL: [2.7456, 101.7072],

    BKK: [13.6900, 100.7501],

    DPS: [-8.7482, 115.1672],

    LGK: [6.3297, 99.7287],

    PEN: [5.2971, 100.2769],

    BKI: [5.9371, 116.0510],

    DAD: [16.0439, 108.1994],

    PQC: [10.1698, 103.9931],

    CXR: [11.9982, 109.2194],

    REP: [13.4107, 103.8128],

    PNH: [11.5466, 104.8441]

};

// ==========================================
// CREATE FLIGHT PATH MAP
// ==========================================

function createFlightPathMap(
    containerId,
    flight
) {

    if (typeof L === "undefined") {

        console.error(
            "Leaflet has not loaded."
        );

        return;
    }


    const container =
        document.getElementById(
            containerId
        );

    if (!container) {

        console.error(
            "Map container not found:",
            containerId
        );

        return;
    }


    // ------------------------------------------
    // Remove an existing Leaflet map
    // ------------------------------------------

    if (flightMaps[containerId]) {

        flightMaps[containerId].remove();

        delete flightMaps[containerId];

    }


    // Clear the container completely

    container.innerHTML = "";


    // ------------------------------------------
    // Get flight segments
    // ------------------------------------------

    const segments =
        Array.isArray(
            flight.flights
        )
            ? flight.flights
            : [];


    if (!segments.length) {

        console.error(
            "No flight segments found."
        );

        return;
    }


    // ------------------------------------------
    // Build airport list
    // ------------------------------------------

    const airportIds = [];


    segments.forEach(
        function (segment) {

            const departure =
                segment.departure_airport?.id;

            const arrival =
                segment.arrival_airport?.id;


            if (
                departure &&
                !airportIds.includes(
                    departure
                )
            ) {

                airportIds.push(
                    departure
                );

            }


            if (
                arrival &&
                !airportIds.includes(
                    arrival
                )
            ) {

                airportIds.push(
                    arrival
                );

            }

        }
    );


    // ------------------------------------------
    // Convert airports to coordinates
    // ------------------------------------------

    const coordinates =
        airportIds
            .map(
                function (airport) {

                    return (
                        flightAirportCoordinates[
                            airport
                        ]
                    );

                }
            )
            .filter(Boolean);


    if (
        coordinates.length < 2
    ) {

        console.error(
            "Not enough airport coordinates:",
            airportIds
        );

        return;
    }


    // ------------------------------------------
    // Create Leaflet map
    // ------------------------------------------

    const map =
        L.map(
            container,
            {
                scrollWheelZoom: false
            }
        );


    flightMaps[containerId] =
        map;


    // ------------------------------------------
    // Map tiles
    // ------------------------------------------

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    // ------------------------------------------
    // Draw route
    // ------------------------------------------

    const route =
        L.polyline(
            coordinates,
            {
                weight: 4,
                opacity: 0.8
            }
        ).addTo(map);


    // ------------------------------------------
    // Add airport markers
    // ------------------------------------------

    airportIds.forEach(
        function (airport) {

            const coords =
                flightAirportCoordinates[
                    airport
                ];


            if (!coords) {
                return;
            }


            L.marker(
                coords
            )
                .addTo(map)
                .bindPopup(
                    "<strong>" +
                    airport +
                    "</strong>"
                );

        }
    );


    // ------------------------------------------
    // Fit map to route
    // ------------------------------------------

    map.fitBounds(
        route.getBounds(),
        {
            padding: [30, 30]
        }
    );


    // ------------------------------------------
    // Fix hidden-container sizing
    // ------------------------------------------

    setTimeout(
        function () {

            map.invalidateSize();

        },
        150
    );

}


// ==========================================
// FLIGHT MAP BUTTON
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".flight-map-toggle"
            );


        if (!button) {
            return;
        }


        const index =
            Number(
                button.dataset.flightIndex
            );


        const mapContainer =
            document.getElementById(
                "flight-map-" + index
            );


        if (!mapContainer) {

            console.error(
                "Flight map container not found."
            );

            return;

        }


        const flight =
            currentFlightResults[index];


        if (!flight) {

            console.error(
                "Flight result not found:",
                index
            );

            return;

        }


        const isHidden =
            mapContainer.style.display ===
            "none";


        if (isHidden) {

            mapContainer.style.display =
                "block";

            button.textContent =
                "🗺 Hide Flight Path";


            createFlightPathMap(
                mapContainer.id,
                flight
            );


        } else {

            mapContainer.style.display =
                "none";

            button.textContent =
                "🗺 Show Flight Path";

        }

    }
);

// ==========================================
// FLIGHT SORT CONTROLS
// ==========================================

let currentFlightSort =
    "best";


function addFlightSortControls() {

    const resultsContainer =
        document.getElementById(
            "flight-results"
        );

    if (!resultsContainer) {
        return;
    }


    const oldControls =
        document.getElementById(
            "flight-sort-controls"
        );

    if (oldControls) {
        oldControls.remove();
    }


    const controls =
        document.createElement(
            "div"
        );

    controls.id =
        "flight-sort-controls";

    controls.className =
        "flight-sort-controls";


    controls.innerHTML = `

        <button
            type="button"
            class="flight-sort-button ${
                currentFlightSort === "best"
                    ? "active"
                    : ""
            }"
            data-sort="best"
        >
            🏆 Best Value
        </button>

        <button
            type="button"
            class="flight-sort-button ${
                currentFlightSort === "cheapest"
                    ? "active"
                    : ""
            }"
            data-sort="cheapest"
        >
            💰 Cheapest
        </button>

        <button
            type="button"
            class="flight-sort-button ${
                currentFlightSort === "fastest"
                    ? "active"
                    : ""
            }"
            data-sort="fastest"
        >
            ⚡ Fastest
        </button>

    `;


    resultsContainer.insertBefore(
        controls,
        resultsContainer.firstChild
    );

}


// ==========================================
// SORT FLIGHT RESULTS
// ==========================================

function sortFlightResults(
    results,
    sortType
) {

    const sorted =
        [...results];


    // --------------------------------------
    // CHEAPEST
    // --------------------------------------

    if (
        sortType ===
        "cheapest"
    ) {

        sorted.sort(
            function (a, b) {

                return (
                    Number(
                        a.price || 999999
                    ) -
                    Number(
                        b.price || 999999
                    )
                );

            }
        );

        return sorted;
    }


    // --------------------------------------
    // FASTEST
    // --------------------------------------

    if (
        sortType ===
        "fastest"
    ) {

        sorted.sort(
            function (a, b) {

                return (
                    Number(
                        a.total_duration ||
                        999999
                    ) -
                    Number(
                        b.total_duration ||
                        999999
                    )
                );

            }
        );

        return sorted;
    }


    // --------------------------------------
    // BEST VALUE
    // --------------------------------------

    sorted.sort(
        function (a, b) {

            const priceA =
                Number(
                    a.price ||
                    999999
                );

            const priceB =
                Number(
                    b.price ||
                    999999
                );


            const durationA =
                Number(
                    a.total_duration ||
                    999999
                );

            const durationB =
                Number(
                    b.total_duration ||
                    999999
                );


            const stopsA =
                Math.max(
                    (
                        a.flights?.length ||
                        1
                    ) - 1,
                    0
                );


            const stopsB =
                Math.max(
                    (
                        b.flights?.length ||
                        1
                    ) - 1,
                    0
                );


            // Lower score = better

            const scoreA =
                priceA +
                (
                    durationA * 0.35
                ) +
                (
                    stopsA * 120
                );


            const scoreB =
                priceB +
                (
                    durationB * 0.35
                ) +
                (
                    stopsB * 120
                );


            return (
                scoreA - scoreB
            );

        }
    );


    return sorted;

}


// ==========================================
// SORT BUTTON CLICK
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".flight-sort-button"
            );


        if (!button) {
            return;
        }


        if (
            !currentFlightResults ||
            !currentFlightResults.length
        ) {

            return;
        }


        currentFlightSort =
            button.dataset.sort;


        currentFlightResults =
            sortFlightResults(
                currentFlightResults,
                currentFlightSort
            );


        displayFlightResults(
            currentFlightResults,
            currentFlightSearch,
            currentFlightAdults,
            currentFlightChildren
        );


        addFlightSortControls();

    }
);
