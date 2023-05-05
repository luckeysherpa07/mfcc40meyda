import meyda from "meyda";
import * as tf from "@tensorflow/tfjs";
import * as sk from "scikitjs";
import { LabelEncoder } from "scikitjs";

sk.setBackend(tf);

let labels = ["Am", "Bb", "Bdim", "C", "Dm", "Em", "F", "G"];
const labelEncoder = new LabelEncoder();

async function load_model() {
  let m = await tf.loadLayersModel(
    "https://tmpfiles.org/dl/1380744/model.json"
  );
  console.log("MODEL MODEL MODEL", m);
  return m;
}

let model = load_model();

const song = document.querySelector("audio");
const context = new window.AudioContext();

// song.addEventListener("play", () => {
//   context.resume();
// });

// const source = context.createMediaElementSource(song);
// const gainNode = context.createGain();
// source.connect(gainNode);
// gainNode.connect(context.destination);
// gainNode.gain.value = 1;

// const options = {
//   audioContext: context, // required
//   source: source, // required
//   bufferSize: 512, // required
//   hopSize: 256, // optional
//   numberOfMFCCCoefficients: 40
//   // callback: getFeature // optional callback in which to receive the features for each buffer
// };

// const analyser = meyda.createMeydaAnalyzer(options);

// const featuresToGet = ["mfcc"];

// function loop(delta) {
//   requestAnimationFrame(loop);

//   // try/catch for codesandbox - things get bad if an error happens in a loop
//   try {
//     const features = analyser.get(featuresToGet);
//     // debugger;
//     console.log("THis is value", features);
//   } catch (e) {}
// }

// requestAnimationFrame(loop);

if (navigator.mediaDevices) {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const source = context.createMediaStreamSource(stream);
      const gainNode = context.createGain();
      source.connect(gainNode);
      gainNode.connect(context.destination);
      gainNode.gain.value = 1;
      // `microphone` can now act like any other AudioNode

      const options = {
        audioContext: context, // required
        source: source, // required
        bufferSize: 512, // required
        hopSize: 256, // optional
        numberOfMFCCCoefficients: 40
        // callback: getFeature // optional callback in which to receive the features for each buffer
      };

      const analyser = meyda.createMeydaAnalyzer(options);

      const featuresToGet = ["mfcc"];

      function loop(delta) {
        requestAnimationFrame(loop);

        // try/catch for codesandbox - things get bad if an error happens in a loop
        try {
          const features = analyser.get(featuresToGet);
          // debugger;
          console.log("THis is value", features.mfcc);

          model.then(function (res) {
            console.log(features.mfcc);
            // const result = res.predict(tf.tensor([features.mfcc]));
            // const prediction = result.arraySync()[0];
            // const predictedLabel = Math.max(...prediction);
            // const maxIndex = prediction.indexOf(predictedLabel);
            // console.log(maxIndex);
            // console.log(labels[maxIndex]);
            // console.log("=========");
          });

          // beatDetektor.process(delta / 1000.0, features.complexSpectrum.real);
          // beatDetektorKick.process(beatDetektor);
          // const kick = beatDetektorKick.isKick();
          // const bpm = beatDetektor.win_bpm_int_lo;

          // bpmTitle.textContent = `BPM: ${bpm}`;
          // kickTitle.textContent = `Kick: ${kick ? "kick" : ""}`;
        } catch (e) {}
      }

      requestAnimationFrame(loop);
    })
    .catch((err) => {
      // browser unable to access microphone
      // (check to see if microphone is attached)
    });
} else {
  // browser unable to access media devices
  // (update your browser)
}
