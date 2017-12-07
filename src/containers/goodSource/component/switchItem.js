import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Switch,
    Text,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentItemView: {
        flexDirection: 'row',
        height: 44,
        backgroundColor: '#FFF',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between',
    },
    contentItemText: {
        fontSize: 16,
        color: '#333333',
    },
    separateLine: {
        height: 1,
        backgroundColor: '#e8e8e8',
        marginLeft: 20,
    },
});

class switchItem extends Component {
    static propTypes = {
        style: PropTypes.object,
    };

    componentDidMount() {

    }

    render() {
        const {itemTitle, onValueChange} = this.props;
        return (
            <View>
                <View style={styles.contentItemView}>
                    <Text style={styles.contentItemText}>
                        {itemTitle}
                    </Text>
                    <Switch
                        onTintColor={'#0083FF'}
                        onValueChange={(value) => {
                            onValueChange(value);
                        }}
                        style={{marginBottom: 10, marginTop: 10}}
                        value={this.props.defaultValue}
                    />
                </View>
                <View style={styles.separateLine} />
            </View>
        );
    }
}

export default switchItem;
