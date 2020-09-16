const { average } = require('../utils/for_testing');

describe('average', () => {
    test('of one number is itself', () => {
        expect(average([1])).toBe(1);
    });
    test('of many comes correct', () => {
        expect(average([1, 2, 3])).toBe(2);
    });
    test('of none is 0', () => {
        expect(average([])).toBe(0);
    });
});
