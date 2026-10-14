import assert from "node:assert/strict";
import test from "node:test";

import {
  formatNumberLabel,
  formatPercentLabel,
  mergeNumberFormatOptions,
} from "../src/lib/number-format.ts";

test("formatPercentLabel omits default trailing zeros for integers", () => {
  assert.equal(formatPercentLabel(0), "0%");
  assert.equal(formatPercentLabel(12), "12%");
  assert.equal(formatPercentLabel(12.36), "12.4%");
});

test("formatPercentLabel preserves explicitly requested precision", () => {
  assert.equal(formatPercentLabel(12, { percentFractionDigits: 1 }), "12.0%");
  assert.equal(formatPercentLabel(12, { fractionDigits: 2 }), "12.00%");
  assert.equal(
    formatPercentLabel(12, {
      fractionDigits: 2,
      preserveTrailingZeros: false,
    }),
    "12%",
  );
});

test("formatPercentLabel returns empty values without a percent suffix", () => {
  assert.equal(formatPercentLabel(null), "—");
  assert.equal(formatPercentLabel(undefined), "—");
  assert.equal(formatPercentLabel(Number.NaN), "—");
  assert.equal(formatPercentLabel(Number.POSITIVE_INFINITY), "—");
  assert.equal(formatPercentLabel(null, { emptyValue: "N/A" }), "N/A");
});

test("number formatting keeps locale, compact and merge behavior", () => {
  assert.equal(formatNumberLabel(1234.5), "1,234.50");
  assert.equal(formatNumberLabel(12500, { notation: "compact" }), "12.5k");
  assert.deepEqual(
    mergeNumberFormatOptions(
      { locale: "en-US", fractionDigits: 2 },
      { fractionDigits: 1 },
    ),
    { locale: "en-US", fractionDigits: 1 },
  );
});
