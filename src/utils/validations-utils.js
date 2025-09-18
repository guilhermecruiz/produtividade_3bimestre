import { z } from "zod";

export function getErrorsFromParsedValidation(parsedValidation) {
  const tree = z.treeifyError(parsedValidation);
  const messages = Object.values(tree).flat();
  return messages;
}