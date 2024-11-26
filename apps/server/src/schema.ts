import { z } from "zod";

export const SalarySchema = z.object({
	min: z.number().int().min(0),
	max: z.number().int().min(0),
	currency: z.string().min(1),
});

export const JobSchema = z.object({
	title: z.string().min(1),
	company: z.string().min(1),
	location: z.string().min(1),
	description: z.string().min(1),
	salary: SalarySchema.optional(),
	skills: z.array(z.string().min(1)),
	applicationUrl: z.string().url().optional(),
	contactEmail: z.string().email().optional(),
});

export const QuestionSchema = z.object({
	question: z.string().min(1),
	answerSelected: z.string().min(1),
});

export const AnalyzeRequestSchema = z.object({
	location: z
		.string()
		.length(3)
		.regex(/^[A-Z]{3}$/, "Invalid country code"), // Enforce 3-letter uppercase country code
	questions: z.array(QuestionSchema),
});

export const AnalyzeResponseSchema = z.object({
	careerRecommendation: z.string().min(1),
	jobs: z.array(JobSchema),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;
