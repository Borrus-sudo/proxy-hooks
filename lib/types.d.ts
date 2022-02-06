type TapSignature<T extends Object> = (
  target: T,
  prop: string | symbol,
  receiver: any,
) => any;
type Descriptor = {
  name: string | symbol;
  type: string;
};
type CachedKnowledge = {
  [n: string | symbol]: {
    propName: string | symbol;
    calls: number;
    results: any[];
  };
};
type Handler<T extends Object> = Partial<
  {
    canGet: (descriptor: Descriptor) => boolean;
    canSet: (descriptor: Descriptor, oldValue: any, newValue: any) => boolean;
    tapGet: TapSignature<T>;
    tapSet: TapSignature<T>;
    methodArguments: (
      cachedKnowledge: {
        propName: string | symbol;
        calls: number;
        results: any[];
      },
      args: any[],
    ) => any[];
    methodReturn: (
      cachedKnowledge: {
        propName: string | symbol;
        calls: number;
        results: any[];
      },
      result: any,
    ) => any;
  } & Omit<ProxyHandler<T>, "get" | "set" | "apply">
>;
export { Descriptor, Handler, CachedKnowledge };
