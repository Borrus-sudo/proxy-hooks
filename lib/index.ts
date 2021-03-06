import type { CachedKnowledge, Descriptor, Handler } from "./types";

export default function <T extends Object>(
  target: T,
  handler: Readonly<Handler<T>>,
): [T, { proxy: T; revoke: () => void }] {
  if (typeof target !== "function") {
    const cachedInfo: CachedKnowledge = {};
    Object.entries(
      Object.assign({}, target, Object.getPrototypeOf(target)),
    ).forEach(([prop, value]) => {
      cachedInfo[prop] = { propName: prop, calls: 0, results: [] };
      if (typeof value === "function") {
        if (value.constructor.name === "AsyncFunction") {
          target[prop] = async function (...args: any[]) {
            if (handler.methodArguments) {
              args = await handler.methodArguments(cachedInfo[prop], args);
            }

            let returnValue = await value.apply(target, args);
            if (handler.methodReturn) {
              returnValue = await handler.methodReturn(
                cachedInfo[prop],
                returnValue,
              );
            }
            cachedInfo[prop].calls += 1;
            cachedInfo[prop].results.push(returnValue);
            return returnValue;
          };
        } else {
          target[prop] = function (...args: any[]) {
            if (handler.methodArguments) {
              args = handler.methodArguments(cachedInfo[prop], args);
            }

            let returnValue = value.apply(target, args);
            if (handler.methodReturn) {
              returnValue = handler.methodReturn(cachedInfo[prop], returnValue);
            }
            cachedInfo[prop].calls += 1;
            cachedInfo[prop].results.push(returnValue);
            return returnValue;
          };
        }
      }
    });
  }
  let cachedInfo: { propName: ""; calls: number; results: any[] } = {
    //@ts-ignore
    propName: target.name,
    calls: 0,
    results: [],
  };
  const revocable = Proxy.revocable(target, {
    get(target: T, prop: string | symbol, receiver) {
      const descriptor: Descriptor = {
        name: prop,
        type: "",
      };
      if (typeof target[prop] === "function") {
        descriptor.type = "method";
      } else {
        descriptor.type = "property";
      }
      if (handler.canGet) {
        const shouldAccess = handler.canGet(descriptor);
        if (!shouldAccess) {
          throw new Error(
            "AccessError: The property " +
              prop.toString() +
              " cannot be accessed",
          );
        }
      }
      if (handler.tapGet) {
        return handler.tapGet(target, prop, receiver);
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target: T, prop: string | symbol, value) {
      const descriptor: Descriptor = {
        name: prop,
        type: "",
      };
      if (typeof target[prop] === "function") {
        descriptor.type = "method";
      } else {
        descriptor.type = "property";
      }
      if (handler.canSet) {
        const result = handler.canSet(descriptor, target[prop], value);
        if (!result) {
          return false;
        }
        if (handler.tapSet) {
          handler.tapSet(target, prop, value);
          return true;
        }
      }
      target[prop] = value;
      return true;
    },
    apply(target, thisArg, args) {
      if (handler.methodArguments) {
        args = handler.methodArguments(cachedInfo, args);
      }
      //@ts-ignore
      let returnValue = target.apply(thisArg, args);
      if (handler.methodReturn) {
        returnValue = handler.methodReturn(cachedInfo, returnValue);
      }
      cachedInfo.calls += 1;
      cachedInfo.results.push(returnValue);
      return returnValue;
    },
    ...handler,
  });
  return [revocable.proxy, revocable];
}
