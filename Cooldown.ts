import { CooldownState } from "./CooldownState.ts";

export class Cooldown<T> {
  readonly standyByTime: number;
  readonly requestCountPerTime: number;
  readonly cache = new Map<T, CooldownState>();

  public constructor(
    standbyTime: number,
    requestCountPerTime: number,
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
      this.cache.set(
        id,
        new CooldownState(
          Date.now() + this.standyByTime,
          this.requestCountPerTime,
        ),
      );

      setTimeout(() => {
        this.cache.delete(id);
      }, this.standyByTime);

      return false;
    }
  }
}
