import { waitServer } from "./test-utils";

await import.meta.glob(`@/**/*.(ts|svelte)`);

await waitServer();
