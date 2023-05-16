import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";
import Welcome from './component/Welcome'
import video from "./component/video.mp4";

// app.js test
test("renders the landing page", () => {
  render(<App />);
});

//Welcome Component test
describe("Welcome component", () => {
  test("renders without error", () => {
    render(<Welcome />);

    // Select the video element using getByTestId
    const videoElement = screen.getByTestId("welcome-video");
    expect(videoElement).toBeInTheDocument();
  });
});
// npm install --save-dev @testing-library/jest-dom
