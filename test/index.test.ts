import Spy from "../lib";
describe("it should pass the tests", () => {
  it("should work properly", () => {
    expect(2).toEqual(2);
    const obj = Spy(
      {
        name: "Joe",
        printName(name) {
          return name;
        },
        printObjName() {
          return this.name;
        },
      },
      {
        canGet() {
          return true;
        },
        tapGet(target, prop, receiver) {
          //@ts-ignore
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
      },
    );
    expect(obj.printName("Jipy")).toBe("JipyWallace");
    expect(obj.printObjName()).toBe("Joe Biden Modified");
  });
});
