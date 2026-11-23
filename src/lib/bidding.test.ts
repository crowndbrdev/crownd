import { describe, expect, it } from "vitest";
import { ListingError, normalizeUrl, priceForRank, quote, rankFor, sortBoard, type BoardEntry } from "./bidding";

const board: BoardEntry[] = [
  { id: "a", key: "alpha.com", bidTotal: 1000, reachedAt: 2 },
  { id: "b", key: "beta.com", bidTotal: 500, reachedAt: 1 },
  { id: "c", key: "gamma.com", bidTotal: 1000, reachedAt: 1 },
];

describe("normalizeUrl", () => {
  it("strips tracking params, www and trailing slash; keys product sites by host", () => {
    const n = normalizeUrl("https://www.Example.com/pricing/?utm_source=x&ref=y#top");
    expect(n.url).toBe("https://example.com/pricing");
    expect(n.key).toBe("example.com");
  });

  it("accepts bare domains and @handles", () => {
    expect(normalizeUrl("example.io").url).toBe("https://example.io");
    expect(normalizeUrl("@Maker_42").url).toBe("https://x.com/maker_42");
    expect(normalizeUrl("@maker").key).toBe("x.com/maker");
  });

  it("keys stores and GitHub by path so two apps never share a bid", () => {
    const a = normalizeUrl("https://play.google.com/store/apps/details?id=com.a.app&hl=pt");
    const b = normalizeUrl("https://play.google.com/store/apps/details?id=com.b.app");
    expect(a.key).not.toBe(b.key);
    expect(a.url).toBe("https://play.google.com/store/apps/details?id=com.a.app");
    expect(normalizeUrl("https://github.com/Org/Repo/tree/main").key).toBe("github.com/org/repo");
  });

  it("rejects chat/invite links, shorteners and adult hosts", () => {
    for (const bad of ["https://wa.me/5511999", "t.me/group", "https://discord.gg/abc", "https://bit.ly/x", "pornhub.com"]) {
      expect(() => normalizeUrl(bad)).toThrow(ListingError);
    }
  });

  it("rejects garbage", () => {
    expect(() => normalizeUrl("")).toThrow(ListingError);
    expect(() => normalizeUrl("not a url")).toThrow(ListingError);
  });
});

describe("ordering", () => {
  it("sorts by total desc and breaks ties by who got there first", () => {
    expect(sortBoard(board).map((e) => e.id)).toEqual(["c", "a", "b"]);
  });

  it("newcomers must beat the holder by one step to take a rank", () => {
    expect(priceForRank(board, 1, 100, 100)).toBe(1100);
    expect(priceForRank(board, 3, 100, 100)).toBe(600);
    expect(priceForRank(board, 9, 100, 100)).toBe(100);
  });

  it("computes the rank a total would reach (ties go to incumbents)", () => {
    expect(rankFor(board, 1000)).toBe(3);
    expect(rankFor(board, 1001)).toBe(1);
    expect(rankFor(board, 1100, "beta.com")).toBe(1);
  });
});

describe("quote", () => {
  it("charges only the difference when raising an existing listing", () => {
    const q = quote(board, "beta.com", 1100, 100, 100);
    expect(q).toEqual({ kind: "raise", listingId: "b", previous: 500, total: 1100, charge: 600 });
  });

  it("requires raises of at least one step", () => {
    expect(() => quote(board, "beta.com", 550, 100, 100)).toThrow(ListingError);
  });

  it("charges the full total for new listings and enforces the minimum", () => {
    expect(quote(board, "new.com", 300, 100, 100)).toEqual({ kind: "new", total: 300, charge: 300 });
    expect(() => quote(board, "new.com", 50, 100, 100)).toThrow(ListingError);
  });
});
