const resources = performance.getEntriesByType("resource");
// console.log(resources);
resources.forEach((resource) => {
	// console.log(resource.name);
});
// Find the total page load span to calculate percentages for the bars
const earliestStart = Math.min(...resources.map((r) => r.startTime));
const latestEnd = Math.max(...resources.map((r) => r.responseEnd));
const totalTime = latestEnd - earliestStart;

const chartData = resources.map((entry) => ({
	name: entry.name.split("/").pop() || entry.name, // Just the filename
	startPct: ((entry.startTime - earliestStart) / totalTime) * 100,
	durationPct: (entry.duration / totalTime) * 100,
	type: entry.initiatorType,
	fullEntry: entry,
}));
// console.log(chartData);
