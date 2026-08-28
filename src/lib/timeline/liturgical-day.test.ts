import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  adventSunday,
  easterSunday,
  liturgicalDay,
} from "./liturgical-day.ts";

function at(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12);
}

describe("easterSunday", () => {
  it("matches known Gregorian dates", () => {
    assert.equal(easterSunday(2024).toDateString(), at(2024, 3, 31).toDateString());
    assert.equal(easterSunday(2025).toDateString(), at(2025, 4, 20).toDateString());
    assert.equal(easterSunday(2026).toDateString(), at(2026, 4, 5).toDateString());
    assert.equal(easterSunday(2027).toDateString(), at(2027, 3, 28).toDateString());
  });
});

describe("adventSunday", () => {
  it("is 29 November in 2026", () => {
    assert.equal(adventSunday(2026).toDateString(), at(2026, 11, 29).toDateString());
  });
});

describe("liturgicalDay", () => {
  it("shows St. Augustine on 28 August 2026", () => {
    const day = liturgicalDay(at(2026, 8, 28));
    assert.match(day.title, /Augustine/);
    assert.equal(day.color, "white");
    assert.equal(day.season, "Time after Pentecost");
    assert.equal(day.seasonWeek, "Week 13");
    assert.equal(day.compactDate, "Fri Aug 28");
    assert.equal(day.rosary, "Sorrowful Mysteries");
    assert.ok(day.notes.includes("Friday abstinence"));
  });

  it("names Easter Sunday 2026", () => {
    const day = liturgicalDay(at(2026, 4, 5));
    assert.equal(day.title, "Easter Sunday");
    assert.equal(day.color, "white");
    assert.equal(day.season, "Eastertide");
  });

  it("names Good Friday 2026", () => {
    const day = liturgicalDay(at(2026, 4, 3));
    assert.equal(day.title, "Good Friday");
    assert.equal(day.color, "black");
    assert.ok(day.notes.includes("Fast and abstinence"));
  });

  it("names Christmas 2026", () => {
    const day = liturgicalDay(at(2026, 12, 25));
    assert.match(day.title, /Nativity/);
    assert.equal(day.color, "white");
  });

  it("names the First Sunday of Advent 2026", () => {
    const day = liturgicalDay(at(2026, 11, 29));
    assert.match(day.title, /Advent/);
    assert.equal(day.season, "Advent");
    assert.equal(day.color, "violet");
  });

  it("names Christ the King on the last Sunday of October 2026", () => {
    const day = liturgicalDay(at(2026, 10, 25));
    assert.match(day.title, /King/);
    assert.equal(day.color, "white");
    assert.equal(day.rank, 1);
  });
});
