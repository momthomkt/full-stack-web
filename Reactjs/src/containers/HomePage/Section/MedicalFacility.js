import React, { Component } from 'react';
import { connect } from 'react-redux';
// import './MedicalFacility.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';

class MedicalFacility extends Component {

    render() {
        let settings = this.props.settings;

        return (
            <div className="section-share section-medical-facility">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">Cơ sở y tế nổi bật</span>
                        <button className="btn-section">Xem thêm</button>
                    </div>
                    <div className="section-body">
                        <Slider {...settings}>
                            <div className="section-customize">
                                <div className="bg-image section-medical-facility" />
                                <div>Bệnh viện mắt quốc tế 1</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-medical-facility" />
                                <div>Bệnh viện mắt quốc tế 2</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-medical-facility" />
                                <div>Bệnh viện mắt quốc tế 3</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-medical-facility" />
                                <div>Bệnh viện mắt quốc tế 4</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-medical-facility" />
                                <div>Bệnh viện mắt quốc tế 5</div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-image section-medical-facility" />
                                <div>Bệnh viện mắt quốc tế 6</div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
