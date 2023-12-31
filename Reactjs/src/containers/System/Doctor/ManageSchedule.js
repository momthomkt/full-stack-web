import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageSchedule.scss';
import Select from 'react-select';
import * as actions from "../../../store/actions";
import { LANGUAGES, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allDoctors: [],
            selectedDoctor: null,
            options: [],
            currentDate: '',
            rangeTime: []
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctorsRedux();
        this.props.fetchAllScheduleTimeRedux();
    }

    buildOptions = (userData) => {
        return userData.map((currentUser) => {
            let labelVi = currentUser.firstName + ' ' + currentUser.lastName;
            let labelEn = currentUser.lastName + ' ' + currentUser.firstName;
            return {
                value: currentUser.id,
                label: this.props.language === LANGUAGES.VI ? labelVi : labelEn
            }
        })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.allDoctors !== this.props.allDoctors || prevProps.language !== this.props.language) {
            let options = this.buildOptions(this.props.allDoctors);
            this.setState({
                options: options,
                allDoctors: this.props.allDoctors
            })
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelected: false }));
            }

            this.setState({
                rangeTime: data
            })
        }
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor });

        // let res = await getDetailDoctorService(selectedDoctor.value);
        // console.log('check res select: ', res);
        // if (res && res.errCode === 0 && res.doctorData && res.doctorData.markDown) {
        //     let markDown = res.doctorData.markDown;
        //     this.setState({
        //         contentHTML: markDown.contentHTML,
        //         contentMarkdown: markDown.contentMarkdown,
        //         description: markDown.description,
        //         methodSaveDetail: manageActions.EDIT
        //     })
        // }
        // else {
        //     this.setState({
        //         contentHTML: '',
        //         contentMarkdown: '',
        //         description: '',
        //         methodSaveDetail: manageActions.CREATE
        //     })
        // }
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    handleClickBtnSchedule = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            let data = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })

            this.setState({
                rangeTime: data
            })
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];
        if (!selectedDoctor || _.isEmpty(selectedDoctor)) {
            toast.error("Invalid selected doctor!");
            return;
        }
        if (!currentDate) {
            toast.error("Invalid date!");
            return;
        }
        // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
        //let formatedDate = new Date(currentDate).getTime();

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (!selectedTime || selectedTime.length < 0) {
                //toast.error("Please choose at least one time button");
            }
            else {
                selectedTime.map(item => {
                    let obj = {
                        doctorId: selectedDoctor.value,
                        date: currentDate,
                        timeType: item.keyMap
                    };
                    result.push(obj);
                })
                let res = await saveBulkScheduleDoctor(result);
                if (res && res.errCode === 0) {
                    toast.success('Save time succeed')
                }
                else {
                    toast.error('Save time error');
                }
            }

        }
    }

    render() {
        const { isLoggedIn, language } = this.props;
        let { selectedDoctor, options, rangeTime } = this.state;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        return (

            <div className="manage-shedule-container">
                <div className="m-s-title">
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-6">
                            <label><FormattedMessage id="manage-schedule.select-doctor" /></label>
                            <Select
                                value={selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={options}
                                isClearable={true}
                            />
                        </div>
                        <div className="col-6">
                            <label><FormattedMessage id="manage-schedule.select-day" /></label>
                            <DatePicker
                                className="form-control"
                                onChange={this.handleOnChangeDatePicker}
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className="col-12 pick-hour-container">
                            {rangeTime &&
                                rangeTime.map((item, index) => {
                                    let valueItem = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                                    return (
                                        <button key={index}
                                            className={item.isSelected === true ? "btn btn-schedule active" : "btn btn-schedule"}
                                            onClick={() => this.handleClickBtnSchedule(item)}
                                        >{valueItem}</button>
                                    );
                                })
                            }
                        </div>
                        <div className="col-12">
                            <button
                                onClick={() => this.handleSaveSchedule()}
                                className="btn btn-primary btn-save-schedule"
                            ><FormattedMessage id="manage-schedule.save-info" /></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTimeRedux: () => dispatch(actions.fetchAllScheduleTime())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
