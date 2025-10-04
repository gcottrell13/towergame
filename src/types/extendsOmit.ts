export type ExtendsOmit<T, Names extends string> = T extends {
    [p in Names]: any;
}
    ? Omit<T, Names>
    : never;
