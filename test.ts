import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Cooldown } from "./mod.ts";

const cooldown = new Cooldown(1000 * 10, 5);
const ID = "test";

Deno.test({
  name: "On cooldown",
  sanitizeResources: false,
  sanitizeOps: false,
  fn() {
    assertEquals(cooldown.cache.size, 0);
    for (let i = 0; i < 5; i++) {
      assertEquals(cooldown.onCooldown(ID), false);
    }
    assertEquals(cooldown.cache.size, 1);
    assertEquals(cooldown.onCooldown(ID), true);
    setTimeout(() => {
      assertEquals(cooldown.cache.size, 0);
      assertEquals(cooldown.onCooldown(ID), false);
    }, 1000 * 11);
  },
});
