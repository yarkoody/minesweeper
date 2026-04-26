import axios from "axios";

type HttpMethod = "get" | "post";

export async function fetchData<T>(
    url: string,
    endpoint: string,
    method: HttpMethod = "get",
) {
    try {
        const resp =
            method === "post"
                ? await axios.post<T>(`${url}${endpoint}`)
                : await axios.get<T>(`${url}${endpoint}`);

        if (!resp?.data) {
            throw new Error("Failed to fetch leaderboard data");
        }
        console.log(`Fetched ${endpoint} data:`, resp.data);
        return resp.data;
    } catch (error) {
        throw new Error(`Failed to fetch ${endpoint} data: ${error}`);
    }
}
