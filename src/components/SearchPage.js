import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { fetchPdbGeneral, fetchPocMeasure, fetchAFmap, fetchSeqInfo, fetchFeatInfo, fetchBulbData, fetchPocSimi} from  '../actions/httpActions'
import ResultContent from './searchpage/ResultContent';
import './searchpage.css'
import { RootPath } from '../Settings';

const randomPDB = ()=>{
    var idpool = ['1bx0','2cpk'];//, '2cpk', '201l', '2r7g', '3trg', '2was', '4jii', '1ycs', '3igg', '2pk9'];//, '2iwv1', '1a2c', '6bo8' , '2uue'
    return idpool[Math.floor(Math.random()*idpool.length)]
}

class SearchPage extends Component {
    transformSearchId = (id) => {
        if (id.length === 4) {
            return id.toLowerCase();
        } else if (id.length === 6 || id.length === 10) {
            return id.toUpperCase();
        } else if (id.length === 15 ) {
            return id.toLowerCase();
        } 
        return id;
    }

    fetchResultData = () => {
        const transformedId = this.transformSearchId(this.props.searchid);

        if (transformedId.length === 6 || transformedId.length === 10) {
            fetchAFmap(transformedId);
        }
        fetchPdbGeneral(transformedId);
        fetchPocMeasure(transformedId);
        fetchSeqInfo(transformedId);
        fetchFeatInfo(transformedId);
        fetchBulbData(transformedId);
        fetchPocSimi(transformedId);
    }

    componentDidMount() {
        if (this.props.searchid !== '') {
            this.fetchResultData();
        }
    }

    componentDidUpdate() {
        if (this.props.searchid !== '') {
            this.fetchResultData();
        }
    }

    render = () => {
        const transformedId = this.transformSearchId(this.props.searchid);
        if (transformedId === '') {
            return (<Redirect to={RootPath + `search?${randomPDB()}`} />)
        }
        return (<ResultContent />)
    }
};


const mapStateToProps = state => ({
    searchid: state.router.location.search.slice(1),
});

export default connect(mapStateToProps)(SearchPage);