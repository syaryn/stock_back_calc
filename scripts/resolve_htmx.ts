try {
  const path = import.meta.resolve("npm:htmx.org/dist/htmx.min.js");
  console.log("Resolved Path:", path);

  // Try to read content to confirm access
  const content = await Deno.readTextFile(new URL(path));
  console.log("Content length:", content.length);
} catch (e) {
  console.error("Failed to resolve:", e);
}
