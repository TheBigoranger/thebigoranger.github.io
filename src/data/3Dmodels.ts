// src/data/3Dmodels.ts

export type ModelLink = {
  label: string
  url: string
}

/**
 * Extendable metadata type:
 * - built-in fields below
 * - you can add arbitrary extra fields per model (future-proof)
 */
export type ModelMeta = {
  /** Base name only — no extension */
  name: string
  title?: string
  description: string
  modelLinks?: ModelLink[]

  /** Used for grouping in the left sidebar. If missing -> "Others" */
  tag?: string
} & Record<string, unknown>

export const modelsMeta: ModelMeta[] = [
  {
    name: "snowboard_vise",
    title: "Snowboard Vise",
    tag: "Sports",
    description:
      "A compact vise designed for snowboard tuning and waxing. Clamps securely to standard workbenches.",
    modelLinks: [
      { label: "Printables", url: "https://www.printables.com/model/1149018-snowboard-vise" },
    ],
  },
  {
    name: "TM_FrontPlate",
    title: "Front plate for the board game Terraforming Mars",
    tag: "Board Game",
    description:
      "A compact vise designed for snowboard tuning and waxing. Clamps securely to standard workbenches.",
    modelLinks: [
      { label: "Printables", url: "https://www.printables.com/model/1521160-terraforming-mars-player-mat-organizer-for-smaller/files" },
    ],
  },
]

/** Lookup by base filename */
export const modelsMetaByBaseName: Record<string, ModelMeta> =
  Object.fromEntries(modelsMeta.map((m) => [m.name, m]))

