import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageClinic.scss';
import { createClinic } from '../../../services/userService';
import { LANGUAGES, CommonUtils } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Lightbox from "yet-another-react-lightbox";
import Select from 'react-select';
import * as actions from "../../../store/actions";
import { toast } from 'react-toastify';

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameClinicVi: '',
            nameClinicEn: '',
            //imageBase64: '',
            contentHTML: '',
            contentMarkdown: '',
            previewImageURL: '',
            isOpenPreviewImg: false,
            imageClinic: '',

            address: '',
            selectedProvince: null,
            provinceOptions: []

        }
    }

    componentDidMount() {
        this.props.fetchAllCodeStartRedux('province');
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.listProvince !== this.props.listProvince || prevProps.language !== this.props.language) {
            let provinceOptions = this.props.listProvince.map(item => {
                return {
                    value: item.keyMap,
                    label: this.props.language === LANGUAGES.VI ? item.valueVi : item.valueEn
                }
            })
            this.setState({
                provinceOptions: provinceOptions
            })
        }
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
                imageClinic: base64
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

    //Function help us uppercase the first element in input string
    jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    handleChangeSelectInfo = async (value, typeInfo) => {
        this.setState({
            ['selected' + this.jsUcfirst(typeInfo)]: value
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    handleSubmitInfo = async () => {
        let dataClinic = {
            nameVi: this.state.nameClinicVi,
            nameEn: this.state.nameClinicEn,
            provinceId: this.state.selectedProvince.value,
            address: this.state.address,
            image: this.state.imageClinic,
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
        }
        let response = await createClinic(dataClinic);
        if (response && response.errCode === 0) {
            this.props.language === LANGUAGES.VI ? toast.success(response.messageVi) : toast.success(response.messageEn);
            this.setState({
                nameClinicVi: '',
                nameClinicEn: '',
                imageClinic: '',
                //imageBase64: '',
                address: '',
                selectedProvince: null,
                contentHTML: '',
                contentMarkdown: '',
                previewImageURL: '',
                isOpenPreviewImg: false,
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
        let { nameClinicVi, nameClinicEn, selectedProvince, provinceOptions, address } = this.state;
        let { } = this.props;
        return (
            <div className="manage-clinic-container container">
                <div className="manage-clinic-title">Quản lý phòng khám</div>
                <div className="add-new-clinic row">
                    <div className="col-6 form-group">
                        <label>Tên phòng khám(Tiếng việt)</label>
                        <input
                            value={nameClinicVi}
                            onChange={(event) => this.handleChangeInfo(event, 'nameClinicVi')}
                            className="form-control"
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Tên phòng khám(Tiếng anh)</label>
                        <input
                            value={nameClinicEn}
                            onChange={(event) => this.handleChangeInfo(event, 'nameClinicEn')}
                            className="form-control"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.select-province" /></label>
                        <Select
                            value={selectedProvince}
                            onChange={(selectedProvince) => this.handleChangeSelectInfo(selectedProvince, 'province')}
                            options={provinceOptions}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-province" />}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Địa chỉ</label>
                        <input
                            value={address}
                            onChange={(event) => this.handleChangeInfo(event, 'address')}
                            className="form-control"
                        />
                    </div>
                    <div className="col-3 form-group preview-img-container">
                        <input id="avatar" type="file" hidden
                            //value={avatar}
                            onChange={(event) => this.handleOnChangeImage(event)}
                        />
                        <label className="label-upload" htmlFor="avatar">Tải ảnh<i className="fas fa-upload"></i></label>
                        <div onClick={() => this.handleClickPreviewImage()} style={{ backgroundImage: `url(${this.state.previewImageURL})` }} className="preview-image"></div>
                    </div>
                    <div className="col-12">
                        <label>Thông tin mô tả</label>
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
        language: state.app.language,
        listProvince: state.admin.provinces
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllCodeStartRedux: (inputType) => dispatch(actions.fetchAllCodeStart(inputType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
