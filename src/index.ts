export interface IParameters {
  [key: string]: any;
}

export default class Params<T extends IParameters> {
  args: [keyof T, number, any][];

  constructor(objParams: T) {
    this.args = Object.keys(objParams).map((p, i): [keyof T, number, any] => [
      p,
      i + 1,
      objParams[p],
    ]);
  }

  columns() {
    return this.args.map((p) => `"${p[0]}"`).join(", ");
  }

  id(name: keyof T) {
    const result = this.args.find((x) => x[0] === name);
    if (result) {
      return `$${result[1]}`;
    } else {
      throw new Error(`Could not find parameter by name ${name}.`);
    }
  }

  ids() {
    return this.args.map((p) => `$${p[1]}`).join(", ");
  }

  pair(col: keyof T) {
    return `"${col}"=${this.id(col)}`;
  }

  pairs(cols: (keyof T)[]) {
    return cols.map((c) => `"${c}"=${this.id(c)}`).join(", ");
  }

  values() {
    return this.args.reduce((acc, x) => acc.concat([x[2]]), [] as any[]);
  }
}
