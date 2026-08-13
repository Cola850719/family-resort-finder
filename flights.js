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

});
