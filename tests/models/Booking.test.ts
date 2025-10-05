import { Booking } from "../../src/models/Booking";

describe("Booking Model", () => {
  test("validation rules should reject empty cinemaId or empty seats", () => {
    expect(() => new Booking("", [{ rowIndex: 0, colIndex: 0 }])).toThrow();
    expect(() => new Booking("cinemaId", [])).toThrow();
    expect(
      () => new Booking("cinemaId", [{ rowIndex: 0, colIndex: 0 }])
    ).not.toThrow();
  });
});
