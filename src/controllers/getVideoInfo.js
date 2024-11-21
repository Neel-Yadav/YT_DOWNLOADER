const ytdl = require("ytdl-core");

const GetVideoInfo = async (req, res) => {
  //? Get The Url From Server ...
  const videoUrl = req.query.videoUrl;

  //! Validate The Url
  if (!videoUrl) {
    return res.status(400).json({ message: "Url Is Empty" }).end();
  }

  try {
    const videoInfo = await ytdl.getInfo(videoUrl);

    //! Get the video Title
    const videoTitle = videoInfo.videoDetails.title;

    //! Get The Video Thumbnail URL
    const videoThumbnail =
      videoInfo.videoDetails.thumbnails[
        videoInfo.videoDetails.thumbnails.length - 1
      ].url;

    // //! Get The Video Quality Formatted Data
    // const videoQuality = videoInfo.formats
    //   .filter((format) => format.hasVideo)
    //   .map((format) => ({
    //     quality: format.qualityLabel.replace(/p\d*$/, ""),
    //   }));

    //! Step 1: Group formats by quality and keep the highest bitrate
    const filteredVideoQuality = Array.from(
      videoInfo.formats
        .filter((format) => format.hasVideo)
        .map((format) => ({
          quality: format.qualityLabel.replace(/p\d*$/, ""),
          bitrate: format.bitrate, // Ensure bitrate is available for sorting
        }))
        .reduce((map, format) => {
          if (
            !map.has(format.quality) ||
            map.get(format.quality).bitrate < format.bitrate
          ) {
            map.set(format.quality, format);
          }
          return map;
        }, new Map())
        .values()
    ).sort((a, b) => Number(b.quality) - Number(a.quality)); // Sort by quality as a number

    //! Set All Data For Sending
    const data = {
      videoTitle,
      videoThumbnail,
      videoQuality: filteredVideoQuality,
    };

    //! Send the data To Client
    return res.status(200).json(data).end();
  } catch (error) {
    // ! Error Handling
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed To Fetch Video Details" })
      .end();
  }
};

module.exports = GetVideoInfo;
