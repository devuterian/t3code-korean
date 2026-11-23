import { act, createRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, onTestFinished, vi } from "vite-plus/test";

const input = vi.hoisted(() => ({
  values: [] as string[],
  onChangeText: null as ((text: string) => void) | null,
}));

vi.mock("react-native", () => ({
  View: (props: { readonly children?: ReactNode }) => <div>{props.children}</div>,
  Pressable: () => null,
  TextInput: (props: { readonly value: string; readonly onChangeText: (text: string) => void }) => {
    input.values.push(props.value);
    input.onChangeText = props.onChangeText;
    return null;
  },
}));
vi.mock("./AppSymbol", () => ({ SymbolView: () => null }));
vi.mock("./useAndroidControlSizing", () => ({
  useAndroidControlSizing: () => ({ scale: 1, mediumIconSize: 20 }),
}));

import { SearchField } from "./SearchField";

function render(value: string, onChangeText: (text: string) => void) {
  return (
    <SearchField
      inputRef={createRef()}
      accessibilityLabel="Search"
      clearAccessibilityLabel="Clear search"
      placeholder="Search"
      value={value}
      onChangeText={onChangeText}
    />
  );
}

it("keeps typed text while the owner's value lags, then follows the owner's own changes", () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const root = createRoot(document.createElement("div"));
  onTestFinished(() => act(() => root.unmount()));
  const typed: string[] = [];
  const onChangeText = (text: string) => typed.push(text);

  act(() => root.render(render("ㅎ", onChangeText)));
  // The workspace app bar projects the field out of tree, so the owner's "하" arrives a
  // render later. The input must not be handed the stale "ㅎ" in between: that rewrites
  // the native text and ends the IME composition.
  input.values.length = 0;
  act(() => input.onChangeText?.("하"));
  expect(typed).toEqual(["하"]);
  expect(input.values).toEqual(["하"]);

  act(() => root.render(render("하", onChangeText)));
  expect(input.values.at(-1)).toBe("하");

  // A cleared or closed search, or another tab's query, comes from the owner.
  act(() => root.render(render("", onChangeText)));
  expect(input.values.at(-1)).toBe("");
});
