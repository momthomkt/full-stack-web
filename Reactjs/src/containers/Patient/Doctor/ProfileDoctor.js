import React, { Component } from 'react';
import { connect } from "react-redux";
import './ProfileDoctor.scss';
import { getProfileDoctorById } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import moment from 'moment';

class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProFile: []
        }
    }

    async componentDidMount() {
        let data = await this.getInfoDoctor(this.props.doctorId);
        this.setState({
            dataProFile: data
        })
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.doctorId !== prevProps.doctorId) {
            // let data = await this.getInfoDoctor(this.props.doctorId);
            // this.setState({
            //     dataProFile: data
            // })
        }
    }

    getInfoDoctor = async (id) => {
        let result = {};
        if (id) {
            let res = await getProfileDoctorById(id);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }

    renderAppointmentIinfo = (dataProFile, dataTime, language) => {
        if (dataProFile && dataTime && dataProFile.doctorInfos) {
            let dateTimeVi = dataTime.timeTypeData.valueVi + ' - ' + moment(dataTime.date).format('dddd - DD/MM/YYYY');
            let dateTimeEn = dataTime.timeTypeData.valueEn + ' - ' + moment(dataTime.date).locale('en').format('dddd - DD/MM/YYYY');
            return (
                <>
                    <div className="name-clinic">{dataProFile.doctorInfos.nameClinic}</div>
                    <div className="address-clinic">{dataProFile.doctorInfos.addressClinic}</div>
                    <div className="date-time">{language === LANGUAGES.VI ? dateTimeVi : dateTimeEn}</div>
                </>
            );
        }
    }

    render() {
        console.log('check state profileDoctor: ', this.state)
        let { dataProFile } = this.state;
        let { language, isShowDescriptionDoctor, dataTime } = this.props;
        console.log('check dataTime: ', dataTime);
        console.log('chech date: ', moment(dataTime.date).format('dddd - DD/MM/YYYY'))
        let contentUpVi = '';
        let contentUpEn = '';
        if (dataProFile && dataProFile.positionData) {
            contentUpVi = dataProFile.positionData.valueVi + ', ' + dataProFile.firstName + ' ' + dataProFile.lastName;
            contentUpEn = dataProFile.positionData.valueEn + ', ' + dataProFile.lastName + ' ' + dataProFile.firstName;
        }
        return (
            <div className="profile-doctor-container">
                <div className="intro-doctor">
                    <div className="content-left" style={{ backgroundImage: `url(${dataProFile.image ? dataProFile.image : ''})` }}>

                    </div>
                    <div className="content-right">
                        <div className="up">
                            {language === LANGUAGES.VI ? contentUpVi : contentUpEn}
                        </div>
                        <div className="down">
                            {isShowDescriptionDoctor ?
                                <>
                                    {dataProFile && dataProFile.markDown && dataProFile.markDown.description &&
                                        <>
                                            {dataProFile.markDown.description.split('\n').map((item, index) => {
                                                return index === 0 ? <span>{item}</span> : <><br /><span>{item}</span></>
                                            })}
                                        </>
                                    }
                                </>
                                :
                                <>
                                    {this.renderAppointmentIinfo(dataProFile, dataTime, language)}
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className="price">Giá khám: {''}
                    {dataProFile && dataProFile.doctorInfos && language === LANGUAGES.VI &&
                        <NumberFormat
                            className="currency"
                            value={dataProFile.doctorInfos.priceTypeData.valueVi}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'VND'}
                        />
                    }
                    {dataProFile && dataProFile.doctorInfos && language === LANGUAGES.EN &&
                        <NumberFormat
                            className="currency"
                            value={dataProFile.doctorInfos.priceTypeData.valueEn}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'$'}
                        />
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
