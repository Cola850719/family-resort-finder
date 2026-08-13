// ==========================================
// FLIGHTS.JS
// ==========================================

console.log("Flights JS loaded");

const FLIGHTS_API_URL =
    "https://YOUR-VERCEL-DOMAIN.vercel.app/api/flights";


document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("Initialising Flights");


        // ==========================================
        // FIND FLIGHTS BUTTON
        // ==========================================

        const findFlightsButton =
            document.getElementById("find-flights");

        if (findFlightsButton) {

            console.log(
                "Find Flights button found"
            );

            findFlightsButton.onclick =
                function () {

                    const flightSection =
                        document.getElementById(
                            "flight-search-section"
                        );

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

                };

        }


        // ==========================================
        // SEARCH FLIGHTS BUTTON
        // ==========================================

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
                    document.getElementById(
                        "flight-from"
                    );

                const toElement =
                    document.getElementById(
                        "flight-to"
                    );

                const departureElement =
                    document.getElementById(
                        "flight-departure"
                    );

                const returnElement =
                    document.getElementById(
                        "flight-return"
                    );

                const adultsElement =
                    document.getElementById(
                        "flight-adults"
                    );

                const childrenElement =
                    document.getElementById(
                        "flight-children"
                    );

                const cabinElement =
                    document.getElementById(
                        "flight-class"
                    );

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


                // ==================================
                // VALIDATION
                // ==================================

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


                // ==================================
                // LOADING
                // ==================================

                searchFlightsButton.disabled =
                    true;

                message.innerHTML =
                    "✈️ Searching Google Flights...";


                try {

                    const params =
                        new URLSearchParams({

                            departure_id:
                                from,

                            arrival_id:
                                to,

                            outbound_date:
                                departure,

                            return_date:
                                returnDate,

                            travel_class:
                                cabin

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
                            "😕 No flights were found for these dates.";

                        removeFlightResults();

                        return;
                    }


                    displayFlightResults(
                        data.results,
                        data.search,
                        adults,
                        children
                    );


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

    }
);


// ==========================================
// DISPLAY RESULTS
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

        section.appendChild(
            resultsContainer
        );

    }


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
                : "ℹ️ Exact dates were unavailable. Showing the nearest available dates.";

    }


    let html = "";

    html +=
        "<div class=\"flight-results-header\">" +

            "<h2>✈️ Flight Results</h2>" +

            "<p>" +

                formatDate(
                    search.outbound_date
                ) +

                " → " +

                formatDate(
                    search.return_date
                ) +

            "</p>" +

            "<p>" +
                adults +
                " Adults, " +
                children +
                " Children" +
            "</p>" +

        "</div>";


    const limitedResults =
        results.slice(0, 10);


    limitedResults.forEach(
        function (flight, index) {

            html += createFlightCard(
                flight,
                index
            );

        }
    );


    resultsContainer.innerHTML =
        html;


    resultsContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ==========================================
// CREATE RESULT CARD
// ==========================================

function createFlightCard(
    flight,
    index
) {

    const segments =
        Array.isArray(flight.flights)
            ? flight.flights
            : [];


    if (!segments.length) {
        return "";
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
        typeof flight.price === "number"
            ? "$" +
                flight.price.toLocaleString(
                    "en-AU"
                ) +
                " AUD"
            : "Price unavailable";


    const logo =
        flight.airline_logo ||
        first.airline_logo ||
        "";


    return (

        "<div class=\"flight-result-card\">" +

            "<div class=\"flight-result-top\">" +

                (
                    logo
                        ? "<img src=\"" +
                          escapeHtml(logo) +
                          "\" alt=\"" +
                          escapeHtml(airline) +
                          "\" class=\"flight-airline-logo\">"
                        : ""
                ) +

                "<div>" +

                    "<strong>" +
                        escapeHtml(airline) +
                    "</strong>" +

                    (
                        first.flight_number
                            ? "<small>" +
                              escapeHtml(
                                  first.flight_number
                              ) +
                              "</small>"
                            : ""
                    ) +

                "</div>" +

            "</div>" +


            "<div class=\"flight-route\">" +

                "<div class=\"flight-time\">" +

                    "<strong>" +
                        escapeHtml(
                            departureTime
                        ) +
                    "</strong>" +

                    "<span>" +
                        escapeHtml(
                            departureCode
                        ) +
                    "</span>" +

                "</div>" +


                "<div class=\"flight-middle\">" +

                    "<span>" +
                        escapeHtml(
                            duration
                        ) +
                    "</span>" +

                    "<span>" +
                        escapeHtml(
                            stopText
                        ) +
                    "</span>" +

                "</div>" +


                "<div class=\"flight-time\">" +

                    "<strong>" +
                        escapeHtml(
                            arrivalTime
                        ) +
                    "</strong>" +

                    "<span>" +
                        escapeHtml(
                            arrivalCode
                        ) +
                    "</span>" +

                "</div>" +

            "</div>" +


            "<div class=\"flight-result-bottom\">" +

                "<strong class=\"flight-price\">" +
                    price +
                "</strong>" +

            "</div>" +

        "</div>"

    );

}


// ==========================================
// REMOVE OLD RESULTS
// ==========================================

function removeFlightResults() {

    const existing =
        document.getElementById(
            "flight-results"
        );

    if (existing) {
        existing.remove();
    }

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(
    value
) {

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


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(
    value
) {

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


// ==========================================
// FORMAT DURATION
// ==========================================

function formatDuration(
    minutes
) {

    if (
        typeof minutes !==
        "number"
    ) {
        return "";
    }


    const hours =
        Math.floor(
            minutes / 60
        );


    const mins =
        minutes % 60;


    return (
        hours +
        "h " +
        mins +
        "m"
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(
    value
) {

    return String(
        value || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
