import React, { Component } from 'react';
import { connect } from "react-redux";
import './PrescriptionModal.scss';
import { LANGUAGES, CommonUtils } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class PrescriptionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            fileImgBase64: '',
            currImgFile: {}
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    toggle = () => {
        this.props.toggleFromParent();
    }



    handleChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];

        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                fileImgBase64: base64,
                currImgFile: file
            })
        }
    }

    handleSendPrescription = async () => {
        if (!this.state.email || !this.state.fileImgBase64) {
            alert(this.props.language === LANGUAGES.VI ? 'Hãy nhập hết các trường thông tin được yêu cầu' : 'Please enter all required information fields')
        }
        else {
            let dataChild = {
                email: this.state.email,
                imgPrescription: this.state.fileImgBase64
            };
            let result = await this.props.handleSendPrescriptionParent(dataChild);
            if (result === true) {
                this.setState({
                    email: this.props.dataModal.email,
                    fileImgBase64: '',
                    currImgFile: {}
                })
            }
        }
    }

    render() {
        let { email, currImgFile } = this.state;
        let { isOpenModal } = this.props;
        return (
            <div>
                <Modal
                    isOpen={isOpenModal} className={"prescription-modal-container"}
                    toggle={() => this.toggle()}
                    size="md"
                    centered
                >
                    <ModalHeader toggle={this.toggle}>Gửi hóa đơn khám bệnh thành công</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Email bệnh nhân</label>
                                <input
                                    onChange={(event) => this.handleChangeEmail(event)}
                                    type="email" value={email} className="form-control" />
                            </div>
                            <div className="col-6 form-group">
                                <label>Chọn file đơn thuốc</label>
                                <input
                                    //value={currImgFile}
                                    onChange={(event) => this.handleOnChangeImage(event)}
                                    type="file" className="form-control" />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.handleSendPrescription()}>
                            Send
                        </Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionModal);
