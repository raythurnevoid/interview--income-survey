import { waitServer } from "./test-utils";

await import.meta.glob(`src/**/*.(ts|svelte)`);

await waitServer();
