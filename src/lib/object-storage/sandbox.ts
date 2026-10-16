import { emptyState, execute, seed } from "./model.mjs";
import { lessons } from "./lessons.mjs";
const element = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const chooser = element<HTMLSelectElement>("lesson"),
  editor = element<HTMLTextAreaElement>("request");
const run = element<HTMLButtonElement>("run"),
  next = element<HTMLButtonElement>("next"),
  reset = element<HTMLButtonElement>("reset"),
  restore = element<HTMLButtonElement>("restore-request");
let state = emptyState(),
  lesson: any = null,
  index = 0,
  busy = false,
  hasRun = false;
const freeRequest = {
  op: "PUT",
  key: "notes/hello.txt",
  body: "Hello, object storage.",
};
const json = (v: unknown) => JSON.stringify(v, null, 2);
function lock(value: boolean) {
  busy = value;
  run.disabled = value;
  chooser.disabled = value;
  reset.disabled = value;
  restore.disabled = value;
  next.disabled =
    value || !hasRun || !lesson || index >= lesson.steps.length - 1;
}
function request() {
  return lesson ? lesson.steps[index].request : freeRequest;
}
function showStep() {
  hasRun = false;
  element("progress").textContent = lesson
    ? `Step ${index + 1} of ${lesson.steps.length}`
    : "Free exploration";
  element("request-heading").textContent = lesson
    ? lesson.steps[index].title
    : "Your request";
  element("question").textContent = lesson
    ? lesson.steps[index].question
    : "Store an object, then change op to GET and remove body to read it. The request reference lists the supported fields.";
  editor.value = json(request());
  element("response").hidden = true;
  element("explanation").hidden = true;
  element("response-status").textContent =
    "Predict the result, then run the request.";
  next.hidden = !lesson;
  next.textContent =
    lesson && index === lesson.steps.length - 1 ? "Final step" : "Next step →";
  element("response-summary").hidden = true;
  lock(false);
}
function renderState() {
  const keys = Object.keys(state.objects).sort();
  const visible = keys.filter((k) => !state.objects[k][0].deleted);
  element("state-summary").textContent =
    `${visible.length} current objects · ${keys.reduce((n, k) => n + state.objects[k].length, 0)} retained versions and markers · model time ${state.clock}s`;
  const container = element("objects");
  container.replaceChildren();
  if (!keys.length) {
    const p = document.createElement("p");
    p.textContent = "No stored objects or markers yet.";
    container.append(p);
  }
  for (const key of keys) {
    const versions = state.objects[key],
      current = versions[0];
    const details = document.createElement("details");
    details.className = "object-item";
    const summary = document.createElement("summary");
    summary.textContent = `${key} · ${current.deleted ? "hidden by marker" : `${current.bytes} bytes`} · ${versions.length} version${versions.length === 1 ? "" : "s"}`;
    const body = document.createElement("p");
    body.className = "object-body";
    body.textContent = current.deleted
      ? "Current GET is hidden by a delete marker."
      : `Current body: ${current.body.length > 240 ? current.body.slice(0, 240) + "…" : current.body}`;
    const pre = document.createElement("pre");
    pre.tabIndex = 0;
    pre.setAttribute("aria-label", `Version history for ${key}`);
    pre.textContent = json(versions);
    details.append(summary, body, pre);
    container.append(details);
  }
  element("state-data").textContent = json({
    unfinishedUploads: state.uploads,
    applicationRecords: state.records,
    cache: state.cache,
    eventOutputs: state.outputs,
    completedJobs: state.jobs,
    latestOutput: state.latest,
  });
  element("variables").textContent = json(state.variables);
}
async function load(id: string) {
  lock(true);
  lesson = lessons.find((l) => l.id === id) || null;
  index = 0;
  chooser.value = lesson?.id || "free";
  reset.textContent = lesson ? "Restart lesson" : "Reset bucket";
  state = await seed(lesson?.seed || []);
  element("history").replaceChildren();
  element("lesson-title").textContent = lesson?.title || "Explore freely";
  element("lesson-description").textContent =
    lesson?.description ||
    "Build a small bucket of your own. State survives requests until you restart or reload.";
  element("lesson-scope").textContent =
    lesson?.scope ||
    "All operations use the same local versioned model. No AWS calls are made.";
  const a = element<HTMLAnchorElement>("article-link");
  a.href = lesson?.article || "/learn/databases/object-storage/";
  const url = new URL(location.href);
  url.searchParams.set("lesson", lesson?.id || "free");
  history.replaceState(null, "", url);
  element("starting-data").hidden = lesson?.id !== "vectors";
  renderState();
  showStep();
}
chooser.addEventListener("change", () => {
  element("notice").textContent = "";
  void load(chooser.value);
});
reset.addEventListener("click", () => {
  element("notice").textContent =
    "The lesson’s original state has been restored.";
  void load(chooser.value);
});
restore.addEventListener("click", () => {
  editor.value = json(request());
  element("notice").textContent =
    "Request restored. Bucket state has not changed.";
  editor.focus();
});
next.addEventListener("click", () => {
  if (busy || !lesson || !hasRun || index >= lesson.steps.length - 1) return;
  index++;
  showStep();
  element("request-heading").tabIndex = -1;
  element("request-heading").focus();
});
run.addEventListener("click", async () => {
  if (busy) return;
  lock(true);
  let input: any;
  let result: any;
  try {
    input = JSON.parse(editor.value);
    result = await execute(state, input);
    state = result.state;
  } catch (error) {
    result = {
      response: {
        status: 400,
        error: "InvalidJSON",
        message: error instanceof Error ? error.message : "Enter valid JSON.",
      },
    };
  }
  const output = element("response");
  output.hidden = false;
  output.textContent = json(result.response);
  element("response-status").textContent =
    `Response: ${result.response.status}${result.response.error ? " · " + result.response.error : ""}`;
  hasRun = true;
  const responseSummary = element("response-summary");
  responseSummary.replaceChildren();
  responseSummary.hidden = true;
  element<HTMLDetailsElement>("raw-response").open = true;
  if (input?.op === "VECTOR_QUERY" && result.response.status === 200) {
    responseSummary.hidden = false;
    const table = document.createElement("table");
    const caption = document.createElement("caption");
    caption.textContent =
      "Candidates after filtering, ranked by squared distance";
    table.append(caption);
    const head = document.createElement("tr");
    for (const label of [
      "Passage",
      "Category",
      "Squared distance",
      "Returned",
    ]) {
      const th = document.createElement("th");
      th.textContent = label;
      th.scope = "col";
      head.append(th);
    }
    const thead = document.createElement("thead");
    thead.append(head);
    table.append(thead);
    const tbody = document.createElement("tbody");
    for (const row of result.response.candidates) {
      const tr = document.createElement("tr");
      for (const value of [
        row.key,
        row.category,
        Number(row.squaredDistance.toFixed(6)).toString(),
        result.response.results.some((r: any) => r.key === row.key)
          ? "Yes"
          : "No",
      ]) {
        const td = document.createElement("td");
        td.textContent = value;
        tr.append(td);
      }
      tbody.append(tr);
    }
    table.append(tbody);
    responseSummary.append(table);
    element<HTMLDetailsElement>("raw-response").open = false;
  }
  if (input?.op === "COST" && result.response.status === 200) {
    responseSummary.hidden = false;
    const table = document.createElement("table");
    const caption = document.createElement("caption");
    caption.textContent = "One month at your supplied rates";
    table.append(caption);
    const tbody = document.createElement("tbody");
    for (const [field, label] of [
      ["objects", "Objects per scan"],
      ["expectedGETs", "Expected GET requests"],
      ["storedGB", "Stored GB, including retained copies"],
      ["transferredGB", "Transferred GB, including retries"],
      ["illustrativeMonthlyUnits", "Illustrative monthly cost units"],
    ]) {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = label;
      const td = document.createElement("td");
      td.textContent = new Intl.NumberFormat("en", {
        maximumFractionDigits: 6,
      }).format(result.response[field]);
      tr.append(th, td);
      tbody.append(tr);
    }
    table.append(tbody);
    const note = document.createElement("p");
    note.textContent =
      "Display rounded to six decimal places. " + result.response.assumptions;
    responseSummary.append(table, note);
    element<HTMLDetailsElement>("raw-response").open = false;
  }
  const unedited = lesson && json(input) === json(request());
  element("explanation").hidden = !lesson;
  element("explanation-text").textContent = lesson
    ? unedited && result.response.status === lesson.steps[index].status
      ? lesson.steps[index].explanation
      : "This request or its starting state differs from the guided run. Inspect the actual response and state. Restart the lesson to reproduce the original sequence."
    : "";
  const li = document.createElement("li");
  li.textContent = `${input?.op || "Invalid JSON"} → ${result.response.status}${result.response.error ? " " + result.response.error : ""}`;
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "Request and response";
  const pre = document.createElement("pre");
  pre.textContent = json({
    request: input ?? editor.value,
    response: result.response,
  });
  details.append(summary, pre);
  li.append(details);
  element("history").prepend(li);
  while (element("history").children.length > 30)
    element("history").lastElementChild?.remove();
  if (lesson && index === lesson.steps.length - 1)
    next.textContent =
      unedited && result.response.status === lesson.steps[index].status
        ? "Lesson complete"
        : "Final step";
  renderState();
  lock(false);
});
const initial = new URL(location.href).searchParams.get("lesson");
if (initial && initial !== "free" && !lessons.some((l) => l.id === initial))
  element("notice").textContent =
    "That lesson was not found. Free exploration is open; choose a lesson above.";
void load(initial || lessons[0].id);
