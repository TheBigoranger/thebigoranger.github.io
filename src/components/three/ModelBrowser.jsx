// src/components/three/ModelBrowser.jsx
import * as THREE from "three";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Bounds, Center, useBounds, Html } from "@react-three/drei";

// Loaders
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Optional decoders for GLB (safe even if unused)
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "meshoptimizer";

const MM_PER_UNIT = 1;

function getExt(nameOrUrl) {
  const clean = (nameOrUrl || "").split("?")[0].split("#")[0];
  return (clean.split(".").pop() || "").toLowerCase();
}

function tuneObject(obj, { wireframe = false } = {}) {
  obj.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child.geometry?.isBufferGeometry) {
        const n = child.geometry.getAttribute("normal");
        if (!n) child.geometry.computeVertexNormals();
      }

      if (child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          m.side = THREE.DoubleSide;
          m.wireframe = wireframe;
          m.needsUpdate = true;
        });
      } else {
        child.material = new THREE.MeshStandardMaterial({
          color: "#9ca3af",
          roughness: 0.65,
          metalness: 0.08,
          side: THREE.DoubleSide,
          wireframe,
        });
      }
    }
  });
}

function CenteredObject({ object, wireframe, onPickPoint, enablePick }) {
  const wrapperRef = useRef();

  useMemo(() => {
    tuneObject(object, { wireframe });
  }, [object, wireframe]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const box = new THREE.Box3().setFromObject(object);
    const c = box.getCenter(new THREE.Vector3());
    wrapperRef.current.position.set(-c.x, -c.y, -c.z);
  }, [object]);

  return (
    <group
      ref={wrapperRef}
      onPointerDown={(e) => {
        if (!enablePick) return;
        e.stopPropagation();
        onPickPoint?.(e.point.clone());
      }}
    >
      <primitive object={object} />
    </group>
  );
}

function STLModel({ url, wireframe, onPickPoint, enablePick }) {
  const geometry = useLoader(STLLoader, url);

  useMemo(() => {
    geometry.computeVertexNormals();
    geometry.center();
  }, [geometry]);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#9ca3af",
        roughness: 0.65,
        metalness: 0.08,
        side: THREE.DoubleSide,
        wireframe,
      }),
    [wireframe]
  );

  return (
    <mesh
      geometry={geometry}
      material={mat}
      castShadow
      receiveShadow
      onPointerDown={(e) => {
        if (!enablePick) return;
        e.stopPropagation();
        onPickPoint?.(e.point.clone());
      }}
    />
  );
}

function PLYModel({ url, wireframe, onPickPoint, enablePick }) {
  const geometry = useLoader(PLYLoader, url);

  useMemo(() => {
    geometry.computeVertexNormals();
    geometry.center();
  }, [geometry]);

  const hasColors = !!geometry.getAttribute("color");

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: hasColors,
        color: hasColors ? undefined : "#9ca3af",
        roughness: 0.65,
        metalness: 0.08,
        side: THREE.DoubleSide,
        wireframe,
      }),
    [hasColors, wireframe]
  );

  return (
    <mesh
      geometry={geometry}
      material={mat}
      castShadow
      receiveShadow
      onPointerDown={(e) => {
        if (!enablePick) return;
        e.stopPropagation();
        onPickPoint?.(e.point.clone());
      }}
    />
  );
}

function OBJModel({ url, mtlUrl, wireframe, onPickPoint, enablePick }) {
  const materials = mtlUrl ? useLoader(MTLLoader, mtlUrl) : null;

  const obj = useLoader(OBJLoader, url, (loader) => {
    if (materials) {
      materials.preload();
      loader.setMaterials(materials);
    }
  });

  const cloned = useMemo(() => obj.clone(true), [obj]);

  return (
    <CenteredObject
      object={cloned}
      wireframe={wireframe}
      onPickPoint={onPickPoint}
      enablePick={enablePick}
    />
  );
}

function FBXModel({ url, wireframe, onPickPoint, enablePick }) {
  const obj = useLoader(FBXLoader, url);
  const cloned = useMemo(() => obj.clone(true), [obj]);
  return (
    <CenteredObject
      object={cloned}
      wireframe={wireframe}
      onPickPoint={onPickPoint}
      enablePick={enablePick}
    />
  );
}

function GLBModel({ url, wireframe, onPickPoint, enablePick }) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);

    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    loader.setDRACOLoader(draco);
  });

  const cloned = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  return (
    <CenteredObject
      object={cloned}
      wireframe={wireframe}
      onPickPoint={onPickPoint}
      enablePick={enablePick}
    />
  );
}

function FitOnModelChange({ selectedKey }) {
  const bounds = useBounds();
  useEffect(() => {
    const t = setTimeout(() => bounds.refresh().fit(), 0);
    return () => clearTimeout(t);
  }, [bounds, selectedKey]);
  return null;
}

function LoadingFallback() {
  return (
    <Html center style={{ fontSize: 12, opacity: 0.7 }}>
      Loading…
    </Html>
  );
}

/**
 * NEW props:
 * - groups: [{ tag: string, items: models[] }]
 * - sidebarWidth: number (px)
 */
