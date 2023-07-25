import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomeHeader';
import './DetailDoctor.scss';
import { getDetailDoctorService } from '../../../../services/userService';
import { LANGUAGES } from '../../../../utils';

class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {}
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let response = await getDetailDoctorService(id);
            if (response && response.errCode === 0 && response.doctorData) {
                this.setState({
                    detailDoctor: response.doctorData
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {

    }

    render() {
        let { detailDoctor } = this.state;
        let { language } = this.props;
        let contentUpVi = '';
        let contentUpEn = ''
        if (detailDoctor && detailDoctor.positionData) {
            contentUpVi = detailDoctor.positionData.valueVi + ', ' + detailDoctor.firstName + ' ' + detailDoctor.lastName;
            contentUpEn = detailDoctor.positionData.valueEn + ', ' + detailDoctor.lastName + ' ' + detailDoctor.firstName;
        }
        return (
            <div>
                <HomeHeader isShowBanner={false} />
                <div className="doctor-detail-container">
                    <div className="intro-doctor">
                        <div className="content-left" style={{ backgroundImage: `url(${detailDoctor.image ? detailDoctor.image : ''})` }}>

                        </div>
                        <div className="content-right">
                            <div className="up">
                                {language === LANGUAGES.VI ? contentUpVi : contentUpEn}
                            </div>
                            <div className="down">
                                {detailDoctor && detailDoctor.markDown
                                    && detailDoctor.markDown.description
                                    &&
                                    <span>
                                        {detailDoctor.markDown.description}
                                    </span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="schedule-doctor">

                    </div>
                    <div className="detail-info-doctor">

                        {detailDoctor && detailDoctor.markDown && detailDoctor.markDown.contentHTML &&
                            <div dangerouslySetInnerHTML={{ __html: detailDoctor.markDown.contentHTML }}></div>
                        }

                    </div>
                    <div className="comment-doctor">

                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
