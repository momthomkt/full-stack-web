import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: []
        }
    }

    async componentDidMount() {
        try {
            let gender = await getAllCodeService('gender');
            let position = await getAllCodeService('position');
            let role = await getAllCodeService('role');
            if (gender && position && role && gender.errCode === 0 && position.errCode === 0 && role.errCode === 0) {
                this.setState({
                    genderArr: gender.data,
                    positionArr: position.data,
                    roleArr: role.data
                })
            }
        } catch (e) {
            console.log(e)
        }
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
                            <div className="col-6">
                                <label><FormattedMessage id="manage-user.image" /></label>
                                <input className="form-control" type="text" />
                            </div>
                            <div className="col-12 mt-3">
                                <button className="btn btn-primary"><FormattedMessage id="manage-user.save" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
