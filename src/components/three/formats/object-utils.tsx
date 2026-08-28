import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Object3D, Vector3 } from "three";

export function usePreparedObject(source: Object3D, wireframe: boolean) {
  const prepared = useMemo(() => {
    const object = source.clone(true);
    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.geometry?.isBufferGeometry && !child.geometry.getAttribute("normal")) {
        child.geometry = child.geometry.clone();
        child.geometry.computeVertexNormals();
      }
      const materials = child.material
        ? Array.isArray(child.material)
          ? child.material
          : [child.material]
        : [new THREE.MeshStandardMaterial({ color: "#9ca3af", roughness: 0.65, metalness: 0.08 })];
      const clonedMaterials = materials.map((material) => {
        const next = material.clone();
        next.side = THREE.DoubleSide;
        next.wireframe = wireframe;
        return next;
      });
      child.material = Array.isArray(child.material) ? clonedMaterials : clonedMaterials[0];
    });
    return object;
  }, [source, wireframe]);

  useEffect(
    () => () => {
      prepared.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => material?.dispose());
      });
    },
    [prepared],
  );
  return prepared;
}

type Props = {
  object: Object3D;
  onPickPoint: (point: Vector3) => void;
  enablePick: boolean;
};

export function CenteredObject({ object, onPickPoint, enablePick }: Props) {
  const wrapperRef = useRef<Group>(null);
  useEffect(() => {
    if (!wrapperRef.current) return;
    const box = new THREE.Box3().setFromObject(object);
    if (box.isEmpty()) throw new Error("The model contains no renderable geometry.");
    const center = box.getCenter(new THREE.Vector3());
    wrapperRef.current.position.set(-center.x, -center.y, -center.z);
  }, [object]);

  return (
    <group
      ref={wrapperRef}
      onPointerDown={(event) => {
        if (!enablePick) return;
        event.stopPropagation();
        onPickPoint(event.point.clone());
      }}
    >
      <primitive object={object} />
    </group>
  );
}
