export default () => ({
  security: {
    secret: process.env.JWT_SECRET,
  },
});
