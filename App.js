import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Button } from 'react-native';

export default function MyColorApp() {
  const [backgroundColor, changeBackgroundColor] = useState('#FFFFFF');
  const [hexValue, updateHexValue] = useState('#FFFFFF');
  const [fontColor, setFontColor] = useState('#000000');
  const fadeAnimRef = useRef(new Animated.Value(1)).current;

  const isValidHex = (hex) => /^#[0-9A-F]{6}$/i.test(hex);

  const pickRandomColor = () => {
    let randomHex;
    do {
      randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    } while (!isValidHex(randomHex));

    changeBackgroundColor(randomHex);
    updateHexValue(randomHex);
    setFontColor(deriveContrastingColor(randomHex));
    triggerFadeIn();
  };

  const revertToDefaultColor = () => {
    changeBackgroundColor('#FFFFFF');
    updateHexValue('#FFFFFF');
    setFontColor('#000000');
  };

  const deriveContrastingColor = (hex) => {
    const red = parseInt(hex.slice(1, 3), 16);
    const green = parseInt(hex.slice(3, 5), 16);
    const blue = parseInt(hex.slice(5, 7), 16);
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
    return brightness > 130 ? '#000000' : '#FFFFFF';
  };

  const triggerFadeIn = () => {
    fadeAnimRef.setValue(0);
    Animated.timing(fadeAnimRef, {
      toValue: 1,
      duration: 850,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { backgroundColor: backgroundColor, opacity: fadeAnimRef }]}>
      <TouchableOpacity style={styles.clickableArea} onPress={pickRandomColor}>
        <Text style={[styles.greeting, { color: fontColor }]}>Welcome!</Text>
        <Text style={[styles.colorDisplay, { color: fontColor }]}>Hex: {hexValue}</Text>
        <View style={styles.buttonWrapper}>
          <Button title="Reset" onPress={revertToDefaultColor} color="green" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  clickableArea: {
    alignItems: 'center',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '600',
  },
  colorDisplay: {
    marginTop: 18,
    fontSize: 18,
  },
  buttonWrapper: {
    marginTop: 12,
  },
});
