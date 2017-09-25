/**
 * Created by wangl on 2017/6/28.
 * 用户协议界面
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
} from 'react-native';

import NavigationBar from '../../common/navigationBar/navigationBar';
import * as StaticColor from '../../constants/staticColor';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    textStyle: {
        marginLeft: 10,
        marginRight: 10,
        lineHeight: 20,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR
    },
    textBlackStyle: {
        marginLeft: 10,
        marginRight: 10,
        lineHeight: 20,
        fontWeight: 'bold'
    }
});

export default class Protocol extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'鲜易通用户协议'}
                    navigator={navigator}
                    leftButtonHidden={false}
                />
                <ScrollView>
                    <View style={{marginTop: 10}}/>
                    <Text style={styles.textStyle}>
                        版本生效日期：2017年7月
                    </Text>
                    <Text style={styles.textStyle}>
                        欢迎您使用
                        “鲜易通”。本协议是“鲜易通”所有者（即河南鲜易供应链有限公司，以下简称“鲜易供应链”）与使用鲜易通服务的您之间就服务事宜所订立之协议。请您在点击“立即注册”按钮前，详细阅读并充分理解本协议的所有内容，本协议内容中以加粗、下划线方式显著标识的文字，请您着重阅读、慎重考虑，一旦点击“立即注册”按钮，并按照注册页面提示填写信息完成全部注册程序后，即表示您接受本协议的全部内容，以及本协议有效期内各项条款的更新。如您因平台服务与鲜易供应链发生争议的，适用《鲜易供应链服务协议》处理。如您在使用平台服务过程中与其他用户发生争议的，依您与其他用户达成的协议处理。
                    </Text>
                    <Text style={styles.textStyle}>
                        阅读协议的过程中，如果您不同意相关协议或其中任何条款约定，您应立即停止注册程序。
                    </Text>

                    <Text style={styles.textBlackStyle}>
                        1. 鲜易通地位
                    </Text>
                    <Text style={styles.textStyle}>
                        1.1
                        鲜易通是河南鲜易供应链有限公司创建的互联网货运信息服务和管理平台，旨在为全国货运当事人提供智能化的信息发布和缔约渠道。通过鲜易通，您可以获取货运需求信息、参与报价、对货主进行评价、选择增值服务以及其他信息服务和技术服务。
                    </Text>
                    <Text style={styles.textStyle}>
                        1.2
                        特别提醒您：在鲜易通上注册并不意味着您成为鲜易供应链的雇员、代理人或合作者，亦不意味着您的车辆挂靠于鲜易供应链，您只是鲜易供应链的第三方用户。鲜易供应链不涉及货主、您、鲜易供应链授权使用方或其他组织之间因货物运输而产生的法律关系及法律纠纷。
                    </Text>
                    <Text style={styles.textStyle}>
                        1.3
                        线路运输任务和鲜易通文件中所采用的“工作”、“岗位”、“上岗”、“服务”、“鲜易供应链体系内司机”等用语，仅具有商业意义，不能被视为货主与鲜易供应链、鲜易供应链与您之间存在劳动、雇佣、代理、挂靠等关系。
                    </Text>
                    <Text style={styles.textStyle}>
                        1.4 鲜易通在适当的时候将会为您提供“车辆交易”、“车辆出租”、“车辆维修”、“车险”等增值服务，帮助您提高工作效率和抗风险能力。
                    </Text>
                    <Text style={styles.textBlackStyle}>
                        2. 账号注册及使用
                    </Text>
                    <Text style={styles.textStyle}>
                        2.1
                        您确认，在您开始注册程序使用鲜易通服务前，您应当具备中华人民共和国法律规定的与您行为相适应的民事行为能力。若您不具备前述与您行为相适应的民事行为能力，则您及您的监护人应依照法律规定承担因此而导致的一切后果。
                    </Text>
                    <Text style={styles.textStyle}>
                        2.2
                        由于您的鲜易通账户关联您的个人信息及商业信息，您的鲜易通账户仅限您本人使用。未经鲜易供应链同意，您直接或间接授权第三方使用您鲜易通账户或获取您账户项下信息的行为无效。如鲜易供应链判断您鲜易通账户的使用可能危及您的账户安全及/或鲜易通信息安全的，鲜易供应链可拒绝提供相应服务或终止本协议。

                    </Text>
                    <Text style={styles.textStyle}>
                        2.3 您的账户不得以任何方式转让，否则鲜易供应链有权追究您的违约责任，且由此产生的一切责任均由您承担。

                    </Text>
                    <Text style={styles.textStyle}>
                        2.4
                        在使用鲜易通服务时，您应当按鲜易通页面的提示准确完整地提供您的信息（包括您的姓名及联系电话、身份证信息、车辆信息、驾驶证信息、银行账户信息等），并在资料信息变更时及时更新，以便鲜易通或其他用户与您联系。您了解并同意，您有义务保持您提供信息的真实性及有效性。
                    </Text>
                    <Text style={styles.textStyle}>
                        2.5
                        您的账户为您自行设置并由您保管，鲜易通任何时候均不会主动要求您提供您的账户密码。账户因您主动泄露或因您遭受他人攻击、诈骗等行为导致的损失及后果，鲜易通不承担责任，您应通过司法、行政等救济途径向侵权行为人追偿。

                    </Text>
                    <Text style={styles.textStyle}>
                        2.6 您应对您账户项下的所有行为结果（包括但不限于报价、在线签署各类协议、购买鲜易通提供的商品及服务、披露信息等）负责。
                    </Text>
                    <Text style={styles.textStyle}>
                        2.7
                        如发现任何未经授权使用您账户登录鲜易通或其他可能导致您账户遭窃、遗失的情况，建议您立即通知鲜易供应链。您理解鲜易供应链对您的任何请求采取行动均需要合理时间，且鲜易供应链应您请求而采取的行动可能无法避免或阻止侵害后果的形成或扩大，除鲜易供应链存在法定过错外，鲜易供应链不承担责任。

                    </Text>
                    <Text style={styles.textBlackStyle}>
                        3. 服务流程

                    </Text>
                    <Text style={styles.textStyle}>
                        3.1鲜易通发布货运需求信息后，您即可通过鲜易通进行查看，并自主进行报价。在规定的报价截止时间前，您可以视情况更改报价内容；或平台以派单形式派发给司机，司机可做接单或拒绝操作。

                    </Text>
                    <Text style={styles.textStyle}>
                        3.2一旦中标或接受运输安排，您应当按要求准时到达提货点取走货物。

                    </Text>
                    <Text style={styles.textStyle}>
                        3.3 配送完成并平台审核无误，鲜易供应链将运费支付到您在鲜易通账户的钱包中，运费的具体金额根据平台的报价同时司机同意、司机报价同时平台同意为准。

                    </Text>
                    <Text style={styles.textStyle}>
                        3.4
                        您可随时将钱包中的可提金额提取到您的银行卡上，鲜易通授权使用方或其他合作方根据届时的手续费政策收取相应的手续费，提现后银行卡实际到账时间为1-3个工作日左右。您应确保提供的收款账户真实准确，如因您的过错导致付款迟延或付款错误的，由您本人承担责任。

                    </Text>
                    <Text style={styles.textBlackStyle}>
                        4. 诚信服务

                    </Text>
                    <Text style={styles.textStyle}>
                        4.1 为维护鲜易通的秩序，督促您诚信运输，鲜易通授权使用方或其他合作方可以自主决定对您采取培训、监督、考核、奖惩、统一司机和车辆标识等措施。

                    </Text>
                    <Text style={styles.textStyle}>
                        4.2 您应确保在注册时提供真实的身份证、驾驶证、车辆行驶证等信息，并确保您车辆的车辆营运证、道路运输经营许可证等手续合法有效。如提供虚假证件造成鲜易供应链或相关方损失，您应予承担赔偿责任。

                    </Text>
                    <Text style={styles.textStyle}>
                        4.3
                        如标书中要求代收货款或代收运费的，您应当按照鲜易供应链的要求及时将代收货款或代收运费收回并在规定期限内返还给鲜易供应链。为维护鲜易供应链的信誉，如果您未及时将代收货款或代收运费返还给鲜易供应链有权向您追偿。您同意并认可鲜易供应链授权使用方或其他合作方的该行为，且保证在被追偿时，积极履行偿还义务。

                    </Text>
                    <Text style={styles.textBlackStyle}>
                        5. 安全配送义务

                    </Text>
                    <Text style={styles.textStyle}>
                        5.1
                        您在提供运输过程中应尽审慎的注意义务，确保货物的安全。如致货物灭失、损毁、短少，除不可抗力、货物自身原因、收货人责任外，您应根据服务协议承担赔偿责任。如服务协议未规定，则按照货物实际价值进行赔偿。

                    </Text>
                    <Text style={styles.textStyle}>
                        5.2
                        为维护鲜易供应链的信誉，如果您未及时向货主赔偿，鲜易供应链授权使用方或其他合作方可以就货物灭失、损毁、短少等情况向货主先行垫资赔偿。鲜易供应链授权使用方或其他合作方先行赔偿之后，有权向您追偿。您同意并认可鲜易供应链授权使用方或其他合作方的该行为，且保证在被追偿时，积极履行偿还义务。

                    </Text>
                    <Text style={styles.textStyle}>
                        5.3 货物运输中的破损、丢失等财产纠纷，以及因交通事故造成人员伤亡等人身纠纷，鲜易供应链作为第三方不承担任何责任。

                    </Text>

                    <Text style={styles.textBlackStyle}>
                        5.4如您存在违约行为给鲜易供应链造成损失的，需赔偿给鲜易供应链造成的直接损失和间接损失（包括但不限于经营损失、垫付费用、诉讼费、律师费、公证费、公告费、拍卖费、差旅费、调查取证费、处置费等），并承担由此引起的一切责任与风险。

                    </Text>
                    <Text style={styles.textBlackStyle}>
                        6. 违规和评价

                    </Text>
                    <Text style={styles.textStyle}>
                        6.1 您应当尊重鲜易通的规则，不得出现下列违规行为，否则鲜易供应链有权视情节对您采取违规公示、临时或永久禁用鲜易通服务等处罚措施：

                    </Text>
                    <Text style={styles.textStyle}>
                        （1）恶意报价，扰乱平台秩序；
                    </Text>
                    <Text style={styles.textStyle}>
                        （2）恶意索要与报价金额不相符的运费、小费；
                    </Text>
                    <Text style={styles.textStyle}>
                        （3）被收货人多次投诉；
                    </Text>
                    <Text style={styles.textStyle}>
                        （4）与收货人私下成交；
                    </Text>
                    <Text style={styles.textStyle}>
                        （5）其他严重违反诚实信用的行为。
                    </Text>
                    <Text style={styles.textStyle}>
                        6.2 鲜易供应链将逐步运用技术手段，评价您的服务质量和违规情况并在鲜易通公示。请注意，您的服务质量和违规情况是您能否中标的重要参考依据。

                    </Text>
                    <Text style={styles.textBlackStyle}>
                        7. 个人信息保护

                    </Text>
                    <Text style={styles.textStyle}>
                        7.1 您的运输信息将在鲜易通上保存五年。

                    </Text>
                    <Text style={styles.textStyle}>
                        7.2 未经您的同意，鲜易供应链不会向鲜易通授权合作方或其他合作方以外的任何公司、组织和个人披露您的个人信息，但您违反本协议约定导致他人投诉或者主管机关追究责任，以及法律法规另有规定的除外。

                    </Text>
                    <Text style={styles.textBlackStyle}>
                        8. 不可抗力

                    </Text>
                    <Text style={styles.textStyle}>
                        8.1
                        对于因鲜易供应链合理控制范围以外的原因，包括但不限于自然灾害、罢工、骚乱、暴动、战争行为、政府行为、通讯或其他设施故障或严重伤亡事故等，致使鲜易供应链不能及时提供服务的，鲜易供应链不对您承担任何责任。但鲜易供应链应提供相关证据证明不可抗力的发生，并在不可抗力发生后及时通知您，并采取相关补救措施。同时，上述不可抗力的发生，致使您未能全部或部分履行本协议内容的，您不对鲜易供应链或第三方承担任何责任。

                    </Text>
                    <Text style={styles.textBlackStyle}>
                        9. 律适用和管辖

                    </Text>
                    <Text style={styles.textStyle}>
                        9.1
                        协议之效力、解释、变更、执行与争议解决均适用中华人民共和国大陆地区法律，如无相关法律规定的，则应参照通用国际商业惯例和行业惯例。鲜易供应链上的发布线路运输任务和报价行为适用《中华人民共和国合同法》，不适用《中华人民共和国招标投标法》。

                    </Text>
                    <Text style={styles.textBlackStyle}>
                        9.2 本协议签订地为中华人民共和国河南省长葛市。因本协议发生任何纠纷，协商不成的，应提交本协议签订地有管辖权的人民法院诉讼解决。

                    </Text>
                    <Text style={styles.textBlackStyle}>
                        10. 其他

                    </Text>
                    <Text style={styles.textStyle}>
                        10.1 鲜易通中公布的现行有效的规则、通知、条款、制度等为本协议的重要组成部分，鲜易供应链保留随时更新服务协议的权利。

                    </Text>
                    <Text style={styles.textStyle}>
                        10.2
                        您使用鲜易通即视为您已阅读并同意受本协议及服务协议的约束。鲜易供应链有权在必要时修改本协议条款。您可以在鲜易通中查阅最新的协议条款。协议条款变更后，如果您继续使用本服务，即视为您已接受修改后的协议条款。如果您不接受修改后的协议条款，应当停止使用本服务。

                    </Text>
                    <Text style={styles.textStyle}>
                        10.3 本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。

                    </Text>
                    <Text style={styles.textStyle}>
                        10.4 本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。

                    </Text>
                </ScrollView>
            </View>
        );
    }
}

