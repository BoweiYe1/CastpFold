// import React, { Component } from 'react';
// import { Icon, Card, Tooltip } from 'antd';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { RootPath } from '../../Settings'

// class GeneralInfo extends Component {

//     render = () => {

//         const assemblyTip =
//             <p className='tip'>
//                 Other asymetric unit or biological assembly of this protein. <br />
//                 Click this <a target='_blank' rel="noopener noreferrer" href='https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/biological-assemblies'> link
//                 </a> to learn more. </p>;

//         // const assemblyTitle = 
//         //     <span> Other assemblies <Tooltip  title={assemblyTip} arrowPointAtCenter={true} placement='right'> 
//         //         <Icon type="question-circle" /> </Tooltip> </span>;

//         const {searchid, generalInfo} = this.props;
//         // const {searchid, generalInfo, assemInfo} = this.props;

//         const MyGeneral = ()=>{
//             if(generalInfo===undefined || generalInfo.pending || generalInfo.rejected){
//                 return (<Card title='Loading' loading={true} id={this.props.id}/>);
//             }
//             else if(generalInfo.fulfilled){
//                 return (
//                     <Card title={generalInfo.value.name} id={this.props.id}>
//                         {generalInfo.value.desc}
//                     </Card>
//                 ); 
//             }           
//         };

//         // const MyAssembly = ()=>{
//         //     if(assemInfo===undefined || assemInfo.pending){
//         //         return (<Card title={assemblyTitle} loading={true}/>);
//         //     }
//         //     else if(assemInfo.rejected) {
//         //         return (<Card title={assemblyTitle}> None </Card>);
    
//         //     }
//         //     else if(assemInfo.fulfilled){
//         //         return (
//         //             <Card title={assemblyTitle}>
//         //             {
//         //                 assemInfo.value.map((rec, i) => {
//         //                     if(rec!==searchid){
//         //                         return (<Link to={RootPath+`search?${rec}`} > {rec.toUpperCase()} </Link>);
//         //                     }
//         //                     else{
//         //                         return (null);
//         //                     }
//         //                 })
//         //             }
//         //             </Card>
//         //         ); 
//         //     }
//         // }

//         return (
//             <div>
//                 <br />
//                 <MyGeneral/>
//                 <br />
//                 {/* <MyAssembly/>
//                 <br /> */}
//             </div>
//         );
//     }

// }


// const mapStateToProps = state => ({
//     searchid: state.router.location.search.slice(1),
//     generalInfo: state.repository.general,
//    // assemInfo: state.repository.assem,
// });
// export default connect(mapStateToProps)(GeneralInfo);


import React, { Component } from 'react';
import { Icon, Card, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootPath } from '../../Settings';
import { pdbZipUrl } from '../../UrlManager';
import { Button } from 'antd';

class GeneralInfo extends Component {
  downloadFile = () => {
    // Set the file URL to the specific file you want to download
    const { searchid } = this.props;
    const fileUrl = pdbZipUrl(searchid);

    // Create an invisible anchor element to trigger the download
    const link = document.createElement('a');
    link.href = fileUrl;

    // Extract the file name from the URL
    const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

    // Set the extracted file name as the download attribute
    link.download = fileName;

    // Trigger a click event to start the download
    link.click();
  };

  render = () => {
    const assemblyTip = (
      <p className='tip'>
        Other asymmetric unit or biological assembly of this protein. <br />
        Click this{' '}
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/biological-assemblies'
        >
          link
        </a>{' '}
        to learn more.{' '}
      </p>
    );

    const { searchid, generalInfo } = this.props;

    return (
        <div>
          <br />
          {generalInfo === undefined || generalInfo.pending || generalInfo.rejected ? (
            <Card title='Loading' loading={true} id={this.props.id} />
          ) : generalInfo.fulfilled ? (
            <Card title={generalInfo.value.name} id={this.props.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>{generalInfo.value.desc}</div>
                <Button type="primary" onClick={this.downloadFile} style={{ marginLeft: 'auto' }}>Download Pocket Info</Button>
              </div>
            </Card>
          ) : null}
        </div>
      );
  };
}

const mapStateToProps = (state) => ({
  searchid: state.router.location.search.slice(1),
  generalInfo: state.repository.general,
  // assemInfo: state.repository.assem,
});
export default connect(mapStateToProps)(GeneralInfo);
