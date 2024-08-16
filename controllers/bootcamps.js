const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");

// @desc        get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  console.log(req.query);
  let query;

  const reqQuery = { ...req.query }; // copy req.query

  //fields to exclude
  const removeFields = ["select"];

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  console.log("req query", reqQuery);

  let queryStr = JSON.stringify(req.query); //create query string

  // create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // finding resource
  query = Bootcamp.find(JSON.parse(queryStr));
  const bootcamps = await query;
  if (!bootcamps) {
    return next(new ErrorResponse(`Bootcamps not found`, 404));
  }

  res.status(200).json({ success: true, msg: "get All bootcamp", bootcamps });
});

// @desc        get all bootcamp
// @route       GET /api/v1/bootcamp
// @access      Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found of id ${req.params.id}`, 404)
    );
  }

  return res
    .status(200)
    .json({ success: true, msg: "get All bootcamp", bootcamp });
});

// @desc        create new bootcamp
// @route       POST /api/v1/bootcampS
// @access      Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  if (!bootcamp) {
    return next(new ErrorResponse(`unable to create bootcamp`, 400));
  }
  return res.status(201).json({ success: true, data: bootcamp });
});

// @desc        update  bootcamp
// @route       PUT /api/v1/bootcamp/:id
// @access      Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found of id ${req.params.id}`, 404)
    );
  }
  return res
    .status(200)
    .json({ success: true, msg: `bootcamp updated ${req.params.id}` });
});

// @desc        delete  bootcamp
// @route       DELETE /api/v1/bootcamp/:id
// @access      Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found of id ${req.params.id}`, 404)
    );
  }
  return res
    .status(200)
    .json({ success: true, msg: `bootcamp deleted successfully` });
});
