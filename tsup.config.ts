import { Options } from "tsup";

const config: Options = {
  target: "es2020",
  splitting: true,
  format: ["esm", "cjs"],
  entryPoints: ["lib/index.ts"],
  clean: true,
  dts: true,
  outDir: "./out",
  minify: true,
};

export default config;
