import { describe, expect, it } from "vitest";
import { loadClub } from "@/lib/test-fixtures";
import { findUpcomingEvent, isAwayGame, upcomingEvents } from "./events";

const portVallon = loadClub("port-vallon");
const now = new Date(portVallon.snapshotAt);

describe("upcomingEvents", () => {
  it("drops events that already started and sorts the rest", () => {
    const ids = upcomingEvents(portVallon.events, now).map((e) => e.id);
    expect(ids).not.toContain("901"); // kicked off one hour before the snapshot
    expect(ids.slice(0, 3)).toEqual(["902", "950", "903"]);
    expect(ids).toHaveLength(portVallon.events.length - 1);
  });

  it("keeps an unknown-date event whose placeholder just passed", () => {
    const [event] = loadClub("brehaut").events;
    const justAfter = new Date(Date.parse(event.startDatetime) + 2 * 24 * 3600 * 1000);
    expect(upcomingEvents([event], justAfter)).toHaveLength(1);
  });
});

describe("findUpcomingEvent", () => {
  it("returns null for missing, unknown or past ids", () => {
    expect(findUpcomingEvent(portVallon.events, null, now)).toBeNull();
    expect(findUpcomingEvent(portVallon.events, "nope", now)).toBeNull();
    expect(findUpcomingEvent(portVallon.events, "901", now)).toBeNull();
    expect(findUpcomingEvent(portVallon.events, "908", now)?.id).toBe("908");
  });
});

describe("isAwayGame", () => {
  it("detects matches the club plays away", () => {
    const tejo = portVallon.events.find((e) => e.id === "903")!;
    const home = portVallon.events.find((e) => e.id === "902")!;
    expect(isAwayGame(tejo, portVallon.tenant)).toBe(true);
    expect(isAwayGame(home, portVallon.tenant)).toBe(false);
  });
});
