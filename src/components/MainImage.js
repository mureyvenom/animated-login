import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView, LogBox, TextInput } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler'

LogBox.ignoreLogs(['Your project is accessing the following APIs from a deprecated global rather than a module import: Constants (expo-constants).']);

const {width, height} = Dimensions.get('window');
const {
    Value,
    event,
    block,
    cond,
    eq,
    set,
    Clock,
    startClock,
    stopClock,
    debug,
    timing,
    clockRunning,
    interpolate,
    Extrapolate,
    concat
  } = Animated;

function runTiming(clock, value, dest) {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0)
    };
  
    const config = {
      duration: 1000,
      toValue: new Value(0),
      easing: Easing.inOut(Easing.ease)
    };
  
    return block([
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]),
      timing(clock, state, config),
      cond(state.finished, debug('stop clock', stopClock(clock))),
      state.position
    ]);
  }

let buttonOpacity = new Value(1);

const onStateChange = event([
    {
        nativeEvent: ({state})=>block([
            cond(eq(state, State.END), set(buttonOpacity, runTiming(new Clock(), 1, 0)))
        ])
    }
]);

const onCloseState = event([
    {
        nativeEvent: ({state})=>block([
            cond(eq(state, State.END), set(buttonOpacity, runTiming(new Clock(), 0, 1)))
        ])
    }
]);

let buttonY = interpolate(buttonOpacity, {
    inputRange: [0,1],
    outputRange: [100,0]
});

let bgY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [-height/3, 0],
    extrapolate: Extrapolate.CLAMP
})

let textInputZindex = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, -1],
    extrapolate: Extrapolate.CLAMP
})

let textInputY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [-0, 100],
    extrapolate: Extrapolate.CLAMP
})

let textInputOpacity = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP
})

let rotateCross = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [180, 360],
    extrapolate: Extrapolate.CLAMP
})

const MainImage = () => {    

    return(
        <View style={styles.container}>
            <Animated.View style={{
                ...styles.imageContainer,
                transform: [{
                    translateY: bgY
                }]
                }}>
                <Image 
                source={require('../../assets/bg.jpg')} 
                style={styles.image}
                />
            </Animated.View>
            <View style={styles.flowView}>
                <TapGestureHandler
                onHandlerStateChange={onStateChange}
                >
                    <Animated.View style={{
                        ...styles.button, 
                        opacity: buttonOpacity,
                        transform: [{translateY: buttonY}]
                        }}>
                        <Text style={styles.buttonText}>SIGN IN</Text>
                    </Animated.View>
                </TapGestureHandler>
                <Animated.View style={{
                    ...styles.button, 
                    backgroundColor: '#2E71DC',
                    opacity: buttonOpacity,
                    transform: [{translateY: buttonY}]
                    }}>
                    <Text style={{...styles.buttonText, color: '#fff'}}>SIGN IN WITH FACEBOOK</Text>
                </Animated.View>
                <Animated.View
                style={{
                    ...styles.logComponent,                    
                    zIndex: textInputZindex,
                    opacity: textInputOpacity,
                    transform: [{
                        translateY: textInputY
                    }]
                }}
                >
                    <TapGestureHandler
                    onHandlerStateChange={onCloseState}
                    >
                        <Animated.View
                        style={styles.closeBtn}
                        >
                            <Animated.Text style={{
                                fontSize:15,
                                transform: [{
                                    rotate: concat(rotateCross, 'deg')
                                }]
                                }}>
                                X
                            </Animated.Text>
                        </Animated.View>
                    </TapGestureHandler>
                    <TextInput 
                    placeholder='Email'
                    autoCorrect={false}
                    autoCapitalize='none'
                    style={styles.textInput}
                    placeholderTextColor='#000'
                    />
                    <TextInput 
                    placeholder='Password'
                    autoCorrect={false}
                    autoCapitalize='none'
                    style={styles.textInput}
                    placeholderTextColor='#000'
                    />
                    <Animated.View
                    style={{
                        ...styles.button,                      
                        shadowOffset: {height: 3, width: 2},
                        shadowColor: '#000',
                        shadowOpacity: 0.2,
                        elevation: 4
                    }}
                    >
                        <Text style={{
                            ...styles.buttonText
                            }}>SIGN IN</Text>
                    </Animated.View>
                </Animated.View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-end'
    },
    imageContainer: {
        ...StyleSheet.absoluteFill
    },
    image: {
        flex: 1,
        height: null,
        width: null
    },
    flowView: {
        height: height/3,
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#fff',
        height: 60,
        marginHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginBottom: 20
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    logComponent: {
        height: height/3,
        ...StyleSheet.absoluteFill,
        top: null,
        justifyContent: 'center'
    },
    textInput: {
        height: 50,
        borderRadius: 25,
        marginHorizontal: 25,
        marginBottom: 15,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderColor: '#ccc'
    },
    closeBtn: {
        height: 40,
        width: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -40,
        left: width/2 -20,
        elevation: 5
    }
})

export default MainImage