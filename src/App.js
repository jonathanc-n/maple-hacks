// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";
import imagething from "./images/wp10650609.jpg";
import recycling from "./images/recycling.png";
import forest from "./images/forest.png";
import globe from "./images/globe.png";
import logo from "./images/climatesnap.svg";
import runner from "./images/runner.png"
import TextToSpeech from "./components/tts";

const prompts = [
  ["how much carbon dioxide does a ", " or the production of it emit?"],
  ["how will a ", "be affected by climate change in the future?"],
];

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [classArray, setClassArray] = useState([]);
  const [object, setObject] = useState("");
  const [response, setResponse] = useState(
    "Point your camera at an object and click the button below to find out more info on how that object is related to climate change!"
  );

  async function runCompletion(object) {
    setResponse("object = " + object + ". Loading...");
    let promptNum = Math.floor(Math.random() * prompts.length);
    let string =
      prompts[promptNum][0] +
      object +
      prompts[promptNum][1] +
      " Limit this response to under 50 words";
    //string = "are you chatGPT?"
    fetch("http://localhost:3001", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ string }),
    })
      .then((res) => res.json())
      .then((data) => setResponse(data.message));

    //setStuff(object + ": " + completion.data.choices[0].text);
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
    setObject(className)
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
      //console.log(obj);

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
      <div class="hero">
        <nav>
          <div class="nav-bar">
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#purpose">Purpose</a>
              </li>
              <li>
                <a href="#process">Process</a>
              </li>
              <li>
                <a href="#header2">Our Application</a>
              </li>
            </ul>
          </div>
        </nav>

        <div class="bigTitle">
          <div>
            <img src={logo} className="logo" />
            <p className="hero-text">
              We all know that the climate is changing, but we don’t realize how it relates to everyday items. That’s why we made ClimateSnap: bringing you the stats in a snap!
            </p>
            <a class="" href="#header2">
              <button class="toApplication">TRY IT OUT</button>
            </a>
          </div>
          <div className="globe-box">
            <img src={globe} />
          </div>
        </div>
      </div>

      <section className="purpose" id="purpose">
        <div>
          <h3>Purpose</h3>
          <p className="purpose-text">
          If we’re being honest, we really don’t know the climate impacts the objects we see daily cause. For example, what do we know about the CO2 footprint of bottled water? Well… based on the most cited research it's about 0.5 lbs (200 g) per 50 ounces (1.5 liters) bottle which means that 800 bottles per year consumed by the average bottle-drinking household is equal to 350 lbs (160 kg) CO2 or the equivalent of driving 368 miles (592 km) with a car.
          </p>
          <p> </p>
          <p>
          Who would’ve thought something so minor and insignificant in our lives could create such a significant impact on climate change? Thus, we created ClimateSnap to bring you these stats with just one click!
          </p>
        </div>
        <img src={runner} className="globe" />
      </section>

      <section id="process">
          <div className="process">
            <h3>Process</h3>
            <div>
              <p className="purpose-text">1. Implemented react-webcam integrated with a tensorflow coco-ssd object-detection model</p>
              <p className="purpose-text">2. Integrated Chat GPT's API to generate prompts based on the object selected</p>
              <p className="purpose-text">3. Styled the app and website for the best user experience</p>
            </div>
        </div>
      </section>

      <section className="header2" id="header2">
        <div className="headerPictures">
          <div className=" split">
            <img src={recycling} className="recycling" />
          </div>
          <div class="split">
            <img src={forest} className="forest" />
          </div>
        </div>
        <div className="fullCamera">
          <div className="titleCamera">ClimateSnap Camera</div>
          <div className="description">
            <h4>{object.toUpperCase()}</h4>
            <p>{response}</p>
          </div>
          <div>
            <TextToSpeech text={response} />
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
        </div>
      </section>
    </div>
  );
}

export default App;
