export type ExtendsOmit<T, Names extends string> = T extends {
    [p in Names]: unknown;
}
    ? Omit<T, Names>
    : never;
