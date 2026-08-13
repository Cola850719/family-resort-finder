// ==========================================
// FLIGHTS.JS
// ==========================================

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

        findFlightsButton.onclick = function () {

            console.log("FIND FLIGHTS BUTTON CLICKED");

            const flightSection =
                document.getElementById("flight-search-section");

            if (!flightSection) {

                console.error(
                    "flight-search-section not found"
                );

                return;

            }

            const top =
                flightSection.getBoundingClientRect().top +
                window.pageYOffset -
                30;

            window.scrollTo({
                top: top,
                behavior: "smooth"
            });

        };

    } else {

        console.error(
            "find-flights button not found"
        );

    }


    // ==========================================
    // SEARCH FLIGHTS
    // ==========================================

    const searchFlightsButton =
        document.getElementById("search-flights-button");

    if (!searchFlightsButton) {

        console.log(
            "search-flights-button not found yet"
        );

        return;

    }


    searchFlightsButton.onclick = function () {

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
            document.getElementById("flight-search-message");


        if (!message) {

            console.error(
                "flight-search-message not found"
            );

            return;

        }


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
            "✈️ Flight search ready" +
            "<br>" +
            from + " → " + to +
            "<br>" +
            departure + " → " + returnDate +
            "<br>" +
            adults + " Adults, " +
            children + " Children" +
            "<br>" +
            cabin;


        console.log("Flight Search:", {
            from: from,
            to: to,
            departure: departure,
            returnDate: returnDate,
            adults: adults,
            children: children,
            cabin: cabin
        });

    };

});
