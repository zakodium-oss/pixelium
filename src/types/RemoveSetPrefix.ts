export type RemoveSetPrefix<S extends string> = S extends `SET_${infer Rest}`
  ? Rest
  : S;
