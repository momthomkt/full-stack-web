import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManagePatient.scss';
import { getPatientForDoctor, sendPrescription } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker';
import PrescriptionModal from './PrescriptionModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookingArr: [],
            currentDate: new Date(),
            isOpenPrescriptionModal: false,
            dataModal: {
                email: '',
                doctorId: '',
                patientId: '',
                timeType: '',
                firstName: '',
                lastName: ''
            },
            isShowLoading: false
        }
    }

    componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState) {

    }

    fetchAllAppointment = async (date) => {
        if (!isNaN(date)) {
            let response = await getPatientForDoctor(this.props.userInfo.id, date.toISOString());
            if (response && response.errCode === 0) {
                this.setState({
                    bookingArr: response.bookingArr
                })
            }
        }
    }

    handleOnChangeDatePicker = async (dateArr) => {
        this.fetchAllAppointment(dateArr[0])
        this.setState({
            currentDate: dateArr[0]
        })
    }

    handleConfirm = (ele) => {
        let data = {
            email: ele.patientData.email,
            doctorId: ele.doctorId,
            patientId: ele.patientId,
            timeType: ele.timeType,
            firstName: ele.patientData.firstName,
            lastName: ele.patientData.lastName
        }
        this.setState({
            isOpenPrescriptionModal: true,
            dataModal: { ...data }
        })
    }

    togglePrescriptionModal = () => {
        this.setState({
            isOpenPrescriptionModal: false,
            dataModal: {
                email: '',
                doctorId: '',
                patientId: '',
                timeType: '',
                firstName: '',
                lastName: ''
            }
        })
    }

    handleSendPrescription = async (dataChild) => {
        this.setState({
            isShowLoading: true
        })
        let response = await sendPrescription({
            email: dataChild.email,
            doctorId: this.state.dataModal.doctorId,
            patientId: this.state.dataModal.patientId,
            timeType: this.state.dataModal.timeType,
            imgPrescription: dataChild.imgPrescription,
            firstName: this.state.dataModal.firstName,
            lastName: this.state.dataModal.lastName
        })
        let { language } = this.props;
        if (response && response.errCode === 0) {
            this.fetchAllAppointment(this.state.currentDate);
            await this.setState({
                isShowLoading: false
            })
            toast.success(language === LANGUAGES.VI ? "Gửi đơn thuốc thành công" : "Send prescription success");
            this.setState({
                isOpenPrescriptionModal: false,
                dataModal: {
                    email: '',
                    doctorId: '',
                    patientId: '',
                    timeType: '',
                    firstName: '',
                    lastName: ''
                }
            })
            return true;
        }
        else {
            await this.setState({
                isShowLoading: false
            })
            toast.error(language === LANGUAGES.VI ? "Lỗi hệ thống" : "Error system");
            return false;
        }
    }

    render() {
        let { bookingArr, isOpenPrescriptionModal, dataModal } = this.state;
        let { language } = this.props;
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text="Loading..."
                >
                    <div className="manage-patient-container">
                        <div className="m-p-title">
                            <FormattedMessage id="doctor.manage-patient.manage-patient-title" />
                        </div>
                        <div className="manage-patient-body container">
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="doctor.manage-patient.day" /></label>
                                <DatePicker
                                    className="form-control"
                                    onChange={this.handleOnChangeDatePicker}
                                    value={this.state.currentDate}
                                    placeholder={<FormattedMessage id="doctor.manage-patient.select-day" />}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col"><FormattedMessage id="doctor.manage-patient.time" /></th>
                                        <th scope="col"><FormattedMessage id="doctor.manage-patient.full-name" /></th>
                                        <th scope="col"><FormattedMessage id="doctor.manage-patient.email" /></th>
                                        <th scope="col"><FormattedMessage id="doctor.manage-patient.address" /></th>
                                        <th scope="col"><FormattedMessage id="doctor.manage-patient.phone-number" /></th>
                                        <th scope="col"><FormattedMessage id="doctor.manage-patient.gender" /></th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookingArr && bookingArr.length > 0 && bookingArr.map((ele, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{language === LANGUAGES.VI ? ele.timeData.valueVi : ele.timeData.valueEn}</td>
                                                <td>{ele.patientData.firstName + ' ' + ele.patientData.lastName}</td>
                                                <td>{ele.patientData.email}</td>
                                                <td>{ele.patientData.address}</td>
                                                <td>{ele.patientData.phoneNumber}</td>
                                                <td>{language === LANGUAGES.VI ? ele.patientData.genderData.valueVi : ele.patientData.genderData.valueEn}</td>
                                                <td className="patient-action">
                                                    <button className="btn btn-primary"
                                                        onClick={() => this.handleConfirm(ele)}
                                                    ><FormattedMessage id="doctor.manage-patient.confirm" /></button>
                                                    <button className="btn btn-warning"><FormattedMessage id="doctor.manage-patient.send-bill" /></button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {(!bookingArr || bookingArr.length <= 0) &&
                            <div className="no-patient-content"><FormattedMessage id="doctor.manage-patient.no-patient-content" /></div>
                        }
                    </div>
                    <PrescriptionModal
                        isOpenModal={isOpenPrescriptionModal}
                        toggleFromParent={this.togglePrescriptionModal}
                        dataModal={dataModal}
                        handleSendPrescriptionParent={this.handleSendPrescription}
                    />
                </LoadingOverlay>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
