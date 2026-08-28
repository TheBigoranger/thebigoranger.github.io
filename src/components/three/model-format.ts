export const SUPPORTED_MODEL_FORMATS = ["stl", "obj", "ply", "fbx", "glb"] as const;
export type ModelFormat = (typeof SUPPORTED_MODEL_FORMATS)[number];

export function getModelFormat(nameOrUrl: string): ModelFormat | null {
  const clean = String(nameOrUrl ?? "").split("?")[0].split("#")[0];
  const extension = clean.includes(".")
    ? clean.slice(clean.lastIndexOf(".") + 1).toLowerCase()
    : "";
  if (extension === "gltf") return "glb";
  return (SUPPORTED_MODEL_FORMATS as readonly string[]).includes(extension)
    ? (extension as ModelFormat)
    : null;
}
