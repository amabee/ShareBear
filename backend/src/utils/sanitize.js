import sanitizeHtml from "sanitize-html";
import he from "he";

// Sanitize input to remove dangerous HTML/scripts
export function sanitizeInput(input) {
  if (typeof input !== "string") return input;
  return sanitizeHtml(input, {
    allowedTags: ["b", "i", "em", "strong", "a", "ul", "ol", "li", "p", "br"], // Remove all HTML tags
    allowedAttributes: {},
  });
}

// Encode output to prevent XSS when rendering
export function encodeOutput(output) {
  if (typeof output !== "string") return output;
  return he.encode(output);
}

export function safeDecodeOutput(output) {
  if (typeof output !== "string") {
    return output;
  }

  let decoded = output;
  let maxIterations = 10;
  let iterations = 0;

  while (iterations < maxIterations) {
    const previousDecoded = decoded;
    decoded = he.decode(decoded);

    if (decoded === previousDecoded) {
      break;
    }

    iterations++;
  }

  return decoded;
}
