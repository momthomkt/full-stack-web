import React, { Component } from 'react';
import { connect } from "react-redux";
import './VerifyEmail.scss';
import { verifyBookAppointment } from '../../services/userService';
import { LANGUAGES } from '../../utils';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../HomePage/HomeHeader';


class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: null
        }
    }

    async componentDidMount() {
        console.log('aloalo')
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            console.log('check data: ', token, doctorId)
            let response = await verifyBookAppointment({
                token: token,
                doctorId: doctorId
            })
            if (response && response.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: response.errCode
                })
            }
            else {
                this.setState({
                    statusVerify: true,
                    errCode: response && response.errCode ? response.errCode : -1
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {

    }

    render() {
        let { statusVerify, errCode } = this.state;
        let { } = this.props;
        return (
            <>
                <HomeHeader />
                <div className="verify-email-container">
                    {statusVerify === false ?
                        <div>Loading data...</div>
                        :
                        <div>
                            {errCode === 0 ?
                                <div className="notify">Xác nhận lịch hẹn thành công!</div>
                                :
                                <div className="notify">Lịch hẹn không tồn tại hoặc đã được xác nhận!</div>
                            }
                        </div>
                    }
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
