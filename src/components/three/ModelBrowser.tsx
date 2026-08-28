import { Bounds, Html, OrbitControls, useBounds } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Vector3 } from "three";
import { getModelFormat, type ModelFormat } from "./model-format";

const FORMAT_COMPONENTS: Record<ModelFormat, React.LazyExoticComponent<React.ComponentType<ModelRendererProps>>> = {
  stl: lazy(() => import("./formats/STLModel")),
  obj: lazy(() => import("./formats/OBJModel")),
  ply: lazy(() => import("./formats/PLYModel")),
  fbx: lazy(() => import("./formats/FBXModel")),
  glb: lazy(() => import("./formats/GLBModel")),
};

const MM_PER_UNIT = 1;

export type BrowserModel = {
  name: string;
  url: string;
  downloadUrl?: string;
  sldprtDownloadUrl?: string | null;
  title?: string;
  description?: string;
  modelLinks?: { label: string; url: string }[];
  tag?: string;
};

type BrowserGroup = { tag: string; items: BrowserModel[] };
export type ModelRendererProps = {
  url: string;
  wireframe: boolean;
  onPickPoint: (point: Vector3) => void;
  enablePick: boolean;
};

function FitOnModelChange({ selectedKey }: { selectedKey: string }) {
  const bounds = useBounds();
  useEffect(() => {
    const frame = requestAnimationFrame(() => bounds.refresh().fit());
    return () => cancelAnimationFrame(frame);
  }, [bounds, selectedKey]);
  return null;
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="rounded-lg bg-base-100/90 px-3 py-2 text-xs shadow">
        Loading model…
      </div>
    </Html>
  );
}

type ErrorBoundaryProps = {
  resetKey: string;
  onRetry: () => void;
  children: ReactNode;
};

class ModelErrorBoundary extends Component<ErrorBoundaryProps, { error: Error | null }> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full items-center justify-center p-8 text-center" role="alert">
          <div className="max-w-md">
            <p className="font-bold">This model could not be loaded.</p>
            <p className="mt-2 text-sm opacity-70">
              The file may be incomplete or use an unsupported variant. Select
              another model or retry this one.
            </p>
            <button
              className="btn btn-sm mt-4"
              type="button"
              onClick={() => {
                this.setState({ error: null });
                this.props.onRetry();
              }}
            >
              Retry model
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

type Props = {
  models?: BrowserModel[];
  groups?: BrowserGroup[] | null;
  sidebarWidth?: number;
  height?: number;
};

