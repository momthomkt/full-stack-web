import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils';
import * as actions from "../../../store/actions";
import './UserRedux.scss';
import Lightbox from "yet-another-react-lightbox";
//import '../../../../node_modules/yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/dist/styles.css';
class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImageURL: '',
            isOpenPreviewImg: false
        }
    }

    async componentDidMount() {

        this.props.getAllCodeStart('gender');
        this.props.getAllCodeStart('role');
        this.props.getAllCodeStart('position');

        // try {
        //     let gender = await getAllCodeService('gender');
        //     let position = await getAllCodeService('position');
        //     let role = await getAllCodeService('role');
        //     if (gender && position && role && gender.errCode === 0 && position.errCode === 0 && role.errCode === 0) {
        //         this.setState({
        //             genderArr: gender.data,
        //             positionArr: position.data,
        //             roleArr: role.data
        //         })
        //     }
        // } catch (e) {
        //     console.log(e)
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let arrAllCode = ['gender', 'role', 'position'];
        for (let index in arrAllCode) {
            if (prevProps[arrAllCode[index] + 'Redux'] !== this.props[arrAllCode[index] + 'Redux']) {
                this.setState({
                    [arrAllCode[index] + 'Arr']: this.props[arrAllCode[index] + 'Redux']
                })
            }
        }
    }

    handleOnChangeImage = (event) => {
        let file = event.target.files[0];
        let objectUrl = URL.createObjectURL(file);
        this.setState({
            previewImageURL: objectUrl
        })
    }

    handleClickPreviewImage = () => {
        if (!this.state.previewImageURL) {
            return;
        }
        this.setState({
            isOpenPreviewImg: true
        })
    }

    render() {
        let genderArr = this.state.genderArr;
        let positionArr = this.state.positionArr;
        let roleArr = this.state.roleArr;
        let language = this.props.language;
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
                                <input className="form-control" type="email" />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input className="form-control" type="password" />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.first-name" /></label>
                                <input className="form-control" type="text" />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.last-name" /></label>
                                <input className="form-control" type="text" />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.phone-number" /></label>
                                <input className="form-control" type="text" />
                            </div>
                            <div className="col-9">
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input className="form-control" type="text" />
                            </div>
                            <div className="col-2">
                                <label><FormattedMessage id="manage-user.gender" /></label>
                                <select className="form-control">
                                    {/* <FormattedMessage id="manage-user.male">
                                        {(input) => (<option selected>{input}</option>)}
                                    </FormattedMessage>
                                    <FormattedMessage id="manage-user.female">
                                        {(input) => (<option>{input}</option>)}
                                    </FormattedMessage>
                                    <FormattedMessage id="manage-user.other">
                                        {(input) => (<option>{input}</option>)}
                                    </FormattedMessage> */}
                                    {genderArr && genderArr.length > 0 &&
                                        genderArr.map((item, index) => {
                                            return (
                                                <option key={index}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-2">
                                <label><FormattedMessage id="manage-user.role" /></label>
                                <select className="form-control">
                                    {roleArr && roleArr.length > 0 &&
                                        roleArr.map((item, index) => {
                                            return (
                                                <option key={index}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-2">
                                <label><FormattedMessage id="manage-user.position" /></label>
                                <select className="form-control">
                                    {positionArr && positionArr.length > 0 &&
                                        positionArr.map((item, index) => {
                                            return (
                                                <option key={index}>
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
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    />
                                    <label className="label-upload" htmlFor="avatar">Tải ảnh<i className="fas fa-upload"></i></label>
                                    <div onClick={() => this.handleClickPreviewImage()} style={{ backgroundImage: `url(${this.state.previewImageURL})` }} className="preview-image"></div>
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <button className="btn btn-primary"><FormattedMessage id="manage-user.save" /></button>
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
        genderRedux: state.admin.genders,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllCodeStart: (typeInput) => dispatch(actions.fetchAllCodeStart(typeInput))
        //processLogout: () => dispatch(actions.processLogout()),
        //changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
