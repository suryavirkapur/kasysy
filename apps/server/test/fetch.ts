fetch("http://localhost:8787/analyze", {
	method: "POST",
	body: JSON.stringify({
		location: "IN",
		questions: [
			{ question: "What is your name?", answerSelected: "Surya" },
			{ question: "What is your age?", answerSelected: "25" },
		],
	}),
	verbose: true,
})
	.then((res) => res.json())
	.then((data) => console.log(data));
