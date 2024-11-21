// const url =
//   "http://localhost:5000/api/downloadVideo?videoUrl=https://youtu.be/f2EqECiTBL8?si=4-2dbtBAm718PCQf&title=sdsadsa.mp4&resolution=360";

// fetch(url)
//   .then((response) => {
//     const reader = response.body.getReader();
//     const decoder = new TextDecoder();
//     let progress = "";

//     function processText({ done, value }) {
//       if (done) {
//         console.log("Download complete");
//         return;
//       }

//       // Decode the chunk and append it to progress
//       progress += decoder.decode(value, { stream: true });

//       // Log the progress
//       console.log("Progress chunk:", progress);

//       // Continue reading the next chunk
//       return reader.read().then(processText);
//     }

//     // Start reading the stream
//     return reader.read().then(processText);
//   })
//   .catch((error) => {
//     console.error("Error fetching data:", error);
//   });
