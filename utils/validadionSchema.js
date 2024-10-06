const Yup = require('yup');

module.exports.contentSchema = Yup
    .string()
    .trim()
    .matches(/[a-z0-9\s]+/i, { message: 'Content must contain only letters, numbers, and spaces.' })
    .required('Content is required.');

module.exports.loginSchema = Yup
    .string()
    .trim()
    .matches(/[a-z\s]{3,15}/i, { message: 'Login must contain between 3 and 15 letters only.' })
    .required('Login is required.');
