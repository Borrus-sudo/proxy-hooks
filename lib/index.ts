import type { CachedKnowledge, Descriptor, Handler } from "./types";

export default function <T extends Object | Function>(
  targetObject: T,
  handler: Readonly<Handler<T>>,
) {
  if (typeof targetObject !== "function") {
    const cachedKnowledge: CachedKnowledge = {};
    Object.entries(targetObject).forEach(([prop, value]) => {
      if (typeof value === "function") {
        value.bind(targetObject);
        targetObject[prop] = function (...args) {
          if (handler.methodArguments) {
            handler.methodArguments(cachedKnowledge[prop], ...args);
          }
          let returnValue = value(...args);
          if (handler.methodReturn) {
            const changed = handler.methodReturn(
              cachedKnowledge[prop],
              returnValue,
            );
            if (typeof changed !== "undefined") {
              returnValue = changed;
            }
          }
          cachedKnowledge[prop].calls += 1;
          cachedKnowledge[prop].results.push(returnValue);
          return returnValue;
        };
      }
    });
  }
  return new Proxy(targetObject, {
    get(target: T, prop: string | symbol, receiver) {
      const descriptor: Descriptor = {
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
        const returnVal = handler.tapGet(target, prop, receiver);
        if (returnVal === "") {
          return Reflect.get(target, prop, receiver);
        } else {
          returnVal;
        }
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target: T, prop: string | symbol, value) {
      const descriptor: Descriptor = {
        type: "",
      };
      if (typeof target[prop] === "function") {
        descriptor.type = "method";
      } else {
        descriptor.type = "property";
      }
      if (handler.canSet) {
        const result = handler.canSet(target[prop], value, descriptor);
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
    apply() {},
    ...handler,
  });
}
