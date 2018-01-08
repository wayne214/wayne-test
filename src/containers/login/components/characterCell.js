import React, {Component, PropTypes} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
} from 'react-native';
import StaticImage from '../../../constants/staticImage';

const {width, height} = Dimensions.get('window');

class CharacterCell extends Component {
    static propTypes = {
        textAbout: PropTypes.string,
        onClick: PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {
            textAbout,
            imageAbout,
            onClick,
        } = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
		        onClick();
            }}>
                <View
                    style={{
                        backgroundColor:'#FFFFFF',
                        marginLeft: 10,
                        marginRight:10,
                        marginTop:10,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        style={{width: width / 2, height: 100}}
                        resizeMode={'center'}
                        source={imageAbout}
                    />
                    <Text style={{marginLeft: width / 8, fontSize: 20}}>
                        {textAbout}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export default CharacterCell;
