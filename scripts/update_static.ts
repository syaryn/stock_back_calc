import { ensureDir } from "@std/fs";
import { dirname, join } from "@std/path";

const ASSETS = [
  {
    name: "htmx",
    pkg: "npm:htmx.org/dist/htmx.min.js",
    dest: "static/js/htmx.min.js",
  },
  {
    name: "alpinejs",
    pkg: "npm:alpinejs/dist/cdn.min.js",
    dest: "static/js/alpine.min.js",
  },
  {
    name: "picocss",
    pkg: "npm:@picocss/pico/css/pico.min.css", // Path might need adjustment
    dest: "static/css/pico.min.css",
  },
];

async function updateAssets() {
  console.log("Updating static assets...");

  for (const asset of ASSETS) {
    try {
      console.log(`Resolving ${asset.name}...`);
      const srcUrl = import.meta.resolve(asset.pkg);
      // import.meta.resolve returns a file URL for local cache or http usually
      // For npm: specifiers in Deno, it resolves to the file in cache

      if (!srcUrl.startsWith("file://")) {
        console.warn(
          `Warning: ${asset.name} resolved to non-file URL: ${srcUrl}`,
        );
        // If it's http/https we can fetch it, if it's node: or npm: that wasn't resolved to file, we have an issue.
        // But Deno usually resolves npm: to file:// in cache.
      }

      const destPath = join(Deno.cwd(), asset.dest);
      await ensureDir(dirname(destPath));

      if (srcUrl.startsWith("file://")) {
        await Deno.copyFile(new URL(srcUrl), destPath);
      } else {
        // Fallback for remote URLs if any
        const resp = await fetch(srcUrl);
        if (!resp.ok) throw new Error(`Failed to fetch ${srcUrl}`);
        const data = await resp.arrayBuffer();
        await Deno.writeFile(destPath, new Uint8Array(data));
      }

      console.log(`Updated ${asset.dest}`);
    } catch (e) {
      console.error(`Error updating ${asset.name}:`, e);
      // Inspecting errors might help if paths are wrong
    }
  }
  console.log("Done.");
}

if (import.meta.main) {
  updateAssets();
}
