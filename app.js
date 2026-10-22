// Oberfläche des RSU-Rechners: liest das Formular, rechnet mit vesting.js und zeichnet alles neu.
const STORAGE_KEY = "rsu-rechner";
const FIELDS = ["company", "shares", "grant", "duration", "cliff", "interval", "price", "currency", "tax"];
const $ = (id) => document.getElementById(id);

const dateFormat = new Intl.DateTimeFormat("de-AT", { day: "2-digit", month: "2-digit", year: "numeric" });
const numberFormat = new Intl.NumberFormat("de-AT");

function money(amount, currency) {
  return new Intl.NumberFormat("de-AT", { style: "currency", currency }).format(amount);
}

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    for (const field of FIELDS) {
      if (saved[field] !== undefined) $(field).value = saved[field];
    }
  } catch {
    // ohne gespeicherte Werte geht es mit den Standardwerten weiter
  }
}

function save() {
  try {
    const values = Object.fromEntries(FIELDS.map((f) => [f, $(f).value]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch {
    // Speichern ist nur Komfort
  }
}

function readInputs() {
  const grant = $("grant").value ? new Date(`${$("grant").value}T00:00:00`) : null;
  const input = {
    company: $("company").value.trim() || "XYZ",
    totalShares: Number($("shares").value),
    grantDate: grant,
    durationMonths: Number($("duration").value),
    cliffMonths: Number($("cliff").value),
    intervalMonths: Number($("interval").value),
    price: Number($("price").value),
    currency: $("currency").value,
    taxRate: Number($("tax").value) / 100,
  };
  if (!Number.isInteger(input.totalShares) || input.totalShares < 1) return { error: "Anzahl RSUs muss eine ganze Zahl ab 1 sein." };
  if (!grant || Number.isNaN(grant.getTime())) return { error: "Bitte ein gültiges Zuteilungsdatum eingeben." };
  if ($("price").value === "") return { error: "Bitte einen gültigen Aktienkurs eingeben." };
  if (!(input.price >= 0)) return { error: "Der Aktienkurs darf nicht negativ sein." };
  if (!(input.taxRate >= 0 && input.taxRate <= 1)) return { error: "Der Steuersatz muss zwischen 0 und 100 % liegen." };
  return { input };
}

function renderChart(schedule, totalShares, today, grantDate) {
  const svg = $("chart");
  const W = 640, H = 220, left = 48, right = 16, top = 12, bottom = 28;
  const start = grantDate;
  const end = schedule.length ? schedule[schedule.length - 1].date : today;
  const span = Math.max(end - start, 1);
  const x = (d) => left + ((d - start) / span) * (W - left - right);
  const y = (shares) => H - bottom - (shares / totalShares) * (H - top - bottom);

  // Treppenkurve: die Summe bleibt bis zum nächsten Termin gleich und springt dann
  let path = `M ${x(start)} ${y(0)}`;
  let current = 0;
  for (const e of schedule) {
    path += ` L ${x(e.date)} ${y(current)} L ${x(e.date)} ${y(e.cumulative)}`;
    current = e.cumulative;
  }
  const area = `${path} L ${x(end)} ${y(0)} Z`;

  const parts = [
    `<line class="axis" x1="${left}" y1="${y(0)}" x2="${W - right}" y2="${y(0)}"/>`,
    `<line class="axis" x1="${left}" y1="${top}" x2="${left}" y2="${y(0)}"/>`,
    `<path class="area" d="${area}"/>`,
    `<path class="line" d="${path}"/>`,
    `<text x="${left - 6}" y="${y(totalShares) + 4}" text-anchor="end">${numberFormat.format(totalShares)}</text>`,
    `<text x="${left - 6}" y="${y(0) + 4}" text-anchor="end">0</text>`,
    `<text x="${x(start)}" y="${H - 8}" text-anchor="start">${dateFormat.format(start)}</text>`,
    `<text x="${x(end)}" y="${H - 8}" text-anchor="end">${dateFormat.format(end)}</text>`,
  ];
  if (today >= start && today <= end) {
    parts.push(
      `<line class="today" x1="${x(today)}" y1="${top}" x2="${x(today)}" y2="${y(0)}"/>`,
      `<text x="${x(today)}" y="${top + 10}" text-anchor="middle">heute</text>`
    );
  }
  svg.innerHTML = parts.join("");
}

function render() {
  const { input, error } = readInputs();
  $("error").hidden = !error;
  $("error").textContent = error || "";
  // bei ungültiger Eingabe die alten Zahlen ausgrauen, damit sie nicht wie aktuelle wirken
  document.querySelector(".results").style.opacity = error ? "0.3" : "";
  if (error) return;

  const today = new Date();
  const schedule = Vesting.buildSchedule(input);
  const status = Vesting.summarize(schedule, input.totalShares, today);
  const fmt = (amount) => money(amount, input.currency);

  $("company-title").textContent = input.company;
  $("vested-shares").textContent = numberFormat.format(status.vested);
  $("vested-value").textContent = fmt(status.vested * input.price);
  $("unvested-shares").textContent = numberFormat.format(status.unvested);
  $("unvested-value").textContent = fmt(status.unvested * input.price);

  if (status.next) {
    // Kalendertage ab Mitternacht zählen, sonst verschiebt die Zeitumstellung den Wert um einen Tag
    const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const days = Math.round((status.next.date - midnight) / 86_400_000);
    const sharesWord = status.next.shares === 1 ? "Aktie" : "Aktien";
    const when = days === 1 ? "morgen" : `in ${days} Tagen`;
    $("next-date").textContent = dateFormat.format(status.next.date);
    $("next-info").textContent = `${numberFormat.format(status.next.shares)} ${sharesWord}, ${fmt(status.next.shares * input.price)}, ${when}`;
  } else {
    $("next-date").textContent = "fertig";
    $("next-info").textContent = "Alle RSUs sind gevestet.";
  }

  const percent = Math.round(status.progress * 1000) / 10;
  $("progress-text").textContent = `${numberFormat.format(percent)} %`;
  $("progress-bar").style.width = `${percent}%`;

  $("net-info").hidden = input.taxRate === 0;
  $("net-info").textContent =
    `Nach ${numberFormat.format(input.taxRate * 100)} % Steuern (grobe Schätzung): gevestet ${fmt(status.vested * input.price * (1 - input.taxRate))}, ` +
    `insgesamt ${fmt(input.totalShares * input.price * (1 - input.taxRate))}.`;

  const rows = schedule.map((e) => {
    const isVested = e.date <= today;
    const isNext = status.next && e === status.next;
    const tr = document.createElement("tr");
    tr.className = isVested ? "vested" : isNext ? "next" : "";
    const cells = [
      dateFormat.format(e.date),
      numberFormat.format(e.shares),
      numberFormat.format(e.cumulative),
      fmt(e.shares * input.price),
    ];
    for (const text of cells) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.append(td);
    }
    const badge = document.createElement("span");
    badge.className = `badge ${isVested ? "ok" : "open"}`;
    badge.textContent = isVested ? "gevestet" : "offen";
    const td = document.createElement("td");
    td.append(badge);
    tr.append(td);
    return tr;
  });
  $("schedule").replaceChildren(...rows);

  renderChart(schedule, input.totalShares, today, input.grantDate);
}

loadSaved();
$("inputs").addEventListener("input", () => {
  save();
  render();
});
render();
