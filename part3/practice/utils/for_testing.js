const palindrome = (string) => string
    .split('')
    .reverse()
    .join('');

const average = (arr) => {
    const reducer = (sum, item) => sum + item;
    return arr.length === 0
        ? 0
        : arr.reduce(reducer, 0) / arr.length;
};

module.exports = {
    palindrome,
    average,
};
