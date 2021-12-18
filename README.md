<!-- DO NOT REMOVE - contributor_list:data:start:["Borrus-sudo"]:end -->

# ⚓ proxy-hooks

[![All Contributors](https://img.shields.io/github/contributors/Borrus-sudo/proxy-hooks?color=orange)](#contributors-)
![License](https://img.shields.io/github/license/Borrus-sudo/proxy-hooks?label=License)
![Last Commit](https://img.shields.io/github/last-commit/Borrus-sudo/proxy-hooks?label=Last%20Commit)
![Stars](https://img.shields.io/github/stars/Borrus-sudo/proxy-hooks)
![Forks](https://img.shields.io/github/forks/Borrus-sudo/proxy-hooks)

## Philosophy

I built this pkg with the primary intention of making the use of Proxy simple and easy. Additionally it also provides the functionality api of other projects like [tinyspy](https://github.com/Aslemammad/tinyspy) [nanospy](https://github.com/ai/nanospy) via the hooks `methodArguments` and `methodReturn`

## Usage

```ts
import Spy from "proxy-hooks";
const originalObj = {
  name: "Joe",
  printName(name) {
    return name;
  },
  printObjName() {
    return this.name;
  },
}; // can also be a function
const handler = {
  canGet() {
    return true;
  },
  tapGet(target, prop, receiver) {
    return Reflect.get(...arguments);
  },
  methodArguments(cachedInfo, args) {
    args[0] = args[0] + "Wallace";
  },
  methodReturn(cachedInfo, returnVal) {
    if (cachedInfo.propName === "printObjName") {
      return "Joe Biden Modified";
    }
    return returnVal;
  },
};
const [proxy, revokeProxy] = Spy(orignalObj, handler);
expect(obj.printName("Jipy")).toBe("JipyWallace");
expect(obj.printObjName()).toBe("Joe Biden Modified");
revokeProxy.revoke();
```

The Handler object has the following type signature. It can accept other native [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy) methods as well other than get,set and apply.

```ts
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
    ) => void;
    methodReturn: (
      cachedKnowledge: {
        propName: string | symbol;
        calls: number;
        results: any[];
      },
      result: any,
    ) => any | void;
  } & Omit<ProxyHandler<T>, "get" | "set" | "apply">
>;
```

Checks its [types.d.ts](https://github.com/Borrus-sudo/proxy-hooks/blob/main/lib/types.d.ts) file for complete API.

## Installation

`npm i proxy-hookified` or `yarn add proxy-hookified`

## 🎉 Contributing

Contributions are welcome! Whether it is a small documentation change or a breaking feature, we welcome it!

_Please note: All contributions are taken under the MIT license_

<!-- prettier-ignore-start -->
<!-- DO NOT REMOVE - contributor_list:start -->
## 👥 Contributors


- **[@Borrus-sudo](https://github.com/Borrus-sudo)**

<!-- DO NOT REMOVE - contributor_list:end -->
<!-- prettier-ignore-end -->
