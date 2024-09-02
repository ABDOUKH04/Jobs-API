const jobsModel = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, UnauthenticatedError, BadRequestError } = require("../errors");
const getAllJobs = async (req, res) => {
  const job = await jobsModel.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ job });
};

const getJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;
  const job = await jobsModel.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with this id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await jobsModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};


const updateJob = async (req, res) => {
  const {
    body:{company , position},
    params: { id: jobId },
    user: { userId },
  } = req;

  if ( company ==='' || position ==='') {
    throw new BadRequestError('Bad Request')
  }

  const job = await jobsModel.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { runValidator: true, new: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with this id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};



const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;
  const job = await jobsModel.findByIdAndUpdate({ _id: jobId, createdBy: userId })
  if ( !job ) {
    throw new NotFoundError(`No job with this id ${jobId}` )
  }
  res.status(StatusCodes.OK).send("the job is removed")
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
