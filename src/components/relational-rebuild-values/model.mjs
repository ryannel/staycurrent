export const packages = [
  { id: 'P3', name: 'Green tea, 50 g', weight: 65 },
  { id: 'P7', name: 'Blue mug', weight: null },
  { id: 'P9', name: 'Teapot', weight: 820 },
];

export const filters = [
  { key: 'heavy', label: 'At least 100 g', sql: 'package_weight_g >= 100', values: [false, null, true], explanation: 'P3 is below 100 g; P9 is above it. P7 has not been measured, so its comparison is unknown.' },
  { key: 'not-heavy', label: 'NOT at least 100 g', sql: 'NOT (package_weight_g >= 100)', values: [true, null, false], explanation: 'NOT reverses true and false. It leaves unknown as unknown: P7 still has no measured weight.' },
  { key: 'both', label: 'At least 100 g AND P7', sql: "package_weight_g >= 100 AND product_id = 'P7'", values: [false, null, false], explanation: 'P3 and P9 cannot pass both tests. For P7, unknown AND true remains unknown.' },
  { key: 'either', label: 'At least 100 g OR P7', sql: "package_weight_g >= 100 OR product_id = 'P7'", values: [false, true, true], explanation: 'P7 passes because its code is P7. Unknown OR true is true, whatever its unmeasured weight turns out to be.' },
  { key: 'missing', label: 'Not yet measured', sql: 'package_weight_g IS NULL', values: [false, true, false], explanation: 'IS NULL asks whether the measurement is absent. It gives a definite answer for every product.' },
];

export const truthLabel = value => value === null ? 'unknown' : String(value);
