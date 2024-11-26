import { Hono } from "hono";
import { cors } from "hono/cors";
import generateJobRecommendations from "./controllers/getRecommendations";
import {
	AnalyzeRequestSchema,
	type AnalyzeResponse,
	AnalyzeResponseSchema,
} from "./schema";

const app = new Hono();

app.use(cors());
app.get("/", (c) => {
	return c.json({ message: "Hello World" });
});

app.post("/analyze", async (c) => {
	try {
		const requestBody = await c.req.json();
		const parsedRequest = AnalyzeRequestSchema.parse(requestBody);

		const response: AnalyzeResponse =
			await generateJobRecommendations(parsedRequest);

		const parsedResponse = AnalyzeResponseSchema.parse(response);
		return c.json(parsedResponse, 200);
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error processing request:", error);
			if (error.name === "ZodError") {
				return c.json({ error: error.message }, 400);
			}
			return c.json({ error: "Internal Server Error" }, 500);
		}
		return c.json({ error: "Unknown error" }, 500);
	}
});

export default app;
