import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import type { ModelRendererProps } from "../ModelBrowser";

export default function PLYModel({ url, wireframe, onPickPoint, enablePick }: ModelRendererProps) {
  const source = useLoader(PLYLoader, url);
  const geometry = useMemo(() => {
    const next = source.clone();
    next.computeVertexNormals();
    next.center();
    return next;
  }, [source]);
  const hasColors = Boolean(geometry.getAttribute("color"));
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: hasColors,
        color: hasColors ? undefined : "#9ca3af",
        roughness: 0.65,
        metalness: 0.08,
        side: THREE.DoubleSide,
        wireframe,
      }),
    [hasColors, wireframe],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  if (!geometry.getAttribute("position")?.count) throw new Error("The PLY file contains no vertices.");

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
