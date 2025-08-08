const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const schoolController = require('../controllers/schoolController');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation for adding a school
const addSchoolValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('latitude')
    .exists({ checkFalsy: true })
    .withMessage('Latitude is required')
    .bail()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90'),
  body('longitude')
    .exists({ checkFalsy: true })
    .withMessage('Longitude is required')
    .bail()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a number between -180 and 180'),
  validate,
];

// Validation for listing schools
const listSchoolsValidation = [
  query('latitude')
    .exists({ checkFalsy: true })
    .withMessage('Latitude query param is required')
    .bail()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90'),
  query('longitude')
    .exists({ checkFalsy: true })
    .withMessage('Longitude query param is required')
    .bail()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a number between -180 and 180'),
  validate,
];

router.post('/addSchool', addSchoolValidation, schoolController.addSchool);
router.get('/listSchools', listSchoolsValidation, schoolController.listSchools);

module.exports = router;