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
  const removeFields = ["select", "sort", "page", "limit"];

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  console.log("req query", reqQuery);

  let queryStr = JSON.stringify(reqQuery); //create query string

  // create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
    console.log(fields);
  }

  // sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total =await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;

  // Pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  console.log(pagination);
  if (!bootcamps) {
    return next(new ErrorResponse(`Bootcamps not found`, 404));
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
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
