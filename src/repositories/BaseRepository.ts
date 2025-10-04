export class BaseRepository<T extends { id: string }> {
  protected items: Map<string, T> = new Map();

  findAll(): T[] {
    return Array.from(this.items.values());
  }

  countAll(filter?: { key: keyof T; value: T[keyof T] }): number {
    if (filter) {
      return this.findAll().filter((item) => item[filter.key] === filter.value)
        .length;
    }
    return this.items.size;
  }

  findById(id: string): T | undefined {
    return this.items.get(id);
  }

  save(entity: T): T {
    this.items.set(entity.id, entity);
    return entity;
  }

  update(id: string, updatedFields: Partial<T>): T | undefined {
    const existing = this.items.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updatedFields };
    this.items.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.items.delete(id);
  }
}
