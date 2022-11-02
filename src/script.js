const ID = "1WUdFK28ijRp-R66PwPcNEekAB01OuxvEPcYfPt01TPE";
const RANGE = "Громада";

export function run(apiKey) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${ID}/values/${RANGE}?key=${apiKey}`;

  fetch(url)
    .then((r) => r.json())
    .then(console.log);
}
