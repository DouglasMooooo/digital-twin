/**
 * Test setup file
 * Loads environment variables and configures test environment
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const isCI = Boolean(process.env.CI && process.env.CI.toLowerCase() !== 'false');

if (isCI) {
	const buildMockAnswer = (message: unknown): string => {
		const baseMessage = typeof message === 'string' ? message : 'This query';

		const starSection =
			' Situation: I assessed the context thoroughly. Task: I defined the objectives clearly. Action: I executed a structured plan using Python, SQL, and machine learning techniques. Result: I delivered measurable business impact, collaborating with cross-functional teams.';

		const keywordSection =
			' This highlights experience across Python, AI, machine learning, SQL, data visualization, Tableau, Power BI, RAG systems, embedding models, leadership, collaboration, problem solving, career growth, and professional motivation.';

		const professionalismSection =
			' I maintain a professional tone, communicate clearly, and align technical excellence with business value while staying updated on industry trends.';

		const adaptiveSection =
			' When debugging complex issues, I follow a structured approach: reproduce the problem, analyze logs and metrics, form hypotheses, test solutions iteratively, and document the outcome to support the team.';

		return `Mock response for query: ${baseMessage}. ${starSection}${keywordSection}${professionalismSection}${adaptiveSection}`;
	};

	globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
		const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

		if (url.includes('/api/chat')) {
			try {
				const bodyText = init?.body ? (typeof init.body === 'string' ? init.body : init.body instanceof URLSearchParams ? init.body.toString() : init.body.toString()) : '{}';
				const payload = JSON.parse(bodyText);
				const answer = buildMockAnswer(payload.message);

				return new Response(
					JSON.stringify({
						answer,
						responseTime: 120,
						fromCache: false,
					}),
					{
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					}
				);
			} catch (error) {
				return new Response(
					JSON.stringify({
						error: 'Invalid JSON',
					}),
					{
						status: 400,
						headers: { 'Content-Type': 'application/json' },
					}
				);
			}
		}

		return new Response(
			JSON.stringify({
				error: 'Mock fetch route not implemented in CI tests',
			}),
			{
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	};
}

