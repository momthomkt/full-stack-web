import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSpecialty.scss';
import { createSpecialty } from '../../../services/userService';
import { LANGUAGES, manageActions, CommonUtils } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Lightbox from "yet-another-react-lightbox";
import { toast } from 'react-toastify';

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameSpecialtyVi: '',
            nameSpecialtyEn: '',
            imageBase64: '',
            contentHTML: '',
            contentMarkdown: '',
            previewImageURL: '',
            isOpenPreviewImg: false,
            imageSpecialty: '',
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    handleChangeInfo = (event, keyInfo) => {
        this.setState({
            [keyInfo]: event.target.value
        })
    }

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                previewImageURL: objectUrl,
                imageSpecialty: base64
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

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    handleSubmitInfo = async () => {
        let dataSpecialty = {
            nameVi: this.state.nameSpecialtyVi,
            nameEn: this.state.nameSpecialtyEn,
            image: this.state.imageSpecialty,
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
        }
        let response = await createSpecialty(dataSpecialty);
        let notify = ''
        if (response && response.errCode === 0) {
            this.props.language === LANGUAGES.VI ? toast.success(response.messageVi) : toast.success(response.messageEn);
            this.setState({
                nameSpecialtyVi: '',
                nameSpecialtyEn: '',
                imageBase64: '',
                contentHTML: '',
                contentMarkdown: '',
                previewImageURL: '',
                isOpenPreviewImg: false,
                imageSpecialty: '',
            })
        }
        else if (response && response.errCode === 2) {
            this.props.language === LANGUAGES.VI ? toast.error(response.messageVi) : toast.error(response.messageEn);
        }
        else {
            this.props.language === LANGUAGES.VI ? toast.error('Lỗi hệ thống') : toast.error('Error system');
        }
    }

    render() {
        let { nameSpecialtyVi, nameSpecialtyEn } = this.state;
        let { } = this.props;
        return (
            <div className="manage-specialty-container container">
                <div className="manage-specialty-title">Quản lý chuyên khoa</div>
                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label>Tên chuyên khoa(Tiếng việt)</label>
                        <input
                            value={nameSpecialtyVi}
                            onChange={(event) => this.handleChangeInfo(event, 'nameSpecialtyVi')}
                            className="form-control"
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Tên chuyên khoa(Tiếng anh)</label>
                        <input
                            value={nameSpecialtyEn}
                            onChange={(event) => this.handleChangeInfo(event, 'nameSpecialtyEn')}
                            className="form-control"
                        />
                    </div>
                    {/* <div className="col-6 form-group">
                        <label>Ảnh chuyên khoa</label>
                        <input className="form-control-file" type="file" />
                    </div> */}
                    <div className="col-3 form-group preview-img-container">
                        <input id="avatar" type="file" hidden
                            //value={avatar}
                            onChange={(event) => this.handleOnChangeImage(event)}
                        />
                        <label className="label-upload" htmlFor="avatar">Tải ảnh<i className="fas fa-upload"></i></label>
                        <div onClick={() => this.handleClickPreviewImage()} style={{ backgroundImage: `url(${this.state.previewImageURL})` }} className="preview-image"></div>
                    </div>
                    <div className="col-12">
                        <MdEditor
                            style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.contentMarkdown}
                        />
                    </div>
                    <div className="col-12">
                        <button onClick={() => this.handleSubmitInfo()} className="btn btn-primary">Save</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
