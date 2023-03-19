// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";
import imagething from "./images/wp10650609.jpg";
import recycling from "./images/recycling.png"
import forest from "./images/forest.png"

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const prompts = [
  ["how does this ", " impact climate change?"],
  [
    "give me an interesting fact about a ",
    " that relates to climate change. Start the response by saying An interesting fact about",
  ],
  [
    "how can I help climate change using a",
    "? Start the response by saying You can help climate change using a",
  ],
  ["how can a", " be sustainable? Start the response by saying A..."],
];

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [classArray, setClassArray] = useState([]);
  const [object, setObject] = useState("");
  const [stuff, setStuff] = useState(
    "I am the description box! Point your camera at an object and click the button below to find out more info on how that object is related to climate change!"
  );

  async function runCompletion(object) {
    setStuff("object = " + object + ". Loading...");
    let promptNum = Math.floor(Math.random() * prompts.length);
    let string =
      prompts[promptNum][0] +
      object +
      prompts[promptNum][1] +
      " Limit this response to under 50 words";
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: string,
      max_tokens: 100,
    });
    setStuff(object + ": " + completion.data.choices[0].text);
  }

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const handleClick = (className) => {
    // setObject(className)
    runCompletion(className);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);
      console.log(obj);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      // Apply horizontal flip to the context
      ctx.translate(videoWidth, 0);
      ctx.scale(-1, 1);
      drawRect(obj, ctx, "", videoWidth);

      setClassArray([...new Set(obj.map((obj) => obj.class))].sort());
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header1">
          <div class="gradient"></div>
          <img src={imagething} alt="" class="background" />
          <nav>
            <div class="nav-bar">
              <ul>
                <li>
                  <a href="">About</a>
                </li>
                <li>
                  <a href="">Purpose</a>
                </li>
                <li>
                  <a href="#header2">Our Application</a>
                </li>
              </ul>
            </div>
          </nav>
          <div class="bigTitle">
            <div class="title1">ClimateSnap</div>
            <a class="" href="#header2">
              <button class="toApplication">Try it Out</button>
            </a>
          </div>
        </div>
        <section className="purpose"></section>
        <section className="header2" id="header2">
          <div className="fullCamera">
            <div className="titleCamera">ClimateSnap Camera</div>
            <div className="description">
              <p>{stuff}</p>
            </div>
            <div className="webcamCanvas">
              <Webcam
                ref={webcamRef}
                muted={true}
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zindex: 9,
                  width: 500,
                  height: 400,
                  transform: "scaleX(-1)",
                }}
              />
              <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zindex: 7,
                  width: 500,
                  height: 400,
                  transform: "scaleX(-1)",
                }}
              />
            </div>
            <div className="button-container">
              {classArray.map((className) => (
                // <Button onClick={() => handleClick(className)} key={className} className={className}/>
                <button onClick={() => handleClick(className)}>
                  {className}
                </button>
              ))}
            </div>
            <img src={forest} className="forest"/>
            <img src={recycling} className="recycling"/>
          </div>
        </section>
      </header>
    </div>
  );
}

export default App;
