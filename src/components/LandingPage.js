import React, {Component} from 'react'
import { Row, Col, Icon } from 'antd'
import { Link } from 'react-router-dom'
import LandingCard from './landingpage/LandingCards'
import SearchBox from './commons/SearchBox';
import connect from 'react-redux-fetch';
import PropTypes from 'prop-types';
import './landingpage/style.css';
import { INFO_URL } from '../UrlManager';
import { RootPath } from '../Settings';

class LandingPage  extends Component{
    componentDidMount = ()=>{
        if(this.props.castpInfo===undefined){
            this.props.dispatchCastpInfoGet(); 
        }
    }

    render = ()=>{
        /*
        const {castpInfoFetch} = this.props;
        if (castpInfoFetch.rejected) {
            return <div>Oops... Could not fetch!</div>
        }
        if (castpInfoFetch.fulfilled) {
            console.log(castpInfoFetch.value)
        }
        */
        return (
            <div>
                <Row style={{ 'minHeight': '20px' }} /> {/* spacing */}
                <Row type='flex' justify='space-around'>
                    {/* landing page consists three landing cards:
                        News, Getting started, and About
                    */}
                    <Col>
                        <LandingCard title={<div><Icon type="notification" /> News </div>} source='news' />
                    </Col>
        
                    <Col>
                        <LandingCard title={<div><Icon type='play-circle-o' /> Getting started</div>}>
                            <Row type='flex' justify='center'>
                                <SearchBox size='large' autoFocus={true} />
                            </Row>
                            <br />
                            <Row type='flex' justify='center'>
                                <Link to={RootPath+'compute'}><Icon type='upload' /> Compute my protein</Link>
                            </Row>
                            <br />
                            <Row type='flex' justify='center'>
                                <Link to={RootPath+'search'}><Icon type='gift' /> I'm feeling lucky!</Link>
                            </Row>
                        </LandingCard>
                    </Col>
        
                    <Col>
                        <LandingCard title={<div><Icon type="exclamation-circle-o" /> About</div>} source='about' />
                    </Col>
        
                </Row>
            </div>
        );
    }
}

LandingPage.propTypes = {
    /**
     * @var {Object} castpInfoFetch contains the result of the request + promise state (pending, fulfilled, rejected)
     */
    castpInfoFetch: PropTypes.object,
    // injected by react-redux-fetch
    /**
     * @var {Function} dispatchCastpInfoGet call this function to start fetching all Pokémon
     */
    dispatchCastpInfoGet: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    castpInfo : state.repository.castpInfo,
});
export default connect([{
    resource: 'castpInfo',
    method: 'get', // You can omit this, this is the default 
    request: {
        url: INFO_URL
    }
}], mapStateToProps)(LandingPage);