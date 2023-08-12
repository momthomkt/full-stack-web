import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import './ManageDoctor.scss';
import { LANGUAGES, manageActions } from '../../../utils';
import { getDetailManageDoctor, getDetailDoctorService, getAllClinic, getAllSpecialty } from '../../../services/userService';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //save Mardown
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: null,
            description: '',
            doctorOptions: [],
            methodSaveDetail: '',

            //save more info extra doctor
            priceOptions: [],
            paymentOptions: [],
            selectedPrice: null,
            selectedPayment: null,
            nameClinic: '',
            addressClinic: '',
            note: '',
            ////
            specialtyOptions: [],
            selectedSpecialty: null,
            clinicOptions: [],
            selectedClinic: null
        }
    }

    async componentDidMount() {
        this.props.fetchAllDoctorsRedux();
        this.props.fetchAllCodeStartRedux('PRICE');
        this.props.fetchAllCodeStartRedux('PAYMENT');
        let resClinic = await getAllClinic();
        if (resClinic && resClinic.errCode === 0 && resClinic.allClinic && resClinic.allClinic.length > 0) {
            let clinicOptions = this.buildOptions(resClinic.allClinic);
            this.setState({
                clinicOptions: clinicOptions
            })
        }
        let resSpecialty = await getAllSpecialty();
        if (resSpecialty && resSpecialty.errCode === 0 && resSpecialty.allSpecialty && resSpecialty.allSpecialty.length > 0) {
            let specialtyOptions = this.buildOptions(resSpecialty.allSpecialty);
            this.setState({
                specialtyOptions: specialtyOptions
            })
        }
    }

    buildOptions = (data) => {
        if (data[0].keyMap) {
            return data.map((element) => {
                return {
                    value: element.keyMap,
                    label: this.props.language === LANGUAGES.VI ? element.valueVi : element.valueEn
                }
            })
        }
        else if (data[0].firstName) {
            return data.map((currentUser) => {
                let labelVi = currentUser.firstName + ' ' + currentUser.lastName;
                let labelEn = currentUser.lastName + ' ' + currentUser.firstName;
                return {
                    value: currentUser.id,
                    label: this.props.language === LANGUAGES.VI ? labelVi : labelEn
                }
            })
        }
        else {
            return data.map((element) => {
                return {
                    value: element.id,
                    label: this.props.language === LANGUAGES.VI ? element.nameVi : element.nameEn
                }
            })
        }
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.allDoctors !== this.props.allDoctors || prevProps.language !== this.props.language) {
            let doctorOptions = this.props.allDoctors.length > 0 ? this.buildOptions(this.props.allDoctors) : [];
            this.setState({
                doctorOptions: doctorOptions,
                //allDoctors: this.props.allDoctors
            })
        }
        if (prevProps.listPrice !== this.props.listPrice || prevProps.language !== this.props.language) {
            let priceOptions = this.props.listPrice.length > 0 ? this.buildOptions(this.props.listPrice) : [];
            this.setState({
                //listPrice: this.props.listPrice,
                priceOptions: priceOptions
            })
        }
        if (prevProps.listPayment !== this.props.listPayment || prevProps.language !== this.props.language) {
            let paymentOptions = this.props.listPayment.length > 0 ? this.buildOptions(this.props.listPayment) : [];
            this.setState({
                //listPayment: this.props.listPayment,
                paymentOptions: paymentOptions
            })
        }
    }

    // Finish!
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    validateInfoDoctor = () => {
        let language = this.props.language;
        let arrContent = ['contentHTML', 'contentMarkdown', 'description', 'doctorId',
            'priceId', 'paymentId', 'addressClinic',
            'nameClinic', 'note'
        ];
        if (!this.state.selectedDoctor) {
            language === LANGUAGES.VI ? alert('Vui lòng chọn bác sĩ') : alert('Please select doctor');
            return false;
        }
        else if (!this.state.selectedSpecialty) {
            language === LANGUAGES.VI ? alert('Vui lòng chọn chuyên khoa') : alert('Please select specialty');
            return false;
        }
        else if (!this.state.selectedClinic) {
            language === LANGUAGES.VI ? alert('Vui lòng chọn phòng khám') : alert('Please select clinic');
            return false;
        }
        else if (!this.state.selectedPrice) {
            language === LANGUAGES.VI ? alert('Vui lòng chọn giá tiền') : alert('Please select price');
            return false;
        }
        else if (!this.state.selectedPayment) {
            language === LANGUAGES.VI ? alert('Vui lòng chọn phương thức thanh toán') : alert('Please select payment');
            return false;
        }
        else if (!this.state.contentHTML) {
            language === LANGUAGES.VI ? alert('Lỗi hệ thống') : alert('Error system');
            return false;
        }
        else if (!this.state.contentMarkdown) {
            language === LANGUAGES.VI ? alert('Vui lòng điền thông tin vào mục editorMarkdown') : alert('Please fill in the information in section editorMarkdown');
            return false;
        }
        return true;
    }

    handleSaveDetailDoctorInfo = async () => {
        if (this.validateInfoDoctor()) {
            let data = {
                contentHTML: this.state.contentHTML,
                contentMarkdown: this.state.contentMarkdown,
                description: this.state.description,
                doctorId: this.state.selectedDoctor.value,
                specialtyId: this.state.selectedSpecialty.value,
                clinicId: this.state.selectedClinic.value,
                priceId: this.state.selectedPrice.value,
                paymentId: this.state.selectedPayment.value,
                note: this.state.note
            }
            console.log('check data: ', data);
            let res = null;
            if (this.state.methodSaveDetail === manageActions.CREATE) {
                res = await this.props.addDetailDoctorsRedux(data);
            }
            else if (this.state.methodSaveDetail === manageActions.EDIT) {
                res = await this.props.updateDetailDoctorInfoRedux(data);
            }
            console.log('check res: ', res);
            if (res && res.errCode === 0) {
                console.log('aloalo123');
                this.setState({
                    contentMarkdown: '',
                    contentHTML: '',
                    selectedDoctor: null,
                    description: '',
                    selectedSpecialty: null,
                    selectedClinic: null,
                    selectedPrice: null,
                    selectedPayment: null,
                    note: ''
                })
            }
        }
    }

    //Function help us uppercase the first element in input string
    jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    handleChangeSelectInfo = async (value, typeInfo) => {
        this.setState({
            ['selected' + this.jsUcfirst(typeInfo)]: value
        })
    }

    handleChangeSelectDoctor = async (selectedDoctor) => {
        //this.setState({ selectedDoctor });

        const initState = {
            selectedDoctor: selectedDoctor,
            contentHTML: '',
            contentMarkdown: '',
            description: '',

            selectedSpecialty: null,
            selectedClinic: null,
            selectedPrice: null,
            selectedPayment: null,

            note: '',

            methodSaveDetail: manageActions.CREATE
        };

        if (selectedDoctor) {
            let res = await getDetailManageDoctor(selectedDoctor.value);
            if (res && res.errCode === 0 && res.doctorData && res.doctorData.markDown && res.doctorData.doctorInfos) {
                let contentHTML = ''; let contentMarkdown = ''; let description = '';
                let selectedPrice = null; let selectedPayment = null; let selectedSpecialty = null; let selectedClinic = null; let note = '';
                if (res.doctorData.markDown) {
                    let markDown = res.doctorData.markDown;
                    contentHTML = markDown.contentHTML;
                    contentMarkdown = markDown.contentMarkdown;
                    description = markDown.description;
                }
                if (res.doctorData.doctorInfos) {
                    let doctorInfos = res.doctorData.doctorInfos;
                    selectedPrice = this.state.priceOptions.find((item) => {
                        return item.value === doctorInfos.priceId;
                    });
                    selectedPayment = this.state.paymentOptions.find((item) => {
                        return item.value === doctorInfos.paymentId
                    });
                    selectedSpecialty = this.state.specialtyOptions.find((item) => {
                        return item.value === doctorInfos.specialtyId
                    })
                    selectedClinic = this.state.clinicOptions.find((item) => {
                        return item.value === doctorInfos.clinicId
                    })
                    note = doctorInfos.note;
                }

                this.setState({
                    selectedDoctor: selectedDoctor,
                    contentHTML: contentHTML,
                    contentMarkdown: contentMarkdown,
                    description: description,

                    selectedSpecialty: selectedSpecialty,
                    selectedClinic: selectedClinic,
                    selectedPrice: selectedPrice,
                    selectedPayment: selectedPayment,
                    note: note,

                    methodSaveDetail: manageActions.EDIT
                })
            }
            else {
                this.setState(initState)
            }
        }
        else {
            this.setState(initState)
        }
    };

    handleOnchangeInfoText = (event, typeInfo) => {
        this.setState({
            [typeInfo]: event.target.value
        })
    }

    render() {
        let { doctorOptions, selectedDoctor, priceOptions, selectedPrice, paymentOptions, selectedPayment,
            note, specialtyOptions, selectedSpecialty, clinicOptions, selectedClinic
        } = this.state;
        let { language } = this.props;
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className="container">
                    <div className="more-info">
                        <div className="content-left form-group">
                            <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                            <Select
                                value={selectedDoctor}
                                onChange={this.handleChangeSelectDoctor}
                                options={doctorOptions}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                                isClearable={true}
                            />
                        </div>
                        <div className="content-right form-group">
                            <label><FormattedMessage id="admin.manage-doctor.intro" /></label>
                            <textarea className="form-control" rows="4"
                                onChange={(event) => this.handleOnchangeInfoText(event, 'description')}
                                value={this.state.description}
                            >

                            </textarea>
                        </div>
                    </div>

                    <div className="more-info-extra row">
                        <div className="col-4 form-group">
                            <label>Chuyên khoa</label>
                            <Select
                                value={selectedSpecialty}
                                onChange={(selectedSpecialty) => this.handleChangeSelectInfo(selectedSpecialty, 'specialty')}
                                options={specialtyOptions}
                                placeholder={'Chọn chuyên khoa'}
                            />
                        </div>
                        <div className="col-4 form-group">
                            <label>Phòng khám</label>
                            <Select
                                value={selectedClinic}
                                onChange={(selectedClinic) => this.handleChangeSelectInfo(selectedClinic, 'clinic')}
                                options={clinicOptions}
                                placeholder={'Chọn phòng khám'}
                            />
                        </div>
                        <div className="col-4 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.select-price" /></label>
                            <Select
                                value={selectedPrice}
                                onChange={(selectedPrice) => this.handleChangeSelectInfo(selectedPrice, 'price')}
                                options={priceOptions}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-price" />}
                            />
                        </div>
                        <div className="col-4 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.select-payment" /></label>
                            <Select
                                value={selectedPayment}
                                onChange={(selectedPayment) => this.handleChangeSelectInfo(selectedPayment, 'payment')}
                                options={paymentOptions}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-payment" />}
                            />
                        </div>
                        {/* <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.select-province" /></label>
                        <Select
                            value={selectedProvince}
                            onChange={(selectedProvince) => this.handleChangeSelectInfo(selectedProvince, 'province')}
                            options={provinceOptions}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-province" />}
                        />
                    </div> */}
                        {/* <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.name-clinic" /></label>
                        <input
                            className="form-control"
                            onChange={(event) => this.handleOnchangeInfoText(event, 'nameClinic')}
                            value={nameClinic}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.address-clinic" /></label>
                        <input
                            className="form-control"
                            onChange={(event) => this.handleOnchangeInfoText(event, 'addressClinic')}
                            value={addressClinic}
                        />
                    </div> */}
                        <div className="col-8 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                            <input
                                className="form-control"
                                onChange={(event) => this.handleOnchangeInfoText(event, 'note')}
                                value={note}
                            />
                        </div>
                    </div>
                </div>

                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button
                    onClick={() => this.handleSaveDetailDoctorInfo()}
                    className="save-content-doctor"><FormattedMessage id="admin.manage-doctor.save-info" /></button>
            </div>


        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        listPrice: state.admin.PRICEs,
        listPayment: state.admin.PAYMENTs
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        addDetailDoctorsRedux: (data) => dispatch(actions.addDetailDoctors(data)),
        updateDetailDoctorInfoRedux: (data) => dispatch(actions.updateDetailDoctorInfo(data)),
        fetchAllCodeStartRedux: (inputType) => dispatch(actions.fetchAllCodeStart(inputType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
