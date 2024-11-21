const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const downloadDir = path.resolve(__dirname, "../../downloads");
const ytdlp = path.join(__dirname, "../../", "yt-dlp.exe");

// Download video handler
const DownloadVideo = (req, res) => {
  const videoUrl = req.query.videoUrl;
  const videoTitle = req.query.title;
  const resolution = req.query.resolution || "best";

  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  const outputPath = path.join(downloadDir, `${videoTitle}_${resolution}.webm`);

  try {
    console.log("Starting video download...");

    const downloadFile = spawn(ytdlp, [
      "-f",
      resolution
        ? `bestvideo[height=${resolution}]+bestaudio`
        : "bestvideo+bestaudio",
      "-o",
      outputPath,
      videoUrl,
    ]);

    let downloadProgress = "";

    downloadFile.stdout.on("data", (data) => {
      const dataString = data.toString();
      console.log(`Download progress: ${dataString}`);

      // Parsing progress percentage
      const match = dataString.match(/(\d+)%/);
      if (match) {
        const progress = match[1];
        if (progress !== downloadProgress) {
          downloadProgress = progress;
          // We could send progress info via WebSocket or similar for real-time updates
          console.log(`Progress: ${progress}%`);
        }
      }
    });

    downloadFile.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
    });

    downloadFile.on("close", (code) => {
      if (code === 0) {
        console.log("Video downloaded successfully.");

        // Set headers for the video file download
        res.setHeader("Content-Type", "video/webm");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${videoTitle}_${resolution}.webm"`
        );

        // Stream the file directly to the client
        fs.createReadStream(outputPath).pipe(res);

        // Clean up file after 30 seconds
        setTimeout(() => {
          fs.unlinkSync(outputPath); // Delete the file after serving
        }, 30000); // Keep the file for 30 seconds
      } else {
        console.error(`Download failed with exit code: ${code}`);
        res.status(500).end("Download failed");
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).end("An error occurred during download");
  }
};

// Download audio handler
const DownloadAudio = (req, res) => {
  const videoUrl = req.query.videoUrl;
  const videoTitle = req.query.title.replace(/\.[^/.]+$/, ""); // Remove file extension from title

  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${videoTitle}.mp3"`
  );

  try {
    console.log("Starting audio download...");

    const downloadFile = spawn("yt-dlp", [
      "-f",
      "bestaudio",
      "-o",
      "-",
      videoUrl,
    ]);

    // Pipe the audio download directly to the response
    downloadFile.stdout.pipe(res);

    downloadFile.stderr.on("data", (data) => {
      console.error(`Error: ${data.toString()}`);
    });

    downloadFile.on("close", (code) => {
      if (code !== 0) {
        console.error(`Download failed with exit code: ${code}`);
        res.status(500).send({ error: "Download failed" }).end();
      } else {
        console.log("Audio downloaded successfully.");
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).send({ error: "An error occurred during download" });
  }
};

module.exports = { DownloadVideo, DownloadAudio };
