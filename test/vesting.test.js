const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
const { addMonths, buildSchedule, summarize, vestingMonths } = require("../vesting.js");

const base = {
  grantDate: new Date(2025, 0, 15),
  totalShares: 1200,
  durationMonths: 48,
  cliffMonths: 12,
  intervalMonths: 3,
};

describe("addMonths", () => {
  it("kürzt den Tag am Monatsende", () => {
    assert.equal(addMonths(new Date(2025, 0, 31), 1).getDate(), 28);
    assert.equal(addMonths(new Date(2024, 0, 31), 1).getDate(), 29);
  });
  it("geht über Jahresgrenzen", () => {
    const d = addMonths(new Date(2025, 10, 15), 3);
    assert.deepEqual([d.getFullYear(), d.getMonth(), d.getDate()], [2026, 1, 15]);
  });
});

describe("vestingMonths", () => {
  it("4 Jahre, 12 Monate Cliff, quartalsweise", () => {
    const months = vestingMonths(48, 12, 3);
    assert.equal(months[0], 12);
    assert.equal(months.length, 13);
    assert.equal(months.at(-1), 48);
  });
  it("Cliff länger als die Laufzeit vestet alles am Ende", () => {
    assert.deepEqual(vestingMonths(12, 24, 3), [12]);
  });
});

describe("buildSchedule", () => {
  it("25 % am Cliff, danach gleichmäßig, Summe stimmt", () => {
    const schedule = buildSchedule(base);
    assert.equal(schedule[0].shares, 300);
    assert.equal(schedule[1].shares, 75);
    assert.equal(schedule.at(-1).cumulative, 1200);
    assert.equal(schedule.reduce((sum, e) => sum + e.shares, 0), 1200);
  });
  it("nicht teilbare Anzahl: nur ganze Aktien, Summe bleibt exakt", () => {
    const schedule = buildSchedule({ ...base, totalShares: 1001, cliffMonths: 0, intervalMonths: 1 });
    assert.ok(schedule.every((e) => Number.isInteger(e.shares) && e.shares >= 0));
    assert.equal(schedule.reduce((sum, e) => sum + e.shares, 0), 1001);
  });
});

describe("summarize", () => {
  const schedule = buildSchedule(base);
  it("vor dem Cliff ist nichts gevestet", () => {
    const s = summarize(schedule, 1200, new Date(2025, 11, 1));
    assert.equal(s.vested, 0);
    assert.equal(s.next.shares, 300);
  });
  it("am Vesting-Tag zählt der Termin schon", () => {
    const s = summarize(schedule, 1200, new Date(2026, 0, 15, 12));
    assert.equal(s.vested, 300);
  });
  it("nach dem Ende ist alles gevestet", () => {
    const s = summarize(schedule, 1200, new Date(2030, 0, 1));
    assert.equal(s.vested, 1200);
    assert.equal(s.next, null);
  });
});
