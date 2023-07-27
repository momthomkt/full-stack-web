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
import { LANGUAGES, manageActions } from '../../../utils';
import { getDetailDoctorService } from '../../../services/userService';
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
            allDoctors: [],
            methodSaveDetail: ''
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
        if (this.state.methodSaveDetail === manageActions.CREATE) {
            let data = {
                contentHTML: this.state.contentHTML,
                contentMarkdown: this.state.contentMarkdown,
                description: this.state.description,
                doctorId: this.state.selectedDoctor.value
            }
            await this.props.addDetailDoctorsRedux(data);
        }
        else if (this.state.methodSaveDetail === manageActions.EDIT) {
            let data = {
                contentHTML: this.state.contentHTML,
                contentMarkdown: this.state.contentMarkdown,
                description: this.state.description,
                doctorId: this.state.selectedDoctor.value
            }
            await this.props.updateDetailDoctorInfoRedux(data);
        }
        // let labelVi = this.state.allDoctors[0].firstName + ' ' + this.state.allDoctors[0].lastName;
        // let labelEn = this.state.allDoctors[0].lastName + ' ' + this.state.allDoctors[0].firstName;
        // let label = this.props.language === LANGUAGES.VI ? labelVi : labelEn;

        this.setState({
            contentMarkdown: '',
            contentHTML: '',
            // selectedDoctor: selectedDoctor,
            selectedDoctor: {},
            description: ''
        })
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor });

        let res = await getDetailDoctorService(selectedDoctor.value);
        console.log('check res select: ', res);
        if (res && res.errCode === 0 && res.doctorData && res.doctorData.markDown) {
            let markDown = res.doctorData.markDown;
            this.setState({
                contentHTML: markDown.contentHTML,
                contentMarkdown: markDown.contentMarkdown,
                description: markDown.description,
                methodSaveDetail: manageActions.EDIT
            })
        }
        else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                methodSaveDetail: manageActions.CREATE
            })
        }
    };

    handleOnchangeDescription = (event) => {
        this.setState({
            description: event.target.value
        })
    }

    render() {
        //let selectedDoctor = this.state.options[0] ? this.state.options[0] : { value: '', label: '' };
        let { selectedDoctor } = this.state;
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
                            onChange={this.handleChangeSelect}
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
                        value={this.state.contentMarkdown}
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
        language: state.app.language,
        allDoctors: state.admin.allDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsRedux: () => dispatch(actions.fetchAllDoctors()),
        addDetailDoctorsRedux: (data) => dispatch(actions.addDetailDoctors(data)),
        updateDetailDoctorInfoRedux: (data) => dispatch(actions.updateDetailDoctorInfo(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
