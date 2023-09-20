import logo from './logo.svg';
import './App.css';
import {
  GestureRecognizer,
  FilesetResolver
} from '@mediapipe/tasks-vision'
import Webcam from "react-webcam";
import { useEffect, useState, useRef, useCallback } from 'react';

let gestureRecognizer = null
let runningMode = "IMAGE";
const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "asset/models/gesture_recognizer (8).task"
    },
    runningMode: runningMode
  });
};

createGestureRecognizer();
function App() {
  const [imgSrc, setImgSrc] = useState(null);
  const [result, setResult] = useState(null);
  const [select, setSelect] = useState("");
  const webcamRef = useRef(null);
  const timeoutIntervalRef = useRef(null);

  timeoutIntervalRef.current = setInterval(() => {
    if (webcamRef.current) {

      var newCanvas = document.createElement('canvas');
      var context = newCanvas.getContext('2d');
      newCanvas.width = webcamRef.current.getCanvas().width;
      newCanvas.height = webcamRef.current.getCanvas().height;
      context.drawImage(webcamRef.current.getCanvas(), 0, 0);

      setImgSrc(newCanvas);
    }
  }, 1000);


  useEffect(() => {
    if (imgSrc) {
      //console.log(imgSrc)
      var results = gestureRecognizer.recognize(imgSrc);
      setResult(results)
    }
  }, [imgSrc])

  useEffect(() => {
    if (result) {
      if (result.gestures.length > 0) {
        if (result.gestures[0][0].categoryName == "1" || result.gestures[0][0].categoryName == "1_1") {
          setSelect("you have selected one")
        } else if (result.gestures[0][0].categoryName == "2" || result.gestures[0][0].categoryName == "2_1" || result.gestures[0][0].categoryName == "2_2" || result.gestures[0][0].categoryName == "2_3") {
          setSelect("you have selected two")
        }
      }
    }

  }, [result])

  //setResult(gestureRecognizer.recognize(image));
  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <Webcam height={600} ref={webcamRef} />
        </div>
        <button onClick={() => { setSelect("you have selected one") }}>One</button>
        <button onClick={() => { setSelect("you have selected two") }}>Two</button>
        <p>{select}</p>
        <p>{(result) ? ((result.gestures.length > 0 && result.gestures[0][0].score > 0.8) ? result.gestures[0][0].categoryName : "None") : "None"}</p>

      </header>
    </div>
  );
}

export default App;
