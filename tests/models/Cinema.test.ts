import { Cinema } from "../../src/models/Cinema";

describe("Cinema Model", () => {
  test("validation rules should reject empty title and invalid rows (< 1 or >26) and seats-per-row (< 1 or >50)", () => {
    expect(() => new Cinema("", 8, 10)).toThrow();
    expect(() => new Cinema("Movie", 5, 0)).toThrow();
    expect(() => new Cinema("Movie", 5, 51)).toThrow();
    expect(() => new Cinema("Movie", 0, 50)).toThrow();
    expect(() => new Cinema("Movie", 27, 50)).toThrow();
    expect(() => new Cinema("Movie", 26, 50)).not.toThrow();
  });
});
