import { CooldownState } from "./CooldownState.ts";

export class Cooldown<T> {
  readonly standyByTime: number;
  readonly requestCountPerTime: number;
  readonly cache = new Map<T, CooldownState>();

  public constructor(
    standbyTime: number,
    requestCountPerTime: number,
    private readonly persistent = false,
  ) {
    if (standbyTime <= 0) throw new Error("standbyTime must be positive");
    if (requestCountPerTime <= 0) {
      throw new Error("requestCountPerTime must be positive");
    }
    this.standyByTime = standbyTime;
    this.requestCountPerTime = requestCountPerTime;
  }

  public onCooldown(id: T) {
    const state = this.cache.get(id);

    if (state) {
      if (--state.remainingRequestCount <= 0 && state.endTime >= Date.now()) {
        return true;
      }
      return false;
    } else {
      return this.add(id);
    }
  }

  private add(id: T) {
    this.cache.set(
      id,
      new CooldownState(
        Date.now() + this.standyByTime,
        this.requestCountPerTime,
      ),
    );

    const i = setTimeout(() => {
      this.cache.delete(id);
    }, this.standyByTime);

    if (!this.persistent) {
      try {
        Deno.unrefTimer(i);
      } catch (err) {
        if (!(err instanceof ReferenceError)) {
          throw err;
        }
        console.error("Deno.unrefTimer is not available");
      }
    }

    return false;
  }
}
