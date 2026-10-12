const API = "";
const form = document.querySelector("#report-form");
const message = document.querySelector("#form-message");
const description = document.querySelector("#description");
const emptyAnalysis = document.querySelector("#analysis-empty");
const resultBox = document.querySelector("#analysis-result");
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function showAnalysis(result) {
  emptyAnalysis.classList.add("hidden");
  resultBox.classList.remove("hidden");
  resultBox.innerHTML = `<div class="result-row"><span>Suggested hazard</span><b>${escapeHtml(result.hazard)}</b></div>
    <div class="result-row"><span>Urgency estimate</span><span class="pill ${escapeHtml(result.urgency)}">${escapeHtml(result.urgency)}</span></div>
    <div class="result-row"><span>Text match confidence</span><b>${Math.round(result.confidence * 100)}%</b></div>
    <div class="confidence"><span style="width:${Math.round(result.confidence * 100)}%"></span></div>`;
}
async function loadDashboard() {
  try {
    const [statsRes, reportsRes] = await Promise.all([fetch(API + "/api/stats"), fetch(API + "/api/reports")]);
    if (!statsRes.ok || !reportsRes.ok) throw new Error("API unavailable");
    const stats = await statsRes.json(), reports = await reportsRes.json();
    document.querySelector("#stat-total").textContent = stats.total;
    document.querySelector("#stat-high").textContent = stats.high;
    document.querySelector("#stat-types").textContent = stats.types;
    document.querySelector("#feed-count").textContent = `${reports.length} ${reports.length === 1 ? "report" : "reports"}`;
    const list = document.querySelector("#incident-list");
    if (!reports.length) { list.innerHTML = '<div class="empty-feed"><span>◷</span><b>No reports yet</b><small>New community reports will appear here.</small></div>'; return; }
    const icons = {flood:"≈",fire:"♨",earthquake:"⌁",cyclone:"◉",landslide:"△",medical:"＋",other:"•"};
    list.innerHTML = reports.slice(0, 8).map(report => {
      const when = new Date(report.created_at).toLocaleString();
      return `<article class="incident-row"><div class="incident-icon">${icons[report.hazard] || "•"}</div><div class="incident-main"><b>${escapeHtml(report.hazard)} · ${escapeHtml(report.location)}</b><p>${escapeHtml(report.description)}</p></div><div class="incident-meta"><span class="pill ${escapeHtml(report.urgency)}">${escapeHtml(report.urgency)}</span><br>${escapeHtml(when)}</div></article>`;
    }).join("");
  } catch { message.textContent = "Cannot connect to the backend. Start it with: py app.py"; }
}
let analyzeTimer;
description.addEventListener("input", () => {
  clearTimeout(analyzeTimer);
  const text = description.value.trim();
  if (text.length < 5) { emptyAnalysis.classList.remove("hidden"); resultBox.classList.add("hidden"); return; }
  analyzeTimer = setTimeout(async () => {
    try {
      const response = await fetch(API + "/api/analyze", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({description:text})});
      if (response.ok) showAnalysis(await response.json());
    } catch { /* Submit displays a connection message if the backend is unavailable. */ }
  }, 350);
});
form.addEventListener("submit", async event => {
  event.preventDefault(); message.className = "form-message"; message.textContent = "";
  const button = form.querySelector("button"); button.disabled = true; button.innerHTML = "Submitting…";
  try {
    const response = await fetch(API + "/api/reports", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      description:description.value.trim(), location:document.querySelector("#location").value.trim(), contact:document.querySelector("#contact").value.trim()
    })});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not submit this report.");
    showAnalysis(data); message.className = "form-message success";
    message.textContent = `Report #${data.id} saved. Assessment is a demo estimate.`;
    form.reset(); await loadDashboard();
  } catch (error) {
    message.textContent = error.message === "Failed to fetch" ? "Backend is not reachable. In VS Code terminal, run: py app.py" : error.message;
  } finally { button.disabled = false; button.innerHTML = 'Analyze &amp; submit <span>→</span>'; }
});
loadDashboard();
