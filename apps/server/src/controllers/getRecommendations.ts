import Groq from "groq-sdk";
import {
	AnalyzeRequestSchema,
	AnalyzeResponseSchema,
	type AnalyzeRequest,
	type AnalyzeResponse,
} from "../schema";

const getModelCompletion = async (prompt: string) => {
	const groq = new Groq({
		apiKey: "",
	});
	const chatCompletion = await groq.chat.completions.create({
		messages: [
			{
				role: "user",
				content: prompt,
			},
		],
		model: "llama3-70b-8192",
		temperature: 1,
		max_tokens: 1024,
		top_p: 1,
		stream: false,
		response_format: {
			type: "json_object",
		},
		stop: null,
	});

	return chatCompletion.choices[0].message.content || "";
};

export default async function generateJobRecommendations(
	request: AnalyzeRequest,
): Promise<AnalyzeResponse> {
	const { location, questions } = request;

	const prompt = `You are a career advisor for a job seeker in the country of ${location}. You have been asked the following questions:
    ${questions.map((question) => question.question).join("\n")}
    Answer the following questions based on the information provided (in JSON format):
    {
        "careerRecommendation": "Provide a recommendation for the user based on the information provided.",
        "jobs": [
            {
                "title": "Provide a title for the job.",
                "company": "Provide the name of the company.",
                "location": "Provide the location of the company.",
                "description": "Provide a description of the job.",
                "skills": ["Provide a list of skills required for the job."],
                "applicationUrl": "Provide the URL for the application form.",
                "contactEmail": "Provide the email address for the contact person."
            }
        ]
    }
    `;
	try {
		const res = await getModelCompletion(prompt);

		return JSON.parse(res);
	} catch (error) {
		console.error("Error generating recommendations:", error);
		throw new Error("Error generating recommendations");
	}
}
