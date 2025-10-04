import { BaseRepository } from "../../src/repositories/BaseRepository";

describe("Base Repository", () => {
  test("should be able to create, read and delete items", () => {
    const baseRepo = new BaseRepository<any>();
    baseRepo.save({ id: "1", title: "Inception" });
    expect(baseRepo.findById("1")?.title).toStrictEqual("Inception");
    baseRepo.save({ id: "2", title: "Avengers" });
    expect(baseRepo.findAll().length).toStrictEqual(2);
    baseRepo.delete("1");
    expect(baseRepo.findById("1")).toStrictEqual(undefined);
  });

  test("should be able to update an item and response should return updated item", () => {
    const baseRepo = new BaseRepository<any>();
    baseRepo.save({ id: "1", title: "Inception" });
    expect(baseRepo.findById("1")?.title).toStrictEqual("Inception");
    const result = baseRepo.update("1", { title: "Barney" });
    expect(baseRepo.findById("1")?.title).toStrictEqual("Barney");
    expect(result).toStrictEqual({ id: "1", title: "Barney" });
  });

  test("should return undefined if updating an item that does not exist", () => {
    const baseRepo = new BaseRepository<any>();
    const result = baseRepo.update("999", { title: "Barney" });
    expect(result).toStrictEqual(undefined);
  });
});
