type TapSignature<T extends Object> = (
  target: T,
  prop: string | symbol,
  receiver: any,
) => any;
type Descriptor = {
  type: string;
};
type Handler<T extends Object> = Partial<
  {
    canGet: (descriptor: Descriptor) => boolean;
    canSet: (oldValue: any, newValue: any, descriptor: Descriptor) => boolean;
    tapGet: TapSignature<T>;
    tapSet: TapSignature<T>;
  } & Omit<ProxyHandler<T>, "get" | "set">
>;
export { Descriptor, Handler };
