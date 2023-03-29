const myModule = require("./sum");

test("Capitalize the first character of a string", () => {
  expect(myModule.capitalize("this is a test sentence")).toBe(
    "This is a test sentence"
  );
});

test("reverse string", () => {
  expect(myModule.reverseString("string")).toBe("gnirts");
});

test("calculator add", () => {
  expect(myModule.calculator.add(1, 2)).toBe(3);
});

test("calculator substract", () => {
  expect(myModule.calculator.subtract(2, 3)).toBe(1);
});

test("calculator multiply", () => {
  expect(myModule.calculator.multiply(3, 3)).toBe(9);
});

test("calculator divide", () => {
  expect(myModule.calculator.divide(3, 9)).toBe(3);
});

test("works with single letters", () => {
  expect(myModule.caesar("A", 1)).toBe("B");
});
test("works with words", () => {
  expect(myModule.caesar("Aaa", 1)).toBe("Bbb");
});
test("works with phrases", () => {
  expect(myModule.caesar("Hello, World!", 5)).toBe("Mjqqt, Btwqi!");
});
test("works with negative shift", () => {
  expect(myModule.caesar("Mjqqt, Btwqi!", -5)).toBe("Hello, World!");
});
test("wraps", () => {
  expect(myModule.caesar("Z", 1)).toBe("A");
});
test("works with large shift factors", () => {
  expect(myModule.caesar("Hello, World!", 75)).toBe("Ebiil, Tloia!");
});
test("works with large negative shift factors", () => {
  expect(myModule.caesar("Hello, World!", -29)).toBe("Ebiil, Tloia!");
});

test("analyzeArray average", () => {
  expect(myModule.analyzeArray([1, 2, 3, 4, 5])).toEqual(expect.objectContaining({ average: 3 }));
});
test("analyzeArray min", () => {
  expect(myModule.analyzeArray([1, 2, 3, 4, 5])).toEqual(expect.objectContaining({ min: 1 }));
});
test("analyzeArray max", () => {
  expect(myModule.analyzeArray([1, 2, 3, 4, 5])).toEqual(expect.objectContaining({ max: 5 }));
});
test("analyzeArray length", () => {
  expect(myModule.analyzeArray([1, 2, 3, 4, 5])).toEqual(expect.objectContaining({ length: 5 }));
});
