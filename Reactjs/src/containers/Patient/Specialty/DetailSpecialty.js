import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailSpecialty.scss';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import { getOneSpecialty, getDetailDoctorService } from '../../../services/userService';
import OneDoctor from './OneDoctor';
class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowFullDes: false,
            specialtyData: []
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let response = await getOneSpecialty(id);
            if (response && response.errCode === 0 && response.specialtyData) {
                this.setState({
                    specialtyData: response.specialtyData
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
        let { isShowFullDes, specialtyData } = this.state;
        let { language } = this.props;
        let styleHideDes = { maxHeight: '90px', overflow: 'hidden' };

        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <div className="container-desciption" style={{ backgroundImage: `url(${specialtyData.image ? specialtyData.image : ''})` }}>
                    <div className="content-desciption">
                        <div className="cover-area">
                            <h4 className="title-name-specialty">
                                <b>{specialtyData ? (language === LANGUAGES.VI ? specialtyData.nameVi : specialtyData.nameEn) : ''}</b>
                            </h4>
                            <div className="description-container">
                                <div className="description" style={!isShowFullDes ? styleHideDes : {}}>
                                    {specialtyData && specialtyData.desHTML &&
                                        <div dangerouslySetInnerHTML={{ __html: specialtyData.desHTML }}></div>
                                    }
                                </div>
                                {isShowFullDes ?
                                    <span className="hide-des" onClick={() => this.handleHideDes()}><FormattedMessage id="patient.detail-specialty.hide" /></span>
                                    :
                                    <span className="show-des" onClick={() => this.handleShowDes()}><FormattedMessage id="patient.detail-specialty.read-more" /></span>
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
                        {specialtyData && specialtyData.arrDoctorData && specialtyData.arrDoctorData.length > 0 && specialtyData.arrDoctorData.map((doctor, index) => {
                            return (<div key={index} className="doctor-in-specialty">
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
