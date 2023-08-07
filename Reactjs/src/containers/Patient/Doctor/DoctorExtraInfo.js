import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfo.scss';
import { getExtraDoctorInfoById } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { FormattedMessage } from 'react-intl';


class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailPrice: false,
            priceVi: '',
            priceEn: '',
            paymentVi: '',
            paymentEn: '',
            nameClinicVi: '',
            nameClinicEn: '',
            addressClinic: '',
            note: '',
        }
    }

    componentDidMount() {
        if (this.props.currDoctorId) {
            this.getExtraDoctorInfo(this.props.currDoctorId);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.currDoctorId !== this.props.currDoctorId) {
            this.getExtraDoctorInfo(this.props.currDoctorId);
        }
    }

    getExtraDoctorInfo = async (currDoctorId) => {
        let res = await getExtraDoctorInfoById(currDoctorId);
        if (res && res.errCode === 0 && res.data) {
            let doctorData = res.data;
            this.setState({
                note: doctorData.note
            })
            if (doctorData.priceTypeData) {
                this.setState({
                    priceVi: doctorData.priceTypeData.valueVi,
                    priceEn: doctorData.priceTypeData.valueEn,
                })
            }
            if (doctorData.paymentTypeData) {
                this.setState({
                    paymentVi: doctorData.paymentTypeData.valueVi,
                    paymentEn: doctorData.paymentTypeData.valueEn,
                })
            }
            if (doctorData.clinicData) {
                this.setState({
                    nameClinicVi: doctorData.clinicData.nameVi,
                    nameClinicEn: doctorData.clinicData.nameEn,
                    addressClinic: doctorData.clinicData.address,
                })
            }
        }
    }

    handleViewDetailPrice = (value) => {
        this.setState({
            isShowDetailPrice: value
        })
    }

    render() {
        let { isShowDetailPrice, priceVi, priceEn, paymentEn, paymentVi,
            provinceVi, provinceEn, nameClinicVi, nameClinicEn, addressClinic, note
        } = this.state;
        let { language } = this.props;
        return (
            <div className="doctor-extra-info-container">
                <div className="content-up">
                    <div className="text-address"><FormattedMessage id="patient.detail-doctor.address-title" /></div>
                    <div className="name-clinic">{language === LANGUAGES.VI ? nameClinicVi : nameClinicEn}</div>
                    <div className="address-clinic">{addressClinic}</div>
                </div>
                <div className="content-down">
                    {!isShowDetailPrice ?
                        <div className="short-info">
                            <div className="title-price"><FormattedMessage id="patient.detail-doctor.price-title" /></div>
                            <span className="price"> {language === LANGUAGES.VI ? priceVi : priceEn}<sup><FormattedMessage id="patient.detail-doctor.currency-unit" /></sup></span>
                            <span>.</span>
                            <span className="view-detail-title" onClick={() => this.handleViewDetailPrice(true)}> <FormattedMessage id="patient.detail-doctor.view-detail" /></span></div>
                        :
                        <>
                            <div className="title-price"><FormattedMessage id="patient.detail-doctor.price-title" /></div>
                            <div className="detail-info">
                                <div className="price">
                                    <span className="left"><FormattedMessage id="patient.detail-doctor.mini-price-title" /></span>
                                    <span className="right">{language === LANGUAGES.VI ? priceVi : priceEn}<sup><FormattedMessage id="patient.detail-doctor.currency-unit" /></sup></span>
                                </div>
                                <small className="note">{note}</small>
                            </div>
                            <div className="payment"><FormattedMessage id="patient.detail-doctor.patient-payment" /> {language === LANGUAGES.VI ? paymentVi : paymentEn}</div>
                            <div className="hide-detail-price">
                                <span onClick={() => this.handleViewDetailPrice(false)}><FormattedMessage id="patient.detail-doctor.hide-price-list" /></span>
                            </div>
                        </>
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
