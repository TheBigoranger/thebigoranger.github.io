export function createMinimalGlb() {
  const json = JSON.stringify({
    asset: { version: "2.0", generator: "Portfolio test fixture" },
    scene: 0,
    scenes: [{ nodes: [] }],
  });
  const jsonBytes = Buffer.from(json, "utf8");
  const paddedLength = Math.ceil(jsonBytes.length / 4) * 4;
  const output = Buffer.alloc(12 + 8 + paddedLength, 0x20);

  output.writeUInt32LE(0x46546c67, 0);
  output.writeUInt32LE(2, 4);
  output.writeUInt32LE(output.length, 8);
  output.writeUInt32LE(paddedLength, 12);
  output.writeUInt32LE(0x4e4f534a, 16);
  jsonBytes.copy(output, 20);
  return output.buffer.slice(output.byteOffset, output.byteOffset + output.byteLength);
}
