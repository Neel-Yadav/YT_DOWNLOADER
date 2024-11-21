let videoURL;

const SEARCH_URL = document
  .getElementById("SEARCH_URL")
  .addEventListener("change", function (e) {
    videoURL = e.target.value;
  });

const Find_Button = document.getElementById("Find_Button");
const SearchBox_Button = document.getElementsByClassName("SearchBox_Button");
const STATUS_TEXT = document.getElementById("STATUS_TEXT");
const VIDEO_INFO_BOX = document.getElementById("VIDEO_INFO_BOX");
const Thumbnail = document.getElementById("Thumbnail");
const DownloadThumbnail = document.getElementById("DownloadThumbnail");
const videoQualityList = document.getElementById("videoQualityList");
const audioQualityList = document.getElementById("audioQualityList");

let qualityVideosArray = [];

function formatSwitcher(id) {
  const button1 = document.getElementById("btn1");
  const button2 = document.getElementById("btn2");

  const videoQualityListTab = document.getElementById("videoQualityListTab");
  const audioQualityListTab = document.getElementById("audioQualityListTab");

  if (id === 0) {
    button1.classList.add("isSelected");
    button2.classList.remove("isSelected");
    videoQualityListTab.classList.add("formatTabSelected");
    audioQualityListTab.classList.remove("formatTabSelected");
  } else if (id === 1) {
    button2.classList.add("isSelected");
    button1.classList.remove("isSelected");
    audioQualityListTab.classList.add("formatTabSelected");
    videoQualityListTab.classList.remove("formatTabSelected");
  }
}

async function getVideoInfo() {
  SearchBox_Button.disabled = true;
  Find_Button.textContent = "Loading...";
  qualityVideosArray = [];

  if (!videoURL) {
    SearchBox_Button.disabled = false;
    Find_Button.textContent = "Find";
    return alert("Please Enter Video URL");
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/getDetails?videoUrl=${videoURL}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    VIDEO_INFO_BOX.style.display = "flex";

    Thumbnail.src = data.videoThumbnail;
    DownloadThumbnail.href = data.videoThumbnail;

    data.videoQuality.forEach((quality) => {
      const qualityButton = document.createElement("button");
      qualityButton.className = "FTC-Card";
      qualityButton.textContent = `${quality.quality}p`;

      qualityButton.addEventListener("click", () => {
        DownloadVideo(
          videoURL,
          data.videoTitle.replace(/[<>:"/\\|?*]+/g, "_"),
          quality.quality,
          qualityButton
        );
      });

      qualityVideosArray.push(qualityButton);
      videoQualityList.appendChild(qualityButton);
    });

    const audioDownloadButton = document.createElement("button");
    audioDownloadButton.className = "FTC-Card";
    audioDownloadButton.textContent = "Download Audio";
    audioDownloadButton.addEventListener("click", () => {
      DownloadAudio(
        videoURL,
        data.videoTitle.replace(/[<>:"/\\|?*]+/g, "_"),
        audioDownloadButton
      );
    });

    audioQualityList.appendChild(audioDownloadButton);

    STATUS_TEXT.style.display = "block";
    STATUS_TEXT.textContent = "Your Video Fetched Successfully";
    SearchBox_Button.disabled = false;
    Find_Button.textContent = "Find";
  } catch (error) {
    console.error("Error fetching video info:", error);
    alert("An error occurred while fetching video information.");
    SearchBox_Button.disabled = false;
    Find_Button.textContent = "Find";
  }
}

async function DownloadVideo(videoUrl, videoTitle, resolution, button) {
  qualityVideosArray.forEach((qualityButton) => {
    qualityButton.disabled = true;
    qualityButton.style.cursor = "not-allowed"; // Fixed cursor property
  });

  const originalButtonText = button.textContent;
  button.textContent = "downloading...";

  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/DownloadVideo?videoUrl=${videoUrl}&title=${videoTitle}&resolution=${resolution}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${videoTitle}_${resolution}.webm`;
    a.click();
    URL.revokeObjectURL(url);

    qualityVideosArray.forEach((qualityButton) => {
      qualityButton.disabled = false;
      qualityButton.style.cursor = "pointer";
    });
    STATUS_TEXT.textContent = "Your Video Downloaded Successfully";
    button.textContent = "Downloaded";

    setTimeout(() => {
      button.textContent = originalButtonText;
    }, 3000);
  } catch (error) {
    console.error("Error fetching video info:", error);
    alert("An error occurred while downloading the video.");
    qualityVideosArray.forEach((qualityButton) => {
      qualityButton.disabled = false;
      qualityButton.style.cursor = "pointer";
    });
    STATUS_TEXT.textContent = "Download Failed";
    button.textContent = "Download Failed";
  }
}

async function DownloadAudio(videoUrl, videoTitle, button) {
  const originalButtonText = button.textContent;
  button.textContent = "downloading...";
  button.disabled = true;

  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/DownloadAudio?videoUrl=${videoUrl}&title=${videoTitle}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${videoTitle}.mp3`;
    a.click();
    URL.revokeObjectURL(url);

    STATUS_TEXT.textContent = "Your Audio Downloaded Successfully";
    button.textContent = "Downloaded";
    setTimeout(() => {
      button.textContent = originalButtonText;
      button.disabled = false;
    }, 3000);
  } catch (error) {
    console.error("Error fetching audio info:", error);
    alert("An error occurred while downloading the audio.");
    button.textContent = "Download Failed";
    button.disabled = false;
    STATUS_TEXT.textContent = "Download Failed";
  }
}
