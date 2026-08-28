import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import type { ModelRendererProps } from "../ModelBrowser";
import { CenteredObject, usePreparedObject } from "./object-utils";

export default function OBJModel({ url, wireframe, onPickPoint, enablePick }: ModelRendererProps) {
  const source = useLoader(OBJLoader, url);
  const object = usePreparedObject(source, wireframe);
  return <CenteredObject object={object} onPickPoint={onPickPoint} enablePick={enablePick} />;
}
