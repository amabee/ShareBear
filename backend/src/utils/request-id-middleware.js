export const requestIdMiddleware = (req, reply, done) => {
  req.id = crypto.randomUUID();
  done();
};
