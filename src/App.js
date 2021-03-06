import React from "react";
import CurrentWeather from "./components/CurrentWeather";
// import data from './data/data.json'
import axios from "axios";
import styled from "styled-components";
import Details from "./components/Details";
import DailyWeather from "./components/DailyWeather/DailyWeather";

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  overflow: hidden;
  video {
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: max-content;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

class App extends React.Component {
  //console.log(process.env.REACT_APP_MY_SECRET_KEY)
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      lat: "",
      lon: "",
      tempUnit: "C",
    };
  }

  changeTemp = async (e) => {
    if (e.target.textContent !== this.state.tempUnit) {
      if (e.target.textContent === "C") {
        try {
          await axios({
            method: "GET",
            baseURL: "https://api.openweathermap.org/data/2.5",
            url: "/onecall",
            params: {
              lat: this.state.lat,
              lon: this.state.lon,
              exclude: "minutely",
              units: "metric",
              appid: process.env.REACT_APP_MY_SECRET_KEY,
            },
          }).then((res) =>
            this.setState({
              data: res.data,
              tempUnit: "C",
            })
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          axios({
            method: "GET",
            baseURL: "https://api.openweathermap.org/data/2.5",
            url: "/onecall",
            params: {
              lat: this.state.lat,
              lon: this.state.lon,
              exclude: "minutely",
              units: "imperial",
              appid: process.env.REACT_APP_MY_SECRET_KEY,
            },
          }).then((res) =>
            this.setState({
              data: res.data,
              tempUnit: "F",
            })
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  saveData = (data, lat, lon) => {
    this.setState({ data: data, lat: lat, lon: lon });
  };

  getPosition = (position) => {
    //get weather data from api
    try {
      axios({
        method: "GET",
        baseURL: "https://api.openweathermap.org/data/2.5",
        url: "/onecall",
        params: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          exclude: "minutely",
          units: "metric",
          appid: process.env.REACT_APP_MY_SECRET_KEY,
        },
      }).then((res) =>
        this.setState({
          data: res.data,
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      );
    } catch (error) {
      console.log(error);
    }
    //temporarily using saved data to avoid extra api calls
    // this.setState({data: data, lat: position.coords.latitude, lon: position.coords.longitude})
  };

  locationDenied = () => {
    let position = { coords: { latitude: 12.9719, longitude: 77.5937 } };
    this.getPosition(position);
  };

  componentDidMount() {
    //Ask for location permission
    //If location access denied show alert to say access required
    navigator.geolocation &&
      navigator.geolocation.getCurrentPosition(
        this.getPosition,
        this.locationDenied
      );
  }

  setVideo = (name) => {
    if (name === "Thunderstorm") {
      return (
        <video autoPlay muted loop>
          <source src="thunderstorm.mp4" type="video/mp4" />
        </video>
      );
    } else if (name === "Drizzle") {
      return (
        <video key={name} autoPlay muted loop>
          <source src="drizzle.mp4" type="video/mp4" />
        </video>
      );
    } else if (name === "Rain") {
      return (
        <video key={name} autoPlay muted loop>
          <source src="rain.mp4" type="video/mp4" />
        </video>
      );
    } else if (name === "Snow") {
      return (
        <video key={name} autoPlay muted loop>
          <source src="snow.mp4" type="video/mp4" />
        </video>
      );
    } else if (name === "Clear") {
      return (
        <video key={name} autoPlay muted loop>
          <source src="clear.mp4" type="video/mp4" />
        </video>
      );
    } else if (name === "Clouds") {
      return (
        <video key={name} autoPlay muted loop>
          <source src="clouds.mp4" type="video/mp4" />
        </video>
      );
    } else {
      return (
        <video key={name} autoPlay muted loop>
          <source src="atmosphere.mp4" type="video/mp4" />
        </video>
      );
    }
  };

  render() {
    // console.log(this.state.tempUnit,'app')
    if (Object.keys(this.state.data).length === 0) {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#311B92",
          }}
        ></div>
      );
    } else {
      return (
        <React.Fragment>
          <VideoContainer>
            {this.setVideo(this.state.data.current.weather[0].main)}
          </VideoContainer>
          <div style={{ justifyContent: "center", display: "flex" }}>
            <CurrentWeather
              tempC={() => {
                this.setState({ tempUnit: "C" });
              }}
              activeUnit={this.state.tempUnit}
              changeTemp={this.changeTemp}
              timeZone={this.state.data.timezone}
              coords={[this.state.lat, this.state.lon]}
              saveData={this.saveData}
              weather={this.state.data.current}
              temps={[
                this.state.data.daily[0].temp.min,
                this.state.data.daily[0].temp.max,
              ]}
            />
            <Details
              tempUnit={this.state.tempUnit}
              timeZone={this.state.data.timezone}
              current={this.state.data.current}
            />
          </div>
          <DailyWeather
            tempUnit={this.state.tempUnit}
            timeZone={this.state.data.timezone}
            hourly={this.state.data.hourly}
            data={this.state.data.daily}
          />
        </React.Fragment>
      );
    }
  }
}
export default App;
