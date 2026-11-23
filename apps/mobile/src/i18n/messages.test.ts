import { decodeOptions, msg } from "gt-react-native";
import { expect, it } from "vite-plus/test";

import ko from "./translations/ko.json";

// gt() looks Korean up by this hash on every render, and our gt-i18n patch remembers it.
const catalogKey = (message: string, $context: string) =>
  decodeOptions(msg(message, { $context }))?.$_hash;

it("finds the Korean catalog entry for a repeated string in each of its contexts", () => {
  for (let render = 0; render < 2; render += 1) {
    expect(catalogKey("Pin", "verb, thread action")).toBe("c49aa86c0d55101b");
    expect(catalogKey("Pin", "verb, keep the project at the top")).toBe("da558d4aa2205fb0");
  }
  expect(ko).toMatchObject({ c49aa86c0d55101b: "고정", da558d4aa2205fb0: "고정" });
});
