import React, {Component} from 'react'
import connect from 'react-redux-fetch';
import PropTypes from 'prop-types';
import InfoLayout from './infopage/InfoLayout'
import { INFO_URL } from '../UrlManager';

class InfoPage  extends Component{
    componentDidMount = ()=>{
        if(this.props.castpInfo===undefined){
            this.props.dispatchCastpInfoGet(); 
        }
    }

    render = ()=>{
        return (<InfoLayout/>);
    }
}

InfoPage.propTypes = {
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
}],mapStateToProps)(InfoPage);