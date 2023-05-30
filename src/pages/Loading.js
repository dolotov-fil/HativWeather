import React from "react";
import { View, Image, StyleSheet, Dimensions, ActivityIndicator, Text } from "react-native";

const { width, height } = Dimensions.get("window");

function Loading() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../img/logo.jpg")}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Загрузка погоды...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width,
    height: height,
    opacity: 0.7,
  },
  loadingContainer: {
    position: "absolute",
    top: height / 2,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 10,
  },
});

export default Loading;