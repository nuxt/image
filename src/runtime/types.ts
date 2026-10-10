export type DataAttributes = Record<`data-${string}`, string>

// augmented with a required `alt` when the `requireAlt` module option is enabled
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ImageAltProps {}
