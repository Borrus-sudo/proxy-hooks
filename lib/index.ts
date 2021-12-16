import type { Descriptor, Handler } from "./types";

export default function <T extends Object>(
  targetObject: T,
  handler: Handler<T>,
) {
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
        } else {
          target[prop] = value;
          return true;
        }
      }
      return true;
    },
    ...handler,
  });
}
