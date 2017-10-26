/**
 * database tools class
 */
import React from 'react';
import {
    Image,
    StyleSheet,
} from 'react-native';

import StaticImage from '../constants/staticImage';

const styles = StyleSheet.create({
    goodKindIconStyle: {
        height: 60,
        width: 60,
    }
});

class goodKindUtil {

    show(goodKindName) {
        switch (goodKindName) {
            case '畜禽类':
                return <Image style={styles.goodKindIconStyle} source={StaticImage.Livestock}/>;
                break;
            case '速冻面点':
                return <Image style={styles.goodKindIconStyle} source={StaticImage.FrozenPastry}/>;
                break;
            case '乳制品':
                return <Image style={styles.goodKindIconStyle} source={StaticImage.Dairy}/>;
                break;
            case '农产品':
                return <Image style={styles.goodKindIconStyle} source={StaticImage.AgricultureProduct}/>;
                break;
            case '水产品':
                return <Image style={styles.goodKindIconStyle} source={StaticImage.AquaticProduct}/>;
                break;
            default:
                return <Image style={styles.goodKindIconStyle} source={StaticImage.OtherKind}/>;
                break;
        }
    }


}

const instance = new goodKindUtil();

export default instance;
