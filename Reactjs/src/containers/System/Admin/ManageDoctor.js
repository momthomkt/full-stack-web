import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import './ManageDoctor.scss';
import { LANGUAGES } from '../../../utils';
// const options = [
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' },
// ];

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
            selectedDoctor: {},
            description: '',
            options: [],
            allDoctors: []
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctorsRedux();
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
    }

    // Finish!
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    handleSaveContentMarkdown = async () => {
        let data = {
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value
        }
        await this.props.addDetailDoctorsRedux(data);
        let labelVi = this.state.allDoctors[0].firstName + ' ' + this.state.allDoctors[0].lastName;
        let labelEn = this.state.allDoctors[0].lastName + ' ' + this.state.allDoctors[0].firstName;
        let label = this.props.language === LANGUAGES.VI ? labelVi : labelEn;
        let selectedDoctor = {
            value: this.state.allDoctors[0].id,
            label: label
        }
        this.setState({
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: selectedDoctor,
            description: ''
        })
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
        let selectedDoctor = this.state.options[0] ? this.state.options[0] : { value: '', label: '' };
        console.log('check state: ', this.state);
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    Tạo thêm thông tin Bác sĩ
                </div>
                <div className="more-info">
                    <div className="content-left form-group">
                        <label>Chọn bác sĩ</label>
                        <Select
                            value={selectedDoctor}
                            onChange={this.handleChange}
                            options={this.state.options}
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
        language: state.app.language,
        allDoctors: state.admin.allDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        addDetailDoctorsRedux: (data) => dispatch(actions.addDetailDoctors(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
