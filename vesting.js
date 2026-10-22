// Rechenlogik für den RSU-Vesting-Plan, ohne DOM.
// Läuft im Browser (window.Vesting) und in Node.js (module.exports) für die Tests.
(function (root) {
  // Monate zu einem Datum addieren; der Tag wird gekürzt, wenn der Monat kürzer ist (31.01. + 1 Monat = 28./29.02.)
  function addMonths(date, months) {
    const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    target.setDate(Math.min(date.getDate(), lastDay));
    return target;
  }

  // Monate nach der Zuteilung, an denen Aktien vesten: zuerst der Cliff, danach jedes Intervall bis zum Ende
  function vestingMonths(durationMonths, cliffMonths, intervalMonths) {
    const cliff = Math.min(cliffMonths, durationMonths);
    const months = new Set([durationMonths]);
    if (cliff > 0) months.add(cliff);
    for (let m = intervalMonths; m < durationMonths; m += intervalMonths) {
      if (m > cliff) months.add(m);
    }
    return [...months].sort((a, b) => a - b);
  }

  // Vesting-Plan: pro Termin Datum, Anzahl Aktien und kumulierte Summe.
  // Es werden nur ganze Aktien vergeben (abgerundet), der letzte Termin bekommt den Rest.
  function buildSchedule({ grantDate, totalShares, durationMonths, cliffMonths, intervalMonths }) {
    let previous = 0;
    return vestingMonths(durationMonths, cliffMonths, intervalMonths).map((month) => {
      const cumulative = Math.floor((totalShares * month) / durationMonths);
      const shares = cumulative - previous;
      previous = cumulative;
      return { month, date: addMonths(grantDate, month), shares, cumulative };
    });
  }

  // Stand zu einem Stichtag: was ist schon gevestet, was kommt als Nächstes
  function summarize(schedule, totalShares, today) {
    const past = schedule.filter((e) => e.date <= today);
    const vested = past.length ? past[past.length - 1].cumulative : 0;
    const next = schedule.find((e) => e.date > today) || null;
    return {
      vested,
      unvested: totalShares - vested,
      next,
      progress: totalShares > 0 ? vested / totalShares : 0,
    };
  }

  const api = { addMonths, vestingMonths, buildSchedule, summarize };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.Vesting = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
