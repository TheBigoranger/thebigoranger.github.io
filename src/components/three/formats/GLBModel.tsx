import { useLoader } from "@react-three/fiber";
import { MeshoptDecoder } from "meshoptimizer";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { ModelRendererProps } from "../ModelBrowser";
import { CenteredObject, usePreparedObject } from "./object-utils";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);

export default function GLBModel({ url, wireframe, onPickPoint, enablePick }: ModelRendererProps) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.setDRACOLoader(dracoLoader);
  });
  const object = usePreparedObject(gltf.scene, wireframe);
  return <CenteredObject object={object} onPickPoint={onPickPoint} enablePick={enablePick} />;
}
