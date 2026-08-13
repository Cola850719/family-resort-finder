// SerpApi flight proxy
export default async function handler(req, res) {

    if (req.method !== "GET") {

        return res.status(405).json({
            error: "Method not allowed"
        });

    }

    const {
        departure_id,
        arrival_id,
        outbound_date,
        return_date,
        travel_class
    } = req.query;


    if (
        !departure_id ||
        !arrival_id ||
        !outbound_date ||
        !return_date
    ) {

        return res.status(400).json({
            error: "Missing required flight search parameters."
        });

    }


    const apiKey =
        process.env.SERPAPI_KEY;


    if (!apiKey) {

        return res.status(500).json({
            error: "SERPAPI_KEY is not configured."
        });

    }


    const params =
        new URLSearchParams({

            engine: "google_flights",

            api_key: apiKey,

            departure_id:
                departure_id,

            arrival_id:
                arrival_id,

            outbound_date:
                outbound_date,

            return_date:
                return_date,

            travel_class:
                travel_class || "1",

            currency: "AUD",

            gl: "au",

            hl: "en",

            type: "1"

        });


    try {

        const response =
            await fetch(
                "https://serpapi.com/search?" +
                params.toString()
            );


        const data =
            await response.json();


        if (!response.ok) {

            return res.status(
                response.status
            ).json(data);

        }


        return res.status(200).json(data);

    } catch (error) {

        return res.status(500).json({

            error:
                "Flight search failed.",

            details:
                error.message

        });

    }

}
