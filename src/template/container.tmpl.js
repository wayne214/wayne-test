import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
	View,
	Text,
	StyleSheet
} from 'react-native';

class ClassName extends Component {
	constructor(props) {
	  super(props);
	}
	componentDidMount() {

	}
	render() {
		return <View style={styles.container}>
			<Text>pull to back</Text>
		</View>
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'orange'
	},
});

function mapStateToProps(state){
	return {};
}

function mapDispatchToProps (dispatch){
	return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassName);

