import React, { Component } from 'react';
import { connect } from 'react-redux';
// import './Specialty.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import specialtyImg from '../../../assets/specialty/co-xuong-khop.jpg';
import { getAllSpecialty } from '../../../services/userService';
import { LANGUAGES, path } from '../../../utils';
import { withRouter } from 'react-router';

class Specialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allSpecialty: []
        }
    }

    async componentDidMount() {
        let response = await getAllSpecialty();
        if (response && response.errCode === 0) {
            this.setState({
                allSpecialty: response.allSpecialty
            })
        }
    }

    handleViewDetailSpecialty = (specialty) => {
        if (this.props.history) this.props.history.push(path.DETAIL_SPECIALTY.replace(":id", `${specialty.id}`));
    }

    render() {
        let { allSpecialty } = this.state;
        let { settings, language } = this.props;

        return (
            <div className="section-share section-specialty">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section"><FormattedMessage id="homepage.popular-speciality" /></span>
                        <button className="btn-section"><FormattedMessage id="homepage.more-info" /></button>
                    </div>
                    <div className="section-body">
                        <Slider {...settings}>
                            {allSpecialty && allSpecialty.length > 0 && allSpecialty.map((ele, index) => {
                                let imageBase64 = '';
                                if (ele.image) {
                                    imageBase64 = new Buffer(ele.image, 'base64').toString('binary');
                                }
                                return (
                                    <div key={index} className="section-customize speicalty-child" onClick={() => this.handleViewDetailSpecialty(ele)}>
                                        <div className="bg-image section-specialty" style={{ backgroundImage: `url(${imageBase64})` }} />
                                        <div className="name-specialty">{language === LANGUAGES.VI ? ele.nameVi : ele.nameEn}</div>
                                    </div>
                                );
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
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
