import * as System from "./interfaces";

export class List<T> implements System.IList<T> {
  private capacity: number;
  private count: number;
  public get Capacity(): number {
    return this.capacity;
  }
  public get Count(): number {
    return this.count;
  }

  [key: number]: T;

  constructor();
  constructor(items: Array<T>);
  constructor(items: number);
  constructor(items?: unknown) {
    if (typeof items === "number") {
      Object.assign(this, new Array<T>(items));
      this.count = items;
      this.capacity = items;
      return;
    }
    if (items instanceof Array) {
      Object.assign(this, items);
      this.count = items.length;
      this.capacity = items.length;
      return;
    }
    Object.assign(this, new Array<T>());
    this.count = 0;
    this.capacity = 0;
  }

  [Symbol.iterator](): Iterator<T, any, undefined> {
    let index = 0;
    const data = this;
    const length = this.count;
    return {
      next(): IteratorResult<T> {
        if (index < length) {
          return {
            done: false,
            value: data[index++],
          };
        } else {
          return {
            done: true,
            value: null,
          };
        }
      },
    };
  }

  Add(item: T): void {
    this.EnsureCapacity(this.Count + 1);
    this.count++;
    this[this.Count - 1] = item;
  }
  AddRange(items: Array<T>): void {
    items.forEach((item) => this.Add(item));
  }
  AsReadOnly(): ReadonlyArray<T> {
    return new Array<T>(...this);
  }
  BinarySearch(item: T): number {
    throw new Error("Method not implemented.");
  }
  Clear(): void {
    Object.assign(this, new Array<T>());
    this.count = 0;
    this.capacity = 0;
  }
  Contains(item: T): boolean {
    let i = 0;
    while (i < this.Count && this[i] != item) i += 1;
    return i < this.Count;
  }
  ConvertAll<TOutput extends T>(
    converter: System.Converter<T, TOutput>
  ): System.IList<TOutput> {
    return new List<TOutput>([...this].map(converter));
  }
  CopyTo(dest: T[], startingIndex: number): void;
  CopyTo(index: number, dest: T[], arrayIndex: number, count: number): void;
  CopyTo(dest: T[]): void;
  CopyTo(
    index: unknown,
    dest?: unknown,
    arrayIndex?: unknown,
    count?: unknown
  ): void {
    if (typeof index === "number") {
      if (dest instanceof Array) {
        if (typeof arrayIndex === "number" && typeof count === "number") {
          [...this].slice(index, index + count).forEach((item, i) => {
            dest[i + arrayIndex] = item;
          });
          return;
        }
        [...this].slice(index).forEach((item, i) => {
          dest[i] = item;
        });
        return;
      }
      throw new Error("Invalid destination");
    }
    if (index instanceof Array && typeof dest === "number") {
      [...this].forEach((item, i) => {
        index[i + dest] = item;
      });
      return;
    }
    if (index instanceof Array) {
      [...this].forEach((item, i) => {
        index[i] = item;
      });
      return;
    }
    throw new Error("Invalid destination");
  }
  EnsureCapacity(capacity: number): number {
    if (this.capacity < capacity) {
      for (let i = this.capacity; this.capacity < capacity; i *= 2) {
        this.capacity = i;
      }
    }
    return this.Capacity;
  }
  Exists(match: System.Predicate<T>): boolean {
    return [...this].some(match);
  }
  Find(match: System.Predicate<T>): T | undefined {
    return [...this].find(match);
  }
  FindAll(match: System.Predicate<T>): System.IList<T> {
    return new List([...this].filter(match));
  }
  FindIndex(match: System.Predicate<T>): number;
  FindIndex(startIndex: number, match: System.Predicate<T>): number;
  FindIndex(
    startIndex: number,
    count: number,
    match: System.Predicate<T>
  ): number;
  FindIndex(startIndex: unknown, count?: unknown, match?: unknown): number {
    if (typeof startIndex === "number") {
      if (typeof count === "number") {
        if (typeof match === "function") {
          return [...this].findIndex(match as System.Predicate<T>, startIndex);
        }
        throw new Error("Invalid match");
      }
      if (typeof count === "function") {
        return [...this].findIndex(count as System.Predicate<T>, startIndex);
      }
    }
    if (typeof startIndex === "function") {
      return [...this].findIndex(startIndex as System.Predicate<T>);
    }
    throw new Error("Invalid match");
  }
  FindLast(match: System.Predicate<T>): T | undefined {
    return [...this].reverse().find(match);
  }
  FindLastIndex(match: System.Predicate<T>): number;
  FindLastIndex(startIndex: number, match: System.Predicate<T>): number;
  FindLastIndex(
    startIndex: number,
    count: number,
    match: System.Predicate<T>
  ): number;
  FindLastIndex(startIndex: unknown, count?: unknown, match?: unknown): number {
    let index = 0;
    if (typeof startIndex === "number") {
      if (typeof count === "number") {
        if (typeof match === "function") {
          index = [...this]
            .slice(0, startIndex)
            .reverse()
            .findIndex(match as System.Predicate<T>);
        }
        throw new Error("Invalid match");
      }
      if (typeof count === "function") {
        index = [...this]
          .slice(0, startIndex)
          .reverse()
          .findIndex(count as System.Predicate<T>);
      }
    }
    if (typeof startIndex === "function") {
      index = [...this]
        .slice(0, this.Count)
        .reverse()
        .findIndex(startIndex as System.Predicate<T>);
    }
    return index === -1 ? index : this.Count - 1 - index;
  }
  ForEach(action: System.Action<T>): void {
    [...this].forEach(action);
  }
  GetRange(index: number, count: number): System.IList<T> {
    return new List([...this].slice(index, index + count));
  }
  IndexOf(item: T): number;
  IndexOf(item: T, index: number): number;
  IndexOf(item: T, index: number, count: number): number;
  IndexOf(item: T, index?: number, count?: number): number {
    if (index !== undefined) {
      if (count !== undefined) {
        return [...this].slice(index, index + count).indexOf(item);
      }
      return [...this].slice(index).indexOf(item);
    }
    return [...this].indexOf(item);
  }
  Insert(index: number, item: T): void {
    const aus = [...this];
    aus.splice(index, 0, item);
    this.count += 1;
    this.EnsureCapacity(this.Count);
    Object.assign(this, aus);
  }
  InsertRange(index: number, collection: Array<T>): void {
    const aus = [...this];
    aus.splice(index, 0, ...collection);
    this.count += collection.length;
    this.EnsureCapacity(this.Count);
    Object.assign(this, aus);
  }
  LastIndexOf(item: T): number;
  LastIndexOf(item: T, index: number): number;
  LastIndexOf(item: T, index: number, count: number): number;
  LastIndexOf(item: T, index?: number, count?: number): number {
    let found = 0;
    if (index !== undefined) {
      if (count !== undefined) {
        found = [...this]
          .slice(0, index + count)
          .reverse()
          .indexOf(item);
      }
      found = [...this].slice(0, index).reverse().indexOf(item);
    }
    found = [...this].reverse().indexOf(item);
    return found === -1 ? found : this.Count - 1 - found;
  }
  Remove(item: T): boolean {
    const index = [...this].indexOf(item);
    if (index !== -1) {
      const aus = [...this];
      aus.splice(index, 1);
      this.count--;
      Object.assign(this, aus);
      return true;
    }
    return false;
  }
  RemoveAll(predicate: System.Predicate<T>): number {
    const items = [...this].filter(predicate);
    Object.assign(
      this,
      [...this].filter((item) => !items.includes(item))
    );
    this.count -= items.length;
    return items.length;
  }
  RemoveAt(index: number): void {
    const aus = [...this];
    aus.splice(index, 1);
    this.count--;
    Object.assign(this, aus);
  }
  RemoveRange(index: number, count: number): void {
    const aus = [...this];
    aus.splice(index, count);
    this.count -= count;
    Object.assign(this, aus);
  }
  Reverse(): void;
  Reverse(start: number, count: number): void;
  Reverse(start?: number, count?: number): void {
    const aus = [...this];
    if (start !== undefined) {
      if (count !== undefined) {
        const items = [...this].slice(start, start + count);
        items.reverse();
        aus.splice(start, count, ...items);
        Object.assign(this, aus);
        return;
      }
      throw new Error("Invalid count");
    }
    aus.reverse();
    Object.assign(this, aus);
  }
  Sort(): void;
  Sort(comparison: System.Comparison<T>): void;
  Sort(comparison?: System.Comparison<T>): void {
    const aus = [...this];
    if (comparison !== undefined) {
      aus.sort(comparison);
    } else aus.sort();
    Object.assign(this, aus);
  }
  ToArray(): T[] {
    return [...this];
  }
  TrimExcess(): void {
    throw new Error("Method not implemented.");
  }
  TrueForAll(match: System.Predicate<T>): boolean {
    return [...this].every(match);
  }
  ToString(): string {
    return [...this].toString();
  }
  ElementAt(index: number): T {
    if (index < -this.Count || index > this.Count - 1) {
      throw new RangeError(
        `Index out of range, max was ${this.Count - 1}, min was ${-this
          .Count}, but ${index} was given`
      );
    }
    if (index < 0) {
      return this[this.Count + index];
    }
    return this[index];
  }
  First(match?: System.Predicate<T> | undefined): T | null {
    let item: T | undefined;
    if (match !== undefined) item = [...this].find(match);
    else item = this[0];
    if (item !== undefined) return item;
    return null;
  }
  FirstOrDefault(
    defaultType: "string" | "object" | "array" | "number" | "boolean",
    match?: System.Predicate<T> | undefined
  ): T {
    let item: T | undefined;
    if (match !== undefined) item = [...this].find(match);
    else item = this[0];
    if (item !== undefined) return item;
    switch (defaultType) {
      case "string":
        return "" as any;
      case "object":
        return {} as any;
      case "array":
        return [] as any;
      case "number":
        return 0 as any;
      case "boolean":
        return false as any;
      default:
        return "" as any;
    }
  }
  Last(match?: System.Predicate<T> | undefined): T | null {
    let item: T | undefined = undefined;
    if (match !== undefined) item = [...this].reverse().find(match);
    else if (this.Count > 0) item = this[this.Count - 1];
    if (item !== undefined) return item;
    return null;
  }
  LastOrDefault(
    defaultType: "string" | "object" | "array" | "number" | "boolean",
    match?: System.Predicate<T> | undefined
  ): T {
    let item: T | undefined = undefined;
    if (match !== undefined) item = [...this].reverse().find(match);
    else if (this.Count > 0) item = this[this.Count - 1];
    if (item !== undefined) return item;
    switch (defaultType) {
      case "string":
        return "" as any;
      case "object":
        return {} as any;
      case "array":
        return [] as any;
      case "number":
        return 0 as any;
      case "boolean":
        return false as any;
      default:
        return "" as any;
    }
  }
}
