import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { ModelRendererProps } from "../ModelBrowser";

export default function STLModel({ url, wireframe, onPickPoint, enablePick }: ModelRendererProps) {
  const source = useLoader(STLLoader, url);
  const geometry = useMemo(() => {
    const next = source.clone();
    next.computeVertexNormals();
    next.center();
    return next;
  }, [source]);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#9ca3af",
        roughness: 0.65,
        metalness: 0.08,
        side: THREE.DoubleSide,
        wireframe,
      }),
    [wireframe],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  if (!geometry.getAttribute("position")?.count) throw new Error("The STL file contains no vertices.");

  return (
    <mesh
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
      onPointerDown={(event) => {
        if (!enablePick) return;
        event.stopPropagation();
        onPickPoint(event.point.clone());
      }}
    />
  );
}
