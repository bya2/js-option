const e = {
    tabWidth: 2,
    printWidth: 80,
    useTabs: !1,
    semi: !0,
    singleQuote: !1,
    quoteProps: "as-needed",
    jsxSingleQuote: !1,
    trailingComma: "es5",
    bracketSpacing: !0,
    bracketSameLine: !1,
    arrowParens: "always",
    proseWrap: "preserve",
    endOfLine: "auto",
    singleAttributePerLine: !0,
  },
  a = { organizeImports: !1, packagejson: !1 };
var r = ((r, t) => {
  const n = { ...e, ...r },
    i = { ...a, ...t };
  return {
    ...n,
    plugins: [
      i.organizeImports && "prettier-plugin-organize-imports",
      i.packagejson && "prettier-plugin-packagejson",
    ].filter(Boolean),
  };
})({}, { packagejson: !0 });
export { r as default };
