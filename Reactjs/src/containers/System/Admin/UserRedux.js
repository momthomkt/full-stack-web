import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, manageActions, CommonUtils } from '../../../utils';
import * as actions from "../../../store/actions";
import './UserRedux.scss';
import Lightbox from "yet-another-react-lightbox";
//import '../../../../node_modules/yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/dist/styles.css';
import TableManageUser from './TableManageUser';

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImageURL: '',
            isOpenPreviewImg: false,
            avatar: '',
            userInfo: {
                id: '',
                email: '', password: '', firstName: '',
                lastName: '', phoneNumber: '', address: '', gender: '', position: '', role: ''
            },

            arrCheckInfo: {
                email: 'email', password: 'password',
                firstName: 'firstName', lastName: 'lastName',
                phoneNumber: 'phoneNumber', address: 'address'
            },
            action: manageActions.CREATE
        }
    }

    async componentDidMount() {

        this.props.getAllCodeStart('GENDER');
        this.props.getAllCodeStart('ROLE');
        this.props.getAllCodeStart('POSITION');

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let arrAllCode = ['gender', 'role', 'position'];
        for (let index in arrAllCode) {
            if (prevProps[arrAllCode[index] + 'Redux'] !== this.props[arrAllCode[index] + 'Redux']) {
                let currCode = this.props[arrAllCode[index] + 'Redux'];
                let copyState = { ...this.state };
                copyState[arrAllCode[index] + 'Arr'] = currCode;
                copyState.userInfo[arrAllCode[index]] = (currCode && currCode.length > 0) ? currCode[0].keyMap : '';
                this.setState({
                    ...copyState
                })
            }
        }
    }

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                previewImageURL: objectUrl,
                avatar: base64
            })
        }
    }

    handleClickPreviewImage = () => {
        if (!this.state.previewImageURL) {
            return;
        }
        this.setState({
            isOpenPreviewImg: true
        })
    }

    handleOnChangeInput = (event, name) => {
        let copyState = { ...this.state };
        copyState.userInfo[name] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    handleSaveUser = async () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;
        if (this.state.action === manageActions.CREATE) {
            await this.props.saveUserRedux({
                email: this.state.userInfo.email,
                password: this.state.userInfo.password,
                firstName: this.state.userInfo.firstName,
                lastName: this.state.userInfo.lastName,
                phoneNumber: this.state.userInfo.phoneNumber,
                address: this.state.userInfo.address,
                gender: this.state.userInfo.gender,
                image: this.state.avatar,
                positionId: this.state.userInfo.position,
                roleId: this.state.userInfo.role
            })
        }
        if (this.state.action === manageActions.EDIT) {
            await this.props.editUserRedux({
                id: this.state.userInfo.id,
                firstName: this.state.userInfo.firstName,
                lastName: this.state.userInfo.lastName,
                phoneNumber: this.state.userInfo.phoneNumber,
                address: this.state.userInfo.address,
                gender: this.state.userInfo.gender,
                image: this.state.avatar,
                positionId: this.state.userInfo.position,
                roleId: this.state.userInfo.role
            }, this.props.language);
        }
        this.setState({
            userInfo: {
                id: '',
                email: '', password: '', firstName: '',
                lastName: '', phoneNumber: '', address: '',
                gender: this.state.genderArr && this.state.genderArr.length > 0 ? this.state.genderArr[0].keyMap : '',
                position: this.state.positionArr && this.state.positionArr.length > 0 ? this.state.positionArr[0].keyMap : '',
                role: this.state.roleArr && this.state.roleArr.length > 0 ? this.state.roleArr[0].keyMap : ''
            },
            action: manageActions.CREATE,
            previewImageURL: '',
            avatar: ''
        })
        this.props.getAllUsersRedux();
    }

    handleEditUserFromParent = (userData) => {
        let imageBase64 = '';
        if (userData.image) {
            imageBase64 = new Buffer(userData.image, 'base64').toString('binary');
        }
        this.setState({
            userInfo: {
                id: userData.id,
                email: userData.email, password: 'HARD_CODE',
                firstName: userData.firstName, lastName: userData.lastName,
                phoneNumber: userData.phoneNumber, address: userData.address,
                gender: userData.gender,
                avatar: '',
                position: userData.positionId, role: userData.roleId
            },
            previewImageURL: imageBase64,
            action: manageActions.EDIT
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        if (this.props.language === LANGUAGES.EN) {
            this.setState({
                arrCheckInfo: {
                    email: 'Email', password: 'Password',
                    firstName: 'First Name', lastName: 'Last Name',
                    phoneNumber: 'Phone Number', address: 'Address'
                }
            })
        }
        else {
            this.setState({
                arrCheckInfo: {
                    email: 'Email', password: 'Mật khẩu',
                    firstName: 'Họ', lastName: 'Tên',
                    phoneNumber: 'Số điện thoại', address: 'Địa chỉ'
                }
            })
        }
        let arrCheck = this.state.arrCheckInfo;
        for (let key in arrCheck) {
            if (!this.state.userInfo[key]) {
                isValid = false;
                if (this.props.language === LANGUAGES.EN) {
                    alert('This input is required: ' + arrCheck[key]);
                }
                else {
                    alert('Mục thông tin này là bắt buộc: ' + arrCheck[key]);
                }
                break;
            }
        }
        return isValid;
    }

    render() {
        let genderArr = this.state.genderArr;
        let positionArr = this.state.positionArr;
        let roleArr = this.state.roleArr;
        let language = this.props.language;
        let { email, password, firstName, lastName, phoneNumber, address, gender, position, role } = this.state.userInfo;
        let avatar = this.state.avatar;
        console.log('check info render: ', gender, position, role);
        console.log('check props redux: ', this.props['gender' + 'Redux']);
        return (
            <div className="user-redux-container">
                <div className="title" >
                    Learn React-Redux
                </div>
                <div className="user-redux-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 my-3">
                                <FormattedMessage id="manage-user.add" />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.email" /></label>
                                <input
                                    value={email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    className="form-control" type="email"
                                    disabled={this.state.action === manageActions.CREATE ? false : true}
                                />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input
                                    value={password}
                                    onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                    className="form-control" type="password"
                                    disabled={this.state.action === manageActions.CREATE ? false : true}
                                />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.first-name" /></label>
                                <input
                                    value={firstName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                    className="form-control" type="text" />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.last-name" /></label>
                                <input
                                    value={lastName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                    className="form-control" type="text" />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.phone-number" /></label>
                                <input
                                    value={phoneNumber}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                    className="form-control" type="text" />
                            </div>
                            <div className="col-9">
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input
                                    value={address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    className="form-control" type="text" />
                            </div>
                            <div className="col-2">
                                <label><FormattedMessage id="manage-user.gender" /></label>
                                <select
                                    className="form-control"
                                    onChange={(event) => this.handleOnChangeInput(event, 'gender')}
                                    value={gender}
                                >
                                    {genderArr && genderArr.length > 0 &&
                                        genderArr.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-2">
                                <label><FormattedMessage id="manage-user.role" /></label>
                                <select
                                    className="form-control"
                                    onChange={(event) => this.handleOnChangeInput(event, 'role')}
                                    value={role}
                                >
                                    {roleArr && roleArr.length > 0 &&
                                        roleArr.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-2">
                                <label><FormattedMessage id="manage-user.position" /></label>
                                <select
                                    className="form-control"
                                    onChange={(event) => this.handleOnChangeInput(event, 'position')}
                                    value={position}
                                >
                                    {positionArr && positionArr.length > 0 &&
                                        positionArr.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.image" /></label>
                                <div className="preview-img-container">
                                    <input id="avatar" type="file" hidden
                                        //value={avatar}
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    />
                                    <label className="label-upload" htmlFor="avatar">Tải ảnh<i className="fas fa-upload"></i></label>
                                    <div onClick={() => this.handleClickPreviewImage()} style={{ backgroundImage: `url(${this.state.previewImageURL})` }} className="preview-image"></div>
                                </div>
                            </div>
                            <div className="col-12 my-3">
                                {this.state.action === manageActions.CREATE ?
                                    <button className="btn btn-primary" onClick={() => this.handleSaveUser()}>
                                        <FormattedMessage id="manage-user.save" />
                                    </button>
                                    : <button className="btn btn-warning" onClick={() => this.handleSaveUser()}>
                                        <FormattedMessage id="manage-user.save-changes" />
                                    </button>
                                }
                            </div>
                            <div className="col-12">
                                <TableManageUser
                                    handleEditUserFromParent={this.handleEditUserFromParent}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                <Lightbox
                    open={this.state.isOpenPreviewImg}
                    close={() => this.setState({ isOpenPreviewImg: false })}
                    slides={[
                        { src: this.state.previewImageURL }
                    ]}
                />

            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.GENDERs,
        positionRedux: state.admin.POSITIONs,
        roleRedux: state.admin.ROLEs
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllCodeStart: (typeInput) => dispatch(actions.fetchAllCodeStart(typeInput)),
        saveUserRedux: (data) => dispatch(actions.createNewUser(data)),
        getAllUsersRedux: () => dispatch(actions.fetchAllUserStart()),
        editUserRedux: (data, language) => dispatch(actions.editUserStart(data, language))
        //processLogout: () => dispatch(actions.processLogout()),
        //changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
