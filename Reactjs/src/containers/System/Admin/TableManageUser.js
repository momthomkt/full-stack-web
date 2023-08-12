import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import { getAllUsers, createNewUserService, deleteUser, editUserService } from '../../../services/userService';
import { emitter } from "../../../utils/emitter";
import * as actions from "../../../store/actions";

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
    console.log('handleEditorChange', html, text);
}

class TableManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUserRedux: [],
            userEdit: {}
        }
    }

    componentDidMount() {
        // await this.getAllUsersFromReact();
        this.props.getAllUsersRedux();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.users !== this.props.users) {
            this.setState({
                arrUserRedux: this.props.users
            })
        }
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsers('All');
        if (response && response.errCode === 0) {
            this.setState({
                arrUserRedux: response.users
            })
        }
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }

    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        })
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false
                })

                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleEditUser = async (userData) => {
        this.props.handleEditUserFromParent(userData);
    }

    editUser = async (userData) => {
        try {
            let response = await editUserService(userData);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalEditUser: false
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleDeleteUser = async (id) => {
        try {
            await this.props.deleteUserRedux(id, this.props.language);
            this.props.getAllUsersRedux();
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        let arrUserRedux = this.state.arrUserRedux;
        return (
            <React.Fragment>
                <div className="users-container">
                    <div className="users-table mt-3 mx-1">
                        <table id="customers">
                            <tbody>
                                <tr>
                                    <th>Email</th>
                                    <th>First name</th>
                                    <th>Last name</th>
                                    <th>Address</th>
                                    <th>Action</th>
                                </tr>
                                {arrUserRedux && arrUserRedux.map((item, index) => {
                                    return (

                                        <tr className="divClass">
                                            <td>{item.email}</td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.address}</td>
                                            <td>
                                                <button className="btn-edit" onClick={() => this.handleEditUser(item)}><i className="fas fa-edit"></i></button>
                                                <button className="btn-delete" onClick={() => this.handleDeleteUser(item.id)}><i className="fas fa-trash-alt"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })

                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
            </React.Fragment>


        );
    }

}

const mapStateToProps = state => {
    return {
        users: state.admin.users,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllUsersRedux: () => dispatch(actions.fetchAllUserStart()),
        deleteUserRedux: (id, language) => dispatch(actions.deleteUserStart(id, language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
