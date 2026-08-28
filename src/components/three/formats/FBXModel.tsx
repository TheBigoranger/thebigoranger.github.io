import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import type { ModelRendererProps } from "../ModelBrowser";
import { CenteredObject, usePreparedObject } from "./object-utils";

export default function FBXModel({ url, wireframe, onPickPoint, enablePick }: ModelRendererProps) {
  const source = useLoader(FBXLoader, url);
  const object = usePreparedObject(source, wireframe);
  return <CenteredObject object={object} onPickPoint={onPickPoint} enablePick={enablePick} />;
}