export default function ModelBrowser({ models = [], groups = null, sidebarWidth = 360, height = 720 }) {
  const [selected, setSelected] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);

  const [measure, setMeasure] = useState(false);
  const [a, setA] = useState(null);
  const [b, setB] = useState(null);

  const controlsRef = useRef(null);

  const selectedModel = useMemo(
    () => models.find((m) => m.name === selected) || null,
    [models, selected]
  );

  const ext = selectedModel ? getExt(selectedModel.name) : "";

  const distance = useMemo(() => {
    if (!a || !b) return null;
    return a.distanceTo(b);
  }, [a, b]);

  const distanceMm = useMemo(() => {
    if (distance == null) return null;
    return distance * MM_PER_UNIT;
  }, [distance]);

  const pickPoint = (p) => {
    if (!measure) return;
    if (!a || (a && b)) {
      setA(p);
      setB(null);
    } else {
      setB(p);
    }
  };

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !measure;
    }
  }, [measure]);

  const layoutStyle = useMemo(() => ({ "--sidebarW": `${sidebarWidth}px` }), [sidebarWidth]);

  const renderModelButton = (m) => {
    const active = m.name === selected;
    return (
      <button
        key={m.name}
        onClick={() => setSelected(m.name)}
        className={`text-left rounded-lg px-3 py-2 text-sm transition ${
          active ? "bg-base-300 font-semibold" : "hover:bg-base-300"
        }`}
      >
        {m.name}
      </button>
    );
  };

  return (
    <div
      className="w-full grid gap-8 grid-cols-1 lg:grid-cols-[var(--sidebarW)_minmax(0,1fr)]"
      style={layoutStyle}
    >
      {/* Left */}
      <aside className="rounded-2xl bg-base-200 p-5 h-fit lg:sticky lg:top-6">
        <div className="font-black mb-4">3D Models</div>

        {/* EXPANDABLE GROUPS */}
        {Array.isArray(groups) && groups.length > 0 ? (
          <div className="grid gap-3">
            {groups.map((g) => (
              <details key={g.tag} open className="rounded-xl bg-base-100/40 px-3 py-2">
                <summary className="cursor-pointer select-none font-semibold">
                  {g.tag}
                </summary>
                <div className="mt-2 grid gap-2">
                  {(g.items || []).map(renderModelButton)}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="grid gap-2">{models.map(renderModelButton)}</div>
        )}

        <div className="mt-6 text-xs opacity-60">Click a filename to preview.</div>
      </aside>

      {/* Right */}
      <div className="w-full min-w-0">
        {!selectedModel ? (
          <div className="rounded-2xl bg-base-200 flex items-center justify-center" style={{ height }}>
            <div className="text-sm opacity-60">Select a model on the left to view it.</div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute right-3 top-3 z-10 flex flex-wrap gap-2">
              <button
                className="btn btn-sm"
                onClick={() => {
                  const name = selectedModel.name;
                  setSelected(null);
                  setTimeout(() => setSelected(name), 0);
                }}
                title="Fit to view"
              >
                Fit
              </button>

              <button className="btn btn-sm" onClick={() => setAutoRotate((v) => !v)} title="Auto rotate">
                {autoRotate ? "Stop" : "Auto"}
              </button>

              <button className="btn btn-sm" onClick={() => setWireframe((v) => !v)} title="Wireframe">
                Wire
              </button>

              <button
                className="btn btn-sm"
                onClick={() => {
                  setMeasure((v) => !v);
                  setA(null);
                  setB(null);
                }}
                title="Measure: click two points"
              >
                {measure ? "Measuring" : "Measure"}
              </button>

              <button
                className="btn btn-sm"
                onClick={() => {
                  setMeasure(false);
                  setA(null);
                  setB(null);
                }}
                title="Clear measurement"
              >
                Clear
              </button>

              <button
                className="btn btn-sm"
                onClick={() => {
                  setAutoRotate(false);
                  setWireframe(false);
                  setMeasure(false);
                  setA(null);
                  setB(null);
                  const name = selectedModel.name;
                  setSelected(null);
                  setTimeout(() => setSelected(name), 0);
                }}
                title="Reset view"
              >
                Reset
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-base-200" style={{ height }}>
              <Canvas
                camera={{ position: [2.2, 1.6, 2.2], fov: 45, near: 0.01, far: 5000 }}
                shadows
                dpr={[1, 2]}
                style={{ cursor: measure ? "crosshair" : "default" }}
              >
                <ambientLight intensity={0.75} />
                <directionalLight position={[6, 8, 5]} intensity={1.1} castShadow />
                <directionalLight position={[-6, 4, -5]} intensity={0.5} />

                <Suspense fallback={<LoadingFallback />}>
                  <Bounds fit clip observe margin={1.25}>
                    <FitOnModelChange selectedKey={selectedModel.name} />

                    <Center>
                      {ext === "stl" && (
                        <STLModel url={selectedModel.url} wireframe={wireframe} onPickPoint={pickPoint} enablePick={measure} />
                      )}
                      {ext === "ply" && (
                        <PLYModel url={selectedModel.url} wireframe={wireframe} onPickPoint={pickPoint} enablePick={measure} />
                      )}
                      {ext === "obj" && (
                        <OBJModel url={selectedModel.url} wireframe={wireframe} onPickPoint={pickPoint} enablePick={measure} />
                      )}
                      {ext === "fbx" && (
                        <FBXModel url={selectedModel.url} wireframe={wireframe} onPickPoint={pickPoint} enablePick={measure} />
                      )}
                      {(ext === "glb" || ext === "gltf") && (
                        <GLBModel url={selectedModel.url} wireframe={wireframe} onPickPoint={pickPoint} enablePick={measure} />
                      )}
                    </Center>
                  </Bounds>
                </Suspense>

                <OrbitControls
                  ref={controlsRef}
                  makeDefault
                  enableDamping
                  dampingFactor={0.12}
                  autoRotate={autoRotate}
                  autoRotateSpeed={0.8}
                  target={[0, 0, 0]}
                />
              </Canvas>
            </div>

            {a && (
              <div className="mt-3 text-sm opacity-80">
                {b ? (
                  <span>
                    Distance: <span className="font-semibold">{distanceMm?.toFixed(2)} mm</span>
                  </span>
                ) : (
                  <span>Picked point A. Pick point B…</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

