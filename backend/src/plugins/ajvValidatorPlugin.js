import Ajv from "ajv";
import ajvFormats from "ajv-formats";
import ajvErrors from "ajv-errors";

import fp from "fastify-plugin";

async function validatorPlugin(app) {
  const ajv = new Ajv({
    allErrors: true,
    $data: true,
    keywords: ["kind", "modifier"],
  });

  ajvFormats(ajv);
  ajvErrors(ajv);

  app.setValidatorCompiler(({ schema }) => {
    return ajv.compile(schema);
  });
}

export default fp(validatorPlugin);
