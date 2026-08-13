// ==========================================
// FLIGHTS.JS
// ==========================================

const FLIGHTS_API_URL =
    "https://family-resort-finder.vercel.app/api/flights";

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


    // ==========================================
    // SEARCH FLIGHTS BUTTON
    // ==========================================

    const searchFlightsButton =
        document.getElementById("search-flights-button");

    if (!searchFlightsButton) {

        console.error(
            "Search Flights button not found"
        );

        return;
    }


    console.log("Search Flights button found");


    searchFlightsButton.addEventListener("click", function () {

        const from =
            document.getElementById("flight-from").value;

        const to =
            document.getElementById("flight-to").value;

        const departure =
            document.getElementById("flight-departure").value;

        const returnDate =
            document.getElementById("flight-return").value;

        const adults =
            document.getElementById("flight-adults").value;

        const children =
            document.getElementById("flight-children").value;

        const cabin =
            document.getElementById("flight-class").value;

        const message =
            document.getElementById(
                "flight-search-message"
            );


        // ==========================================
        // VALIDATION
        // ==========================================

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


// ==========================================
// CALL FLIGHT API
// ==========================================

message.innerHTML =
    "✈️ Searching Google Flights...";

searchFlightsButton.disabled = true;

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

    searchFlightsButton.disabled = false;

}
