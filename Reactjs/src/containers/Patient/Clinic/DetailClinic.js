import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailClinic.scss';
import { getOneClinic } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import OneDoctor from '../Specialty/OneDoctor';

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowFullDes: false,
            clinicData: []
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let response = await getOneClinic(id);
            if (response && response.errCode === 0 && response.clinicData) {
                this.setState({
                    clinicData: response.clinicData
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {

    }

    handleShowDes = () => {
        this.setState({
            isShowFullDes: true
        })
    }

    handleHideDes = () => {
        this.setState({
            isShowFullDes: false
        })
    }

    render() {
        let { isShowFullDes, clinicData } = this.state;
        let { language } = this.props;
        let styleHideDes = { maxHeight: '90px', overflow: 'hidden' };

        return (
            <div className="detail-clinic-container">
                <HomeHeader />
                <div className="container-desciption">
                    <div className="content-desciption">
                        <div className="img-clinic" style={{ backgroundImage: `url(${clinicData.image ? clinicData.image : ''})` }}></div>
                        <div className="cover-area">
                            <h4 className="title-name-clinic">
                                <b>{clinicData ? (language === LANGUAGES.VI ? clinicData.nameVi : clinicData.nameEn) : ''}</b>
                            </h4>
                            <div className="description-container">
                                <div className="description" style={!isShowFullDes ? styleHideDes : {}}>
                                    {clinicData && clinicData.desHTML &&
                                        <div dangerouslySetInnerHTML={{ __html: clinicData.desHTML }}></div>
                                    }
                                </div>
                                {isShowFullDes ?
                                    <span className="hide-des" onClick={() => this.handleHideDes()}><FormattedMessage id="patient.detail-clinic.hide" /></span>
                                    :
                                    <span className="show-des" onClick={() => this.handleShowDes()}><FormattedMessage id="patient.detail-clinic.read-more" /></span>
                                }
                            </div>
                        </div>
                    </div>

                </div>
                <div className="body-content">
                    <div className="cover-area">
                        <div className="select-province">
                            <select>
                                <option>{language === LANGUAGES.VI ? 'Toàn quốc' : 'Nationwide'}</option>
                                <option>Hà Nội</option>
                                <option>Hồ Chí Minh</option>
                            </select>
                        </div>
                        {clinicData && clinicData.arrDoctorData && clinicData.arrDoctorData.length > 0 && clinicData.arrDoctorData.map(doctor => {
                            return (<div className="doctor-in-clinic">
                                <OneDoctor
                                    doctorId={doctor.doctorId}
                                />
                            </div>);
                        })}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
