import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

class About extends Component {

    render() {
        let settings = this.props.settings;

        return (
            <div className="section-share section-about">
                <div className="section-about-header">
                    Truyền thông nói gì về bookingcare
                </div>
                <div className="section-about-content">
                    <div className="content-left">
                        <iframe width="100%"
                            height="400px"
                            src="https://www.youtube.com/embed/jCMrJE9Rpa8?list=PLTpNwHSD94usk1ge3RG7NNqSIwvmTwlfm"
                            title="[PPL - W2] TUTORIAL PROGRAMMING CODE: LEXER"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen></iframe>
                    </div>
                    <div className="content-right">
                        <p>Giảng viên: Ths. Trần Ngọc Bảo Duy @ HCMUT</p>
                        <p>  Ghi ngày: 30-01-2023.</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
