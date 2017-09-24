# Cyclical JSON Benchmark

```javascript
C02Q52FNFVH6-lm:cyclical-json buchbinder$ nvm use v8.6.0
Now using node v8.6.0 (npm v5.4.2)
C02Q52FNFVH6-lm:cyclical-json buchbinder$ node test.js
[ { desc: 'An Empty Object',
    circular: { val: {}, time: 3 },
    cyclical: { val: {}, time: 7 },
    cycle: { val: {}, time: 2 } },
  { desc: 'An Empty Array',
    circular: { val: [], time: 1 },
    cyclical: { val: [], time: 8 },
    cycle: { val: [], time: 1 } },
  { desc: 'A large flat object',
    circular: { val: [Object], time: 76 },
    cyclical: { val: [Object], time: 71 },
    cycle: { val: [Object], time: 52 } },
  { desc: 'A large array of identical objects',
    circular: { val: [Array], time: 1480 },
    cyclical: { val: [Array], time: 764 },
    cycle: { val: [Array], time: 767 } },
  { desc: 'A deeply nested cyclical array',
    circular: { val: [Array], time: 104 },
    cyclical: { val: [Array], time: 66 },
    cycle: { val: [Array], time: 32 } },
  { desc: 'A deeply nested cyclical obj',
    circular: { val: [Object], time: 77 },
    cyclical: { val: [Object], time: 42 },
    cycle: { val: [Object], time: 35 } } ]
 ```