export default function ModelBrowser({
  models = [],
  groups = null,
  sidebarWidth = 360,
  height = 720,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [fitNonce, setFitNonce] = useState(0);
  const [retryNonce, setRetryNonce] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [measure, setMeasure] = useState(false);
  const [a, setA] = useState<Vector3 | null>(null);
  const [b, setB] = useState<Vector3 | null>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const selectedModel = useMemo(
    () => models.find((model) => model.name === selected) ?? null,
    [models, selected],
  );
  const format = selectedModel ? getModelFormat(selectedModel.name) : null;
  const FormatModel = format ? FORMAT_COMPONENTS[format] : null;
  const distanceMm = a && b ? a.distanceTo(b) * MM_PER_UNIT : null;

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.enabled = !measure;
  }, [measure]);

  const resetMeasurement = () => {
    setMeasure(false);
    setA(null);
    setB(null);
  };

  const selectModel = (name: string) => {
    setSelected(name);
    setRetryNonce(0);
    setA(null);
    setB(null);
  };

  const pickPoint = (point: Vector3) => {
    if (!measure) return;
    if (!a || b) {
      setA(point);
      setB(null);
    } else {
      setB(point);
    }
  };

  const renderModelButton = (model: BrowserModel) => {
    const active = model.name === selected;
    return (
      <button
        key={model.name}
        type="button"
        aria-pressed={active}
        onClick={() => selectModel(model.name)}
        className={`rounded-lg px-3 py-2 text-left text-sm transition ${
          active ? "bg-base-300 font-semibold" : "hover:bg-base-300"
        }`}
      >
        {model.name}
      </button>
    );
  };

  return (
    <div
      className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[var(--sidebarW)_minmax(0,1fr)]"
      style={{ "--sidebarW": `${sidebarWidth}px` } as CSSProperties}
    >
      <aside className="h-fit rounded-2xl bg-base-200 p-5 lg:sticky lg:top-6">
        <div className="mb-4 font-black">3D Models</div>
        {Array.isArray(groups) && groups.length > 0 ? (
          <div className="grid gap-3">
            {groups.map((group) => (
              <details key={group.tag} open className="rounded-xl bg-base-100/40 px-3 py-2">
                <summary className="cursor-pointer select-none font-semibold">
                  {group.tag}
                </summary>
                <div className="mt-2 grid gap-2">{group.items.map(renderModelButton)}</div>
              </details>
            ))}
          </div>
        ) : models.length ? (
          <div className="grid gap-2">{models.map(renderModelButton)}</div>
        ) : (
          <p className="text-sm opacity-70">No supported model files were found.</p>
        )}
        <div className="mt-6 text-xs opacity-60">Select a filename to load its viewer.</div>
      </aside>

      <div className="min-w-0">
        {!selectedModel ? (
          <div className="flex items-center justify-center rounded-2xl bg-base-200" style={{ height }}>
            <div className="text-sm opacity-60">Select a model on the left to view it.</div>
          </div>
        ) : !FormatModel ? (
          <div
            className="flex items-center justify-center rounded-2xl bg-base-200 p-8 text-center"
            style={{ height }}
            role="alert"
          >
            <div>
              <p className="font-bold">Unknown model format</p>
              <p className="mt-2 text-sm opacity-70">
                The extension in {selectedModel.name} is not supported.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute right-3 top-3 z-10 flex flex-wrap gap-2">
              <button className="btn btn-sm" type="button" onClick={() => setFitNonce((value) => value + 1)}>
                Fit view
              </button>
              <button className="btn btn-sm" type="button" onClick={() => setAutoRotate((value) => !value)}>
                {autoRotate ? "Stop rotation" : "Auto rotate"}
              </button>
              <button className="btn btn-sm" type="button" onClick={() => setWireframe((value) => !value)}>
                {wireframe ? "Solid" : "Wireframe"}
              </button>
              <button
                className="btn btn-sm"
                type="button"
                aria-pressed={measure}
                onClick={() => {
                  setMeasure((value) => !value);
                  setA(null);
                  setB(null);
                }}
              >
                {measure ? "Stop measuring" : "Measure"}
              </button>
              <button className="btn btn-sm" type="button" onClick={() => { setA(null); setB(null); }}>
                Clear points
              </button>
              <button
                className="btn btn-sm"
                type="button"
                onClick={() => {
                  setAutoRotate(false);
                  setWireframe(false);
                  resetMeasurement();
                  setFitNonce((value) => value + 1);
                }}
              >
                Reset viewer
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl bg-base-200" style={{ height }}>
              <ModelErrorBoundary
                resetKey={`${selectedModel.name}:${retryNonce}`}
                onRetry={() => setRetryNonce((value) => value + 1)}
              >
                <Canvas
                  key={`${selectedModel.name}:${retryNonce}`}
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
                      <FitOnModelChange selectedKey={`${selectedModel.name}:${fitNonce}`} />
                      <FormatModel
                        url={selectedModel.url}
                        wireframe={wireframe}
                        onPickPoint={pickPoint}
                        enablePick={measure}
                      />
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
              </ModelErrorBoundary>
            </div>

            {a && (
              <div className="mt-3 text-sm opacity-80" aria-live="polite">
                {b ? (
                  <span>
                    Distance: <span className="font-semibold">{distanceMm?.toFixed(2)} mm</span>
                  </span>
                ) : (
                  <span>Point A selected. Select point B.</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
