# Xylophone-Land

## About
Xylophone Land is an experiment which features a playable 3D "playskool" style xylophone. To interact, simply click on the different bars of the xylophone. You will then hear the corresponding note and see a blast of color on the floor below it. You can also pan around the scene by clicking and dragging to rotate the scene and scrolling to zoom.

### Technology used
* Nodejs with Webpack[Link] for running the web app
* Babel[Link] for transpiling ES6
* Three.js[Link] for 3D rendering using WebGL
* Tone.js[Link] for creating the audio using the Web Audio API [Link]

### Supported Platforms
* Chrome [insert version] on OSX
* Chrome on Android
* Chrome on iOS [test]

## Installation

### Pre-Requisites:
* NodeJS[insert version] with NPM[insert version]. To install, follow these instructions [insert link].

### Installation and Running the app
* from the root directory, run ```node install``` to install all packages
* run ```nide start``` to start the local server
* In Chrome, navigate to http://localhost:8000[link] to view the running application

## Next Steps:
* Robust mobile testing and optimizations
* Add On-screen instructions
* Make the xylophone bars float and react when hit
* Fade out the xylophone bars after hitting them
* Model the rope and xylophone mallet so that you could use that to hit the bars
* Adjust the mono synth settings to make it sound more like an actual xylophone
* Create an npm "build" routine to generate static files to be hosted
* Limit camera controls so that you can't zoom, pan, or tilt out of specified bounds
* Solve odd shadow issues on the xylophone base

