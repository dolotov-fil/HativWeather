import React from "react";
import { Text, View, Image, Dimensions, StyleSheet } from "react-native";
import * as Location from "expo-location";
import Loading from "./Loading";
import axios from "axios";

const API_KEY = "08ccfa21c7c83b826d799a5ee71aacf9";
const GEOCODER_API_KEY = "2e0085c66b5b48ef879e67fb9ec0e8e5";
const { width, height } = Dimensions.get("window");

export default class Main extends React.Component {
  state = {
    location: null,
    errorMessage: null,
    weatherData: null,
    city: null,
  };

  componentDidMount() {
    this.getLocation();
  }

  getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        this.setState({
          errorMessage: "Permission to access location was denied",
        });
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      this.setState({ location: { latitude, longitude } }, () => {
        this.getWeather(latitude, longitude);
        this.getCityName(latitude, longitude);
      });
    } catch (error) {
      console.log(error);
    }
  };

  getWeather = async (latitude, longitude) => {
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&unist=metric`
      );
      console.log(data);
      this.setState({ weatherData: data });
    } catch (error) {
      console.log(error);
    }
  };

  getCityName = async (latitude, longitude) => {
    try {
      const { data } = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${GEOCODER_API_KEY}`
      );
      const city = data.results[0].components.city;
      this.setState({ city });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { location, errorMessage, weatherData, city } = this.state;

    if (errorMessage) {
      return (
        <View style={{ backgroundColor: "#FDF6AA", flex: 1 }}>
          <Text>{errorMessage}</Text>
        </View>
      );
    } else if (!location || !weatherData) {
      return (
        <View style={{ flex: 1 }}>
          <Loading />
        </View>
      );
    } else {
      const { main, description } = weatherData.weather[0];
      const { temp, feels_like, humidity } = weatherData.main;

      return (
        <View style={{ flex: 1 }}>
          <Image
            source={require("../img/main.jpg")}
            style={{ width: width, height: height, flex: 1, opacity: 0.7 }}
            resizeMode="cover"
          />
          <View style={styles.textContainer}>
            <Text style={{fontSize: 15,marginTop: 30, marginRight: 220,  color: '#BFE399', }}>Широта: {location.latitude}</Text>
            <Text style={{fontSize: 15,marginTop: 5, marginRight: 217, color: '#BFE399',  }}>
              Долгота: {location.longitude}
            </Text>
            <Text style={{fontSize: 25,marginRight: 270, marginTop: 50, fontWeight: 'bold', color:'#01131E', backgroundColor: '#BFE399'}}>Город</Text>
            <Text style={styles.cityValueText}>{city}</Text>
            <Text style={styles.smallText}>Описание</Text>
            <Text style={styles.cityValueText}>{description}</Text>
            <Text style={styles.smallText}>Температура</Text>
            <Text style={styles.cityValueText}>{temp}°C</Text>
            <Text style={styles.smallText}>Чувствоется</Text>
            <Text style={styles.cityValueText}>{feels_like}°C</Text>
            <Text style={styles.smallText}>Влажность</Text>
            <Text style={styles.cityValueText}>{humidity}%</Text>
          </View>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  textContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    
    alignItems: "center",
  },
  smallText: {
    fontSize: 19,marginRight: 270, marginTop: 10, fontWeight: 'bold', color:'#01131E', backgroundColor: '#BFE399'
  },
  cityValueText: {
    fontSize: 15,marginRight: 270, marginTop: 10, fontWeight: 'bold', color:'#01131E', backgroundColor: '#FF9620'
  },
});
