import React, { Component } from 'react';
import { Icon, Card, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootPath } from '../../Settings'

class GeneralInfo extends Component {

    render = () => {

        const assemblyTip =
            <p className='tip'>
                Other asymetric unit or biological assembly of this protein. <br />
                Click this <a target='_blank' rel="noopener noreferrer" href='https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/biological-assemblies'> link
                </a> to learn more. </p>;

        // const assemblyTitle = 
        //     <span> Other assemblies <Tooltip  title={assemblyTip} arrowPointAtCenter={true} placement='right'> 
        //         <Icon type="question-circle" /> </Tooltip> </span>;

        const {searchid, generalInfo} = this.props;
        // const {searchid, generalInfo, assemInfo} = this.props;

        const MyGeneral = ()=>{
            if(generalInfo===undefined || generalInfo.pending || generalInfo.rejected){
                return (<Card title='Loading' loading={true} id={this.props.id}/>);
            }
            else if(generalInfo.fulfilled){
                return (
                    <Card title={generalInfo.value.name} id={this.props.id}>
                        {generalInfo.value.desc}
                    </Card>
                ); 
            }           
        };

        // const MyAssembly = ()=>{
        //     if(assemInfo===undefined || assemInfo.pending){
        //         return (<Card title={assemblyTitle} loading={true}/>);
        //     }
        //     else if(assemInfo.rejected) {
        //         return (<Card title={assemblyTitle}> None </Card>);
    
        //     }
        //     else if(assemInfo.fulfilled){
        //         return (
        //             <Card title={assemblyTitle}>
        //             {
        //                 assemInfo.value.map((rec, i) => {
        //                     if(rec!==searchid){
        //                         return (<Link to={RootPath+`search?${rec}`} > {rec.toUpperCase()} </Link>);
        //                     }
        //                     else{
        //                         return (null);
        //                     }
        //                 })
        //             }
        //             </Card>
        //         ); 
        //     }
        // }

        return (
            <div>
                <br />
                <MyGeneral/>
                <br />
                {/* <MyAssembly/>
                <br /> */}
            </div>
        );
    }

}


const mapStateToProps = state => ({
    searchid: state.router.location.search.slice(1),
    generalInfo: state.repository.general,
   // assemInfo: state.repository.assem,
});
export default connect(mapStateToProps)(GeneralInfo);