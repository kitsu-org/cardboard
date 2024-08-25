import dts from "bun-plugin-dts";

await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    format: "esm",
    sourcemap: "external",
    splitting: true,
    target: "node",
    plugins: [
        dts({
            output: {
                noBanner: true,
            },
        }),
    ],
}).then((output) => {
    if (!output.success) {
        console.error(output.logs);
        process.exit(1);
    }
});
