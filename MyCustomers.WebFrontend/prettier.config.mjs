/** @type {import("prettier").Config & import("@trivago/prettier-plugin-sort-imports").PluginConfig} */
const prettierConfig = {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["^server-only$", "<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],
  importOrderSortSpecifiers: true,
};

export default prettierConfig;
