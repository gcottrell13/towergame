/**
 * technically a number or string, but you should not inspect it at all, nor use it with any other types
 * @asType string
 */
export type ResourceKind = string & { readonly __type: unique symbol };

export interface ResourceDefinition {
    kind: ResourceKind;
}
