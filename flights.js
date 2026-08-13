// ==========================================
// FLIGHTS.JS
// ==========================================

console.log("Flights JS loaded");

document.addEventListener("DOMContentLoaded", function () {

    const findFlightsButton =
        document.getElementById("find-flights");

    if (!findFlightsButton) {
        console.error("Find Flights button not found");
        return;
    }

    console.log("Find Flights button found");

    findFlightsButton.addEventListener("click", function () {

        const flightSection =
            document.getElementById("flight-search-section");

        if (!flightSection) {
            console.error("Flight Search section not found");
            return;
        }

        flightSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});
