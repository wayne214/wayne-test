import {StyleSheet, Platform} from 'react-native';

function create(styles) {
    const platformStyles = {};
    Object.keys(styles).forEach((name) => {
        const {ios, android, ...style} = styles[name];
        let xeStyle = style;
        if (ios && Platform.OS === 'ios') {
            xeStyle = {...style, ...ios};
        }
        if (android && Platform.OS === 'android') {
            xeStyle = {...style, ...android};
        }
        platformStyles[name] = xeStyle;
    });
    const result = StyleSheet.create(platformStyles);
    return result;
}

export default {
    ...StyleSheet,
    create,
};
