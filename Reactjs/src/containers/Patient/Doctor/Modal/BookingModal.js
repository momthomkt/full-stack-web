import React, { Component } from 'react';
import { connect } from "react-redux";
import './BookingModal.scss';
import { BookAppointmentService } from '../../../../services/userService';
import * as actions from "../../../../store/actions";
import { LANGUAGES } from '../../../../utils';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import Select from 'react-select';
import { toast } from 'react-toastify';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            phoneNumber: '',
            reason: '',
            selectedGender: null,
            genderOptions: [],
            isShowErrMessage: false,
            errMessageVi: 'Vui lòng nhập thông tin',
            errMessageEn: 'Please enter the information',
            styleErr: {
                border: '1px solid red'
            },
            isShowLoading: false
        }
    }

    componentDidMount() {
        this.props.fetchAllCodeStartRedux('GENDER');
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.genders !== this.props.genders || prevProps.language !== this.props.language) {
            let genderOptions = this.props.genders.length > 0 ? this.buildOptionsForSelect(this.props.genders) : [];
            this.setState({
                genderOptions: genderOptions
            })
        }
    }

    buildOptionsForSelect = (data) => {
        if (data[0].keyMap) {
            return data.map((element) => {
                return {
                    value: element.keyMap,
                    label: this.props.language === LANGUAGES.VI ? element.valueVi : element.valueEn
                }
            })
        }
        else {
            return [];
        }
    }

    //Function help us uppercase the first element in input string
    jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    handleChangeTextInfo = (event, typeInfo) => {
        this.setState({
            [typeInfo]: event.target.value
        })
    }

    handleChangeSelectInfo = (value, typeInfo) => {
        this.setState({
            ['selected' + this.jsUcfirst(typeInfo)]: value
        })
    }

    validateInput = () => {
        //let isShowErrMessageElement = { ...this.state.isShowErrMessageElement };
        let arrInfo = ['firstName', 'lastName', 'email', 'address', 'phoneNumber', 'reason', 'selectedGender'];
        for (let ele of arrInfo) {
            if (!this.state[ele]) {
                return false;
            }
        }
        return true;
    }

    handleBookAppointment = async () => {
        this.setState({
            isShowErrMessage: true,
            isShowLoading: true
        })
        let isValid = this.validateInput();
        if (isValid) {
            let dateTimeVi = this.props.dataTime.timeTypeData.valueVi + ' - ' + moment(this.props.dataTime.date).format('dddd - DD/MM/YYYY');
            let dateTimeEn = this.props.dataTime.timeTypeData.valueEn + ' - ' + moment(this.props.dataTime.date).locale('en').format('dddd - DD/MM/YYYY');
            let data = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.selectedGender.value,
                reason: this.state.reason,
                doctorId: this.props.dataTime.doctorId,
                date: this.props.dataTime.date,
                timeType: this.props.dataTime.timeType,
                timeExamVi: dateTimeVi,
                timeExamEn: dateTimeEn,
                doctorName: this.props.dataTime.doctorData.firstName + ' ' + this.props.dataTime.doctorData.lastName,
                linkConfirm: "https://bookingcare.vn/"
            }
            let response = await BookAppointmentService(data);
            if (response) {
                await this.setState({
                    isShowLoading: false
                })
                if (response.errCode === 0) {
                    toast.success(this.props.language === LANGUAGES.VI ? "Đặt lịch hẹn thành công" : "Booking appointment succeed");
                    this.setState({
                        firstName: '',
                        lastName: '',
                        email: '',
                        address: '',
                        phoneNumber: '',
                        selectedGender: null,
                        reason: '',
                        isShowErrMessage: false
                    })
                }
                else if (response.errCode === 2) {
                    toast.error(this.props.language === LANGUAGES.VI ? response.errMessageVi : response.errMessageEn);
                }
                else {
                    toast.error(this.props.language === LANGUAGES.VI ? "Lỗi hệ thống" : "Error system");
                }
            }
            else {
                this.setState({
                    isShowLoading: false
                }, toast.error(this.props.language === LANGUAGES.VI ? "Lỗi hệ thống" : "Error system"))
            }
        }
        else {
            this.setState({
                isShowLoading: false
            }, alert('Vui lòng nhập đầy đủ các thông tin yêu cầu'))
        }
    }

    handleShowErrMessage = (key, language) => {
        //if (typeInput === 'text') {
        if (!this.state[key] && this.state.isShowErrMessage) {
            return (
                <>
                    <span style={{ color: 'red' }}>
                        {language === LANGUAGES.VI ? this.state.errMessageVi : this.state.errMessageEn}
                    </span>
                </>
            );
        }
        // }
        // else if (typeInput === 'select') {
        //     if (!this.state['selected' + this.jsUcfirst(key)] && this.state.isShowErrMessage) {
        //         return (
        //             <>
        //                 <span style={{ color: 'red' }}>
        //                     {language === LANGUAGES.VI ? this.state.errMessageVi : this.state.errMessageEn}
        //                 </span>
        //             </>
        //         );
        //     }
        // }
    }

    render() {
        let { selectedGender, genderOptions, isShowErrMessage,
            firstName, lastName, email, address, phoneNumber,
            reason, styleErr
        } = this.state;
        let { isOpenModal, handleCloseModal, dataTime, language } = this.props;
        let doctorId = '';
        if (dataTime && !_.isEmpty(dataTime)) doctorId = dataTime.doctorId;

        return (
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text="Loading..."
            >
                <Modal isOpen={isOpenModal} className={"booking-modal-container"}
                    size="lg"
                    centered
                >
                    <div className="booking-modal-content">
                        <div className="book-modal-header">
                            <span className='left'>Thông tin đặt lịch khám bệnh</span>
                            <span className='right'
                                onClick={handleCloseModal}
                            > <i className="fas fa-times"></i> </span>
                        </div>
                        <div className="book-modal-body container">
                            <div className="doctor-info">
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    isShowDescriptionDoctor={false}
                                    dataTime={dataTime}
                                />
                            </div>
                            {/* <div className="price">
                            Giá khám
                        </div> */}
                            <div className="row">
                                <div className="col-6 form-group">
                                    <label>Họ và tên đệm</label>
                                    <input
                                        value={this.state.firstName}
                                        style={isShowErrMessage && !firstName ? styleErr : null}
                                        onChange={(event) => this.handleChangeTextInfo(event, 'firstName')}
                                        className="form-control" required
                                    />
                                    {this.handleShowErrMessage('firstName', language)}
                                </div>
                                <div className="col-6 form-group">
                                    <label>Tên</label>
                                    <input
                                        value={this.state.lastName}
                                        style={isShowErrMessage && !lastName ? styleErr : null}
                                        onChange={(event) => this.handleChangeTextInfo(event, 'lastName')}
                                        className="form-control" />
                                    {this.handleShowErrMessage('lastName', language)}
                                </div>
                                <div className="col-6 form-group">
                                    <label>Email</label>
                                    <input
                                        value={this.state.email}
                                        style={isShowErrMessage && !email ? styleErr : null}
                                        onChange={(event) => this.handleChangeTextInfo(event, 'email')}
                                        className="form-control" />
                                    {this.handleShowErrMessage('email', language)}
                                </div>
                                <div className="col-6 form-group">
                                    <label>Địa chỉ liên hệ</label>
                                    <input
                                        value={this.state.address}
                                        style={isShowErrMessage && !address ? styleErr : null}
                                        onChange={(event) => this.handleChangeTextInfo(event, 'address')}
                                        className="form-control" />
                                    {this.handleShowErrMessage('address', language)}
                                </div>
                                <div className="col-6 form-group">
                                    <label>Số điện thoại</label>
                                    <input
                                        value={this.state.phoneNumber}
                                        style={isShowErrMessage && !phoneNumber ? styleErr : null}
                                        onChange={(event) => this.handleChangeTextInfo(event, 'phoneNumber')}
                                        className="form-control" />
                                    {this.handleShowErrMessage('phoneNumber', language)}
                                </div>
                                <div className="col-6 form-group">
                                    <label>Giới tính</label>
                                    <Select
                                        value={selectedGender}

                                        onChange={(selectedValue) => this.handleChangeSelectInfo(selectedValue, 'gender')}
                                        options={genderOptions}
                                        placeholder={'Chọn giới tính'}
                                        styles={{
                                            control: (baseStyles, state) => (isShowErrMessage && !selectedGender ? {

                                                ...baseStyles,
                                                borderColor: 'red',
                                            } : {
                                                ...baseStyles
                                            }),
                                        }}
                                    />
                                    {this.handleShowErrMessage('selectedGender', language)}
                                </div>
                                {/* <div className="col-4 form-group">
                                <label>Ngày sinh</label>
                                <input
                                    value={} className="form-control" />
                            </div> */}
                                <div className="col-12 form-group">
                                    <label>Lý do khám</label>
                                    <input
                                        value={this.state.reason}
                                        style={isShowErrMessage && !reason ? styleErr : null}
                                        onChange={(event) => this.handleChangeTextInfo(event, 'reason')}
                                        className="form-control" />
                                    {this.handleShowErrMessage('reason', language)}
                                </div>
                            </div>
                        </div>
                        <div className="book-modal-footer">
                            <button className="btn-booking-confirm btn btn-primary"
                                onClick={() => this.handleBookAppointment()}
                            >Xác nhận</button>
                            <button className="btn-booking-cancel btn btn-danger">Hủy</button>
                        </div>
                    </div>
                </Modal>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.GENDERs
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllCodeStartRedux: (inputType) => dispatch(actions.fetchAllCodeStart(inputType))
        //fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
