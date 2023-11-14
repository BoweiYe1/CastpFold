import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { fetchPdbGeneral, fetchPocMeasure, fetchPdbAssembly, fetchSeqInfo, fetchFeatInfo, fetchBulbData, fetchPocSimi} from  '../actions/httpActions'
import ResultContent from './searchpage/ResultContent';
import './searchpage.css'
import { RootPath } from '../Settings';

const randomPDB = ()=>{
    var idpool = ['1bx0','2cpk'];//, '2cpk', '201l', '2r7g', '3trg', '2was', '4jii', '1ycs', '3igg', '2pk9'];//, '2iwv1', '1a2c', '6bo8' , '2uue'
    return idpool[Math.floor(Math.random()*idpool.length)]
}

class SearchPage extends Component {
    fetchResultData = ()=>{
        fetchPdbGeneral(this.props.searchid);
        // fetchPdbAssembly(this.props.searchid);
        fetchPocMeasure(this.props.searchid);
        fetchSeqInfo(this.props.searchid);
        fetchFeatInfo(this.props.searchid);
        fetchBulbData(this.props.searchid);
        fetchPocSimi(this.props.searchid);
    }
    componentDidMount(){
        if(this.props.searchid!==''){
            console.log('mount')
            this.fetchResultData();
        }
    }
    componentDidUpdate(){
        if(this.props.searchid!==''){
            console.log('update')
            this.fetchResultData();
        }
    }

    render = () => {
        console.log('SP',this.props)
        // when no pdbid specified, show a random one
        if (this.props.searchid === '') {
            return (<Redirect to={RootPath+`search?${randomPDB()}`} />)
        }
        return ( <ResultContent/> )
    }
};


const mapStateToProps = state => ({
    searchid: state.router.location.search.slice(1),
});

export default connect(mapStateToProps)(SearchPage);
