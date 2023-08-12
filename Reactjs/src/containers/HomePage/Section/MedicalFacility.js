import React, { Component } from 'react';
import { connect } from 'react-redux';
// import './MedicalFacility.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllClinic } from '../../../services/userService';
import { LANGUAGES, path } from '../../../utils';
import { withRouter } from 'react-router';

class MedicalFacility extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allClinic: []
        }
    }

    async componentDidMount() {
        let response = await getAllClinic();
        if (response && response.errCode === 0) {
            this.setState({
                allClinic: response.allClinic
            })
        }
    }

    handleViewDetailClinic = (clinicId) => {
        if (this.props.history) this.props.history.push(path.DETAIL_CLINIC.replace(":id", `${clinicId}`));
    }

    render() {
        let { allClinic } = this.state;
        let { language } = this.props;
        let settings = this.props.settings;

        return (
            <div className="section-share section-medical-facility">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">Cơ sở y tế nổi bật</span>
                        <button className="btn-section">Xem thêm</button>
                    </div>
                    <div className="section-body">
                        <Slider {...settings}>
                            {allClinic && allClinic.length > 0 && allClinic.map((currClinic, index) => {
                                let imageBase64 = '';
                                if (currClinic.image) {
                                    imageBase64 = new Buffer(currClinic.image, 'base64').toString('binary');
                                }
                                return (
                                    <div key={index} className="section-customize clinic-child" onClick={() => this.handleViewDetailClinic(currClinic.id)}>
                                        <div className="bg-image section-medical-facility" style={{ backgroundImage: `url(${imageBase64})` }} />
                                        <div className="name-clinic">{language === LANGUAGES.VI ? currClinic.nameVi : currClinic.nameEn}</div>
                                    </div>
                                );
                            })}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
