/**
 * getRandomInteger function
 * Generates a random integer between 1 and 10 (inclusive).
 *
 * @returns {number} - Random integer between 1 and 10.
 */
export const getRandomInteger = () => {
    // Math.random() generates a random number between 0 (inclusive) and 1 (exclusive).
    // To get a random integer between 1 and 10 (inclusive), the following operations are performed.
    // Math.floor rounds down to the nearest integer.
    var randomNumber = Math.floor(Math.random() * 10) + 1;
    return randomNumber;
  };
