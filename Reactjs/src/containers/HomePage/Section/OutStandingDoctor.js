import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import { LANGUAGES, path } from '../../../utils';
import { withRouter } from 'react-router';

class OutStandingDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            topDoctors: []
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.topDoctors !== this.props.topDoctors) {
            this.setState({
                topDoctors: this.props.topDoctors
            })
        }
    }

    componentDidMount = () => {
        this.props.loadTopDoctors('10');
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) this.props.history.push(path.DETAIL_DOCTOR.replace(":id", `${doctor.id}`));
    }

    render() {
        let { settings } = this.props;
        let { topDoctors } = this.state;
        return (
            <div className="section-share section-outstanding-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">Bác sĩ nổi bật tuần qua</span>
                        <button className="btn-section">Xem thêm</button>
                    </div>
                    <div className="section-body">
                        <Slider {...settings}>
                            {topDoctors && topDoctors.length > 0
                                && topDoctors.map((item, index) => {
                                    let nameAndPosVi = `${item.positionData.valueVi}, ${item.firstName + item.lastName}`;
                                    let nameAndPosEn = `${item.positionData.valueEn}, ${item.firstName + item.lastName}`;
                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                    }
                                    return (
                                        <div key={index} className="section-customize" onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className="customize-border">
                                                <div className="outer-bg">
                                                    <div className="bg-image section-outstanding-doctor" style={{ backgroundImage: `url(${imageBase64})` }} />
                                                </div>
                                                <div className="position text-center">
                                                    <div>{this.props.language === LANGUAGES.VI ? nameAndPosVi : nameAndPosEn}</div>
                                                    <div>Cơ xương khớp 1</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctors: state.admin.topDoctors,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: (limit) => dispatch(actions.fetchTopDoctors(limit))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
