import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { createMinimalGlb } from "./fixtures/minimal-glb.mjs";

const fixture = (name) => new URL(`./fixtures/${name}`, import.meta.url);

test("OBJ and PLY fixtures parse into triangle geometry", async () => {
  const obj = new OBJLoader().parse(await readFile(fixture("minimal.obj"), "utf8"));
  assert.equal(obj.children.length, 1);
  assert.equal(obj.children[0].geometry.getAttribute("position").count, 3);

  const plyBuffer = await readFile(fixture("minimal.ply"));
  const ply = new PLYLoader().parse(
    plyBuffer.buffer.slice(plyBuffer.byteOffset, plyBuffer.byteOffset + plyBuffer.byteLength),
  );
  assert.equal(ply.getAttribute("position").count, 3);
});

test("minimal GLB fixture parses into an empty but valid scene", async () => {
  const gltf = await new Promise((resolve, reject) => {
    new GLTFLoader().parse(createMinimalGlb(), "", resolve, reject);
  });
  assert.equal(gltf.scene.type, "Group");
  assert.equal(gltf.scene.children.length, 0);
});

test("malformed FBX fixture produces a recoverable parse error", async () => {
  const source = await readFile(fixture("invalid.fbx"));
  const buffer = source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
  assert.throws(() => new FBXLoader().parse(buffer, ""), /FBX|Cannot|Cannot read|version/i);
});

test("the shipped STL model parses with renderable vertices", async () => {
  const source = await readFile(new URL("../public/3Dmodels/snowboard_vise.STL", import.meta.url));
  const buffer = source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
  const geometry = new STLLoader().parse(buffer);
  assert.ok(geometry.getAttribute("position").count > 0);
});
