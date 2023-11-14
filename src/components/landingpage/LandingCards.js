import React, { Component } from "react";
import { Card, Alert } from "antd";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { RootPath } from "../../Settings";


class LandingCard extends Component {
    render() {
        const {castpInfo, source, children, title} = this.props;
        var loading;

        const CardContent = () => {
            if (children === undefined) {
                if(castpInfo===undefined || castpInfo.pending){
                    loading = true;
                    //TODO test if this is unnecessary // return (<Spin spinning={true} />)
                    return null;
                }

                if (castpInfo.rejected) {
                    return (<Alert message={castpInfo.reason.message} type="error" />)
                    //return (<Alert message={`${castpInfo.reason}`} type="error" />)
                }

                if(castpInfo.fulfilled) {
                    const CardContentList = () => {
                        if (castpInfo.value[source] !== undefined) {
                            return (
                                <div> {castpInfo.value[source].slice(0, 3).map((rec) =>
                                    <div key={rec.id}>
                                        <Link to={RootPath+`${source}?${rec.route}`}> >> {rec.title}</Link>
                                        {" "}
                                        <p className='subtitle'>{rec.subtitle}</p>
                                    </div>
                                )}</div>
                                
                            )
                        }
                        else {
                            //TODO test if this is unnecessary // return (<Spin spinning={true} />)
                            return (<Alert message={`Cannot fetch data of "${source}"`} type="error" />)
                        }
                    }
                    return (<CardContentList />);
                }
            }
            else {
                return (children)
            }
        }

        const Extra = ()=>{
            if(children===undefined){
                return <Link to={RootPath+source}>more</Link>
            }
            else{
                return (null)
            }
        }

        return (
            <Card
                className='landingcard' hoverable={true}
                title={title}
                extra={<Extra/>}
                loading={loading}>
                <CardContent />
            </Card>
        )
    };
}

LandingCard.propTypes = {
    title: PropTypes.node.isRequired,
    source: PropTypes.string,
    children: PropTypes.node,
}

const mapStateToProps = state => ({
    castpInfo : state.repository.castpInfo,
});
export default connect(mapStateToProps)(LandingCard);