type TapSignature<T extends Object> = (
  target: T,
  prop: string | symbol,
  receiver: any,
) => any;
type Descriptor = {
  type: string;
};
type CachedKnowledge = {
  [n: string | symbol]: { calls: number; results: any[] };
};
type Handler<T extends Object> = Partial<
  {
    canGet: (descriptor: Descriptor) => boolean;
    canSet: (oldValue: any, newValue: any, descriptor: Descriptor) => boolean;
    tapGet: TapSignature<T>;
    tapSet: TapSignature<T>;
    methodArguments: (
      cachedKnowledge: { calls: number; results: any[] },
      ...args: any[]
    ) => void;
    methodReturn: (
      cachedKnowledge: { calls: number; results: any[] },
      result: any,
    ) => any | void;
  } & Omit<ProxyHandler<T>, "get" | "set" | "apply">
>;
export { Descriptor, Handler, CachedKnowledge };
