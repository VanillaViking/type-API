import { Test } from "./index.js";
import { addTests as inputSchema } from "../simpleSchemas.js"

/**
  * query the database for tests filtered by fields passed in through input
  *
  * @param {Object} input - Request input
  * @param {String} input.discordId - discordId of test taker
  * @param {Number} input.wpm - words per minute of test
  * @param {Number} input.accuracy - accuracy of test
  * @param {Number} input.tp - Typing points that the test is worth
  * @param {String} input.promptId - Id of the prompt that the test was taken on
  * @param {Date} input.date - date of test
  */
export default async function addTests(input) {
  // mutates input
  // add in default values and such
  const cleanedInput = inputSchema.clean(input)
  inputSchema.validate(cleanedInput)

  const testsArray = cleanedInput.tests.map((test) => new Test(test))
  console.log(testsArray)

  return Test.collection.insertMany(testsArray);
}

