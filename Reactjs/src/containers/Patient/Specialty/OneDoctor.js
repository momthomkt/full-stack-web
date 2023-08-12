import React, { Component } from 'react';
import { connect } from "react-redux";
import './OneDoctor.scss';
import { getDetailDoctorService } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo';
import { LANGUAGES, path } from '../../../utils';
import { withRouter } from 'react-router';
class OneDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: []
        }
    }

    async componentDidMount() {
        if (this.props.doctorId) {
            let response = await getDetailDoctorService(this.props.doctorId);
            if (response && response.errCode === 0 && response.doctorData) {
                this.setState({
                    detailDoctor: response.doctorData
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.doctorId !== this.props.doctorId) {
            let response = await getDetailDoctorService(this.props.doctorId);
            if (response && response.errCode === 0 && response.doctorData) {
                this.setState({
                    detailDoctor: response.doctorData
                })
            }
        }
    }

    redirectDetailDoctor = (doctorId) => {

        if (this.props.history) {
            this.props.history.push(path.DETAIL_DOCTOR.replace(":id", `${doctorId}`));
        }

    }

    render() {
        let { detailDoctor } = this.state;
        let { language, doctorId } = this.props;
        ////////////////////////////////////////////////////////////
        let contentUpVi = '';
        let contentUpEn = '';
        if (detailDoctor && detailDoctor.positionData) {
            contentUpVi = detailDoctor.positionData.valueVi + ', ' + detailDoctor.firstName + ' ' + detailDoctor.lastName;
            contentUpEn = detailDoctor.positionData.valueEn + ', ' + detailDoctor.lastName + ' ' + detailDoctor.firstName;
        }
        ////////////////////////////////////////////////////////////
        return (
            <div className="one-doctor-container">
                <div className="intro-doctor">
                    <div className="content-left">
                        <div className="avatar" style={{ backgroundImage: `url(${detailDoctor.image ? detailDoctor.image : ''})` }}>
                        </div>
                        <div className="view-more-doctor-info"><span onClick={() => this.redirectDetailDoctor(doctorId)}><FormattedMessage id="patient.detail-specialty.see-more" /></span></div>
                    </div>
                    <div className="content-right">
                        <div className="up">
                            {language === LANGUAGES.VI ? contentUpVi : contentUpEn}
                        </div>
                        <div className="down">
                            {detailDoctor && detailDoctor.markDown
                                && detailDoctor.markDown.description
                                &&
                                <>
                                    {detailDoctor.markDown.description.split('\n').map((item, index) => {
                                        // return index === 0 ? <div>{item}</div> : <><br /><div>{item}</div></>
                                        return <div key={index}>{item}</div>
                                    })}
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className="exam-info">
                    <div className="content-up-schedule">
                        <DoctorSchedule
                            currDoctorId={doctorId}
                        />
                    </div>
                    <div className="content-down-exrta-info">
                        <DoctorExtraInfo
                            currDoctorId={doctorId}
                        />
                    </div>
                </div>
            </div >
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OneDoctor));
