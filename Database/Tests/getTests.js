import { Test } from "./index.js"
import { getTests as inputSchema } from "../simpleSchemas.js"
import applyTestFilters from "../../util/applyTestFilters.js";

export default async function getTests(input) {
  inputSchema.validate(input);

  const filters = applyTestFilters(input)

  return Test.find(filters);
}
