import assert from "node:assert/strict";
import test from "node:test";
import { getModelFormat, SUPPORTED_MODEL_FORMATS } from "../src/components/three/model-format.ts";

test("dispatches every supported 3D format without query-string ambiguity", () => {
  assert.deepEqual(SUPPORTED_MODEL_FORMATS, ["stl", "obj", "ply", "fbx", "glb"]);
  assert.equal(getModelFormat("part.STL?download=1"), "stl");
  assert.equal(getModelFormat("/models/part.obj#mesh"), "obj");
  assert.equal(getModelFormat("part.ply"), "ply");
  assert.equal(getModelFormat("part.fbx"), "fbx");
  assert.equal(getModelFormat("part.glb"), "glb");
  assert.equal(getModelFormat("part.gltf"), "glb");
});

test("returns a recoverable null result for unknown or empty formats", () => {
  assert.equal(getModelFormat("part.step"), null);
  assert.equal(getModelFormat("README"), null);
  assert.equal(getModelFormat(""), null);
});
