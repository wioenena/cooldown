export class CooldownState {
  public constructor(
    public readonly endTime: number,
    public remainingRequestCount: number,
  ) {}

  public get remainingTime() {
    return Math.max(0, this.endTime - Date.now());
  }
}
