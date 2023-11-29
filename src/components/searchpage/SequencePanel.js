import React, { Component } from 'react';
import { Card, Tooltip, Icon, Collapse } from 'antd';
import { connect } from 'react-redux';
import './sequencepanel.css'

class SequencePanel extends Component {
    tagClick = (aadata) => {
        if(this.props.viewer){
            let chain = aadata.ch;
            let seqid = aadata.seqid || aadata.pos
            this.props.viewer.zoomTo( { within: { distance: 8, sel: { chain:chain, resi: seqid } } } );
        }
    }

    aaToTag = (aadata)=>{
        var ssclass = "";
        switch (aadata.ss.toUpperCase()) {
            case "H": ssclass += "seqH "; break;
            case "B": ssclass += "seqB "; break;
            case "E": ssclass += "seqE "; break;
            case "G": ssclass += "seqG "; break;
            case "I": ssclass += "seqI "; break;
            case "T": ssclass += "seqT "; break;
            case "S": ssclass += "seqS "; break;
            case "X": ssclass += "seqX "; break;
            case "-":
            case " ": ssclass += "seq_ "; break;
            case "P": ssclass += "seqP "; break;
            default: break;
        }
        // console.log("aadata",aadata);
        if(false){ ssclass+='displayed '; }//FIXME to add this part
        if(aadata.anno.length>0){ ssclass+='annotated '}
        const tip = <div className='tip-scroll'>
            <p> {aadata.aa}{aadata.seqid}</p>
            {aadata.anno.map((itm)=>(<p> &#8226; {itm}</p>))}
            </div>
        return (
            <Tooltip title={tip}>
                <a className={'seqtext '+ssclass} onClick={()=>{this.tagClick(aadata)}}>
                    {aadata.aa}</a>
            </Tooltip>
        )
    }
    render = () => {
        const allchains = [];
        if(this.props.seqInfo!==undefined && this.props.seqInfo.fulfilled){
            const {value} = this.props.seqInfo;
            value.forEach((chdata, i) => {
                let achain = [];
                chdata.data.forEach(aadata => {
                    achain.push( this.aaToTag(aadata) );
                });
                allchains.push(
                    <Collapse.Panel header={`Chain ${chdata.chain}`} key={i}>
                    {achain}
                    </Collapse.Panel>
                )
            });
        }

        const seqTip =
            <div className='tip'>
                <table>
                    <tbody>
                        <tr>
                            <td><a class='seqH seqtext legtext'>&alpha;-helix</a></td>
                            <td><a class='seqB seqtext legtext'>&beta;-bridge</a></td>
                            <td><a class='seqE seqtext legtext'>strand</a></td>
                        </tr>
                        <tr>
                            <td><a class='seqG seqtext legtext'>3<sub>10</sub> helix</a></td>
                            <td><a class='seqI seqtext legtext'>&pi;-helix</a></td>
                            <td><a class='seqT seqtext legtext'>turn</a></td>
                        </tr>
                        <tr>
                            <td><a class='seqS seqtext legtext'>bend</a></td>
                            <td><a class='seq_ seqtext legtext'>coil</a></td>
                            <td><a class='seqX seqtext legtext'>no structure</a></td>
                        </tr>
                        <tr>
                            <td><a class='seqP seqtext legtext'>proline</a></td>
                        </tr>
                        <tr>
                            <td><a class='seqtext legtext annotated'>annotated</a></td>
                            <td><a class='seqtext legtext displayed'>displayed</a></td>
                        </tr>                                            
                    </tbody>                                            
                </table>
            </div>;// FIXME TODO

        const seqTitle = <span> Sequence info <Tooltip title={seqTip} arrowPointAtCenter={true} placement='right'> <Icon type="question-circle" /> </Tooltip> </span>;
        // const seqTitle = 
        //     <span>
        //       Sequence info
        //       <Tooltip title={<seqTip />} arrowPointAtCenter placement='right'>
        //         <Icon type="question-circle" />
        //       </Tooltip>
        //     </span>;
        

        return (
            <Card title={seqTitle}>
                <Collapse defaultActiveKey={['0']}>
                    {allchains}
                </Collapse>
            </Card>
        );
    }
}



const mapStateToProps = state => ({
    searchid: state.router.location.search.slice(1),
    seqInfo: state.repository.sequence,
    viewer: state.viewer.viewer,
});


export default connect(mapStateToProps)(SequencePanel);
