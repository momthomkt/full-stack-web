import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllUsers, createNewUserService, deleteUser, editUserService } from '../../../services/userService';
import { emitter } from "../../../utils/emitter";
import * as actions from "../../../store/actions";

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import './ManageDoctor.scss';
const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: null,
            description: ''
        }
    }

    componentDidMount() {

    }

    componentDidUpdate = (prevProps, prevState) => {

    }

    // Finish!
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    handleSaveContentMarkdown = () => {
        console.log('check state: ', this.state);
    }

    handleChange = selectedDoctor => {
        this.setState({ selectedDoctor });
        console.log(`Option selected:`, selectedDoctor);
    };

    handleOnchangeDescription = (event) => {
        this.setState({
            description: event.target.value
        })
    }

    render() {
        let arrUserRedux = this.state.arrUserRedux;
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    Tạo thêm thông tin Bác sĩ
                </div>
                <div className="more-info">
                    <div className="content-left form-group">
                        <label>Chọn bác sĩ</label>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChange}
                            options={options}
                        />
                    </div>
                    <div className="content-right form-group">
                        <label>Thông tin giới thiệu</label>
                        <textarea className="form-control" rows="4"
                            onChange={(event) => this.handleOnchangeDescription(event)}
                            value={this.state.description}
                        >
                            asdasdasdasd
                        </textarea>
                    </div>
                </div>
                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                    />
                </div>
                <button
                    onClick={() => this.handleSaveContentMarkdown()}
                    className="save-content-doctor">Lưu thông tin</button>
            </div>


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

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
