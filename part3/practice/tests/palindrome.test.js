const { palindrome } = require('../utils/for_testing');

// need to add jest as env in .eslintrc to get rid of errors on jest globals as undefs

test('palindrome of a', () => {
    const result = palindrome('a');
    expect(result).toBe('a');
});

test('palindrome of react', () => {
    const result = palindrome('react');
    expect(result).toBe('tcaer');
});

test('palindrome of level', () => {
    const result = palindrome('level');
    expect(result).toBe('level');
});
