import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


import './App.css';

const { REACT_APP_SMART_BRAIN_API } = process.env;

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  },
};
const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 600,
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then(console.log);
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = data => {
    const clarifaFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const face = data.outputs[0].data.regions[0].data.concepts[0];
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaFace.left_col * width,
      topRow: clarifaFace.top_row * height,
      rightCol: width - clarifaFace.right_col * width,
      bottomRow: height - clarifaFace.bottom_row * height,
      faceName:
        Math.floor(face.value * 100) > 60
          ? `${face.name} ${Math.floor(face.value * 100)}% reliability`
          : 'no celebrity person found',
    };
  };

  displayFaceBox = box => {
    this.setState({ box: box });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then(res => res.json())
            .then(e =>
              this.setState(Object.assign(this.state.user, { entries: e }))
            )
            .catch(err => console.log(err));
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
  };

  onRouteChange = route => {
    if (route === 'signout') {
      this.setState(Object.assign(this.state, initialState));
    } else if (route === 'home') {
      this.setState({ isSignedIn: true, route: route });
    } else {
      this.setState({ route: route });
    }
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    console.log(REACT_APP_SMART_BRAIN_API);
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onPictureSubmit={this.onPictureSubmit}
              />

              <FaceRecognition imageUrl={imageUrl} box={box} />
            </div>
          : route === 'signin'
            ? <Signin
                onRouteChange={this.onRouteChange}
                loadUser={this.loadUser}
              />
            : <Register
                onRouteChange={this.onRouteChange}
                loadUser={this.loadUser}
              />}
      </div>
    );
  }
}

export default App;
