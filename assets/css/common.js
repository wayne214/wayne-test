import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5'
	},
	line: {
		width,
		height: 0.5,
		backgroundColor: '#d9d9d9'
	},
	iconFont: {
		fontFamily: 'iconfont',
	},
});