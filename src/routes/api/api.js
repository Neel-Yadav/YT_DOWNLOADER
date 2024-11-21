const express = require("express");
const GetVideoInfo = require("../../controllers/getVideoInfo");
const { DownloadVideo, DownloadAudio } = require("../../controllers/download");

const api = express.Router();

api.get("/v1/getDetails", GetVideoInfo);
api.get("/v1/DownloadVideo", DownloadVideo);
api.get("/v1/DownloadAudio", DownloadAudio);

module.exports = api;
