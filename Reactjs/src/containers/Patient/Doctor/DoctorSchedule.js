import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorSchedule.scss';
import { getScheduleDoctorByDate } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDayOptions: [],
            selectedDay: '',
            allAvailableTime: [],
            isOpenModalSchedule: false,
            dataScheduleTimeModal: {}
        }
    }

    async componentDidMount() {
        if (this.props.language) {
            await this.builOptionDayOfWeek(this.props.language);
        }
        if (this.props.currDoctorId && this.state.allDayOptions[0]) {
            this.getScheduleDoctor(this.props.currDoctorId);
        }
        //console.log('moment vi: ', moment(new Date()).format('dddd - DD/MM'));
        //console.log('moment vi: ', moment(new Date()).locale('en').format('dddd - DD/MM'));
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.language !== this.props.language) {
            let lastallDayOptions = this.state.allDayOptions.map((item, index) => {
                if (this.props.language === LANGUAGES.VI) {
                    if (index === 0) {
                        let ddMM = moment(new Date()).format('DD/MM');
                        let today = `Hôm nay - ${ddMM}`;
                        item.label = today;
                    }
                    else item.label = moment(new Date()).add(index, 'days').format('dddd - DD/MM');
                }
                else {
                    if (index === 0) {
                        let ddMM = moment(new Date()).format('DD/MM');
                        let today = `Today - ${ddMM}`;
                        item.label = today;
                    }
                    else item.label = moment(new Date()).add(index, 'days').locale('en').format('dddd - DD/MM');
                }
                return item;
            })
            this.setState({
                allDayOptions: lastallDayOptions
            })
        }
        if (prevProps.currDoctorId !== this.props.currDoctorId && this.state.allDayOptions[0]) {
            this.getScheduleDoctor(this.props.currDoctorId);
        }
    }

    builOptionDayOfWeek = (language) => {
        let allDayOptions = [];
        for (let i = 0; i < 7; i++) {
            let obj = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Hôm nay - ${ddMM}`;
                    obj.label = today;
                }
                else obj.label = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
            }
            else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Today - ${ddMM}`;
                    obj.label = today;
                }
                else obj.label = moment(new Date()).add(i, 'days').locale('en').format('dddd - DD/MM');
            }
            obj.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDayOptions.push(obj);
        }
        this.setState({
            allDayOptions: allDayOptions,
            selectedDay: allDayOptions[0].value
        })
    }

    getScheduleDoctor = async (currDoctorId) => {
        let response = await getScheduleDoctorByDate(currDoctorId, new Date(this.state.allDayOptions[0].value).toISOString());
        this.setState({
            allAvailableTime: response.data ? response.data : []
        })
    }

    handleOnChangeSelectDay = async (event) => {
        let response = await getScheduleDoctorByDate(this.props.currDoctorId, new Date(Number(event.target.value)).toISOString());
        let allTimes = [];
        if (response && response.errCode === 0) {
            allTimes = response.data
        }
        this.setState({
            selectedDay: Number(event.target.value),
            allAvailableTime: response.data ? response.data : []
        })

    }

    handleClickTimeBtn = (time) => {
        this.setState({
            isOpenModalSchedule: true,
            dataScheduleTimeModal: time
        })
    }

    handleCloseModalSchedule = () => {
        this.setState({
            isOpenModalSchedule: false
        })
    }

    render() {
        let { allDayOptions, selectedDay, allAvailableTime, dataScheduleTimeModal } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select
                            onChange={(event) => this.handleOnChangeSelectDay(event)}
                        //value={selectedDay}
                        >
                            {allDayOptions && allDayOptions.length > 0 && allDayOptions.map((item, index) => {
                                return (<option value={item.value} key={index}>{item.label}</option>)
                            })}
                        </select>
                    </div>
                    <div className="all-available-time">
                        <div className="text-calendar">
                            <i className="fas fa-calendar-alt"><span><FormattedMessage id="patient.detail-doctor.schedule" /></span></i>
                        </div>
                        <div className="time-content">
                            {allAvailableTime && allAvailableTime.length > 0 ?
                                <>
                                    <div className="time-content-btns">
                                        {allAvailableTime.map((item, index) => {
                                            return (
                                                <button
                                                    key={index}
                                                    className={language === LANGUAGES.VI ? "btn-vi" : "btn-en"}
                                                    onClick={() => this.handleClickTimeBtn(item)}
                                                >{language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn}</button>
                                            );
                                        })}
                                    </div>
                                    <div className="select-and-book">
                                        <span><FormattedMessage id="patient.detail-doctor.choose" /> <i className="far fa-hand-point-up"></i> <FormattedMessage id="patient.detail-doctor.book-free" /></span>
                                    </div>
                                </>
                                :
                                <div className="no-schedule"><FormattedMessage id="patient.detail-doctor.no-schedule" /></div>
                            }
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModal={this.state.isOpenModalSchedule}
                    handleCloseModal={this.handleCloseModalSchedule}
                    dataTime={dataScheduleTimeModal}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
