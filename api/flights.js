export default async function handler(req, res) {

    try {

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
                error: "Missing required flight parameters"
            });

        }

        const apiKey =
            process.env.SERPAPI_KEY;

        if (!apiKey) {

            return res.status(500).json({
                error: "SERPAPI_KEY is not configured"
            });

        }

        const params =
            new URLSearchParams();

        params.set(
            "engine",
            "google_flights"
        );

        params.set(
            "api_key",
            apiKey
        );

        params.set(
            "departure_id",
            departure_id
        );

        params.set(
            "arrival_id",
            arrival_id
        );

        params.set(
            "outbound_date",
            outbound_date
        );

        params.set(
            "return_date",
            return_date
        );

        params.set(
            "travel_class",
            travel_class || "1"
        );

        params.set(
            "currency",
            "AUD"
        );

        params.set(
            "gl",
            "au"
        );

        params.set(
            "hl",
            "en"
        );

        params.set(
            "type",
            "1"
        );

        const apiUrl =
            "https://serpapi.com/search?" +
            params.toString();

        const response =
            await fetch(apiUrl);

        const data =
            await response.json();

        if (!response.ok) {

            return res
                .status(response.status)
                .json(data);

        }

        return res
            .status(200)
            .json(data);

    } catch (error) {

        console.error(
            "Flight API error:",
            error
        );

        return res.status(500).json({

            error:
                "Flight API failed",

            message:
                error.message

        });

    }

}
