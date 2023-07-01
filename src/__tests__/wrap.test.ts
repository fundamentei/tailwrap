import { describe, expect, it } from "vitest";
import wrap, { groupClassList } from "../wrap";

describe("wrap", () => {
  it("breaks up a string of classes into a vertically wrapped string of classes", () => {
    expect(wrap("w-full hover:text-blue-600 hover:underline flex", "MODIFIER", "CLASSNAMES")).toEqual(
      `
classNames(
  "w-full flex",
  "hover:text-blue-600 hover:underline"
)
      `.trim()
    );
  });

  it("keeps all classes", () => {
    expect(
      groupClassList(
        "w-full rounded-md flex font-monospace text-slate-600 bg-slate-50/50 hover:text-blue-600 hover:underline hover:cursor-pointer",
        "MODIFIER"
      )
    ).toEqual([
      ["w-full", "rounded-md", "flex", "font-monospace", "text-slate-600", "bg-slate-50/50"],
      ["hover:text-blue-600", "hover:underline", "hover:cursor-pointer"]
    ]);

    expect(
      wrap(
        "w-full rounded-md flex font-monospace text-slate-600 bg-slate-50/50 hover:text-blue-600 hover:underline hover:cursor-pointer non-tailwind-class",
        "MODIFIER",
        "CLASSNAMES"
      )
    ).toEqual(
      `
classNames(
  "w-full rounded-md flex font-monospace text-slate-600 bg-slate-50/50",
  "hover:text-blue-600 hover:underline hover:cursor-pointer",
  "non-tailwind-class"
)
      `.trim()
    );
  });
});
