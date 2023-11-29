import React, {Component} from 'react'
import { connect } from 'react-redux';
import { Modal, Alert, Button } from 'antd'
import { doSearch } from '../../containers/doSearch';

class ResultNotFound extends Component{// FIXME change to modal.error
    // componentDidMount() {
    //     const { searchid, afmap, dispatch } = this.props;
    //     if ((searchid.length === 6 || searchid.length === 10) && !afmap) {
    //         fetchAFmap(searchid);
    //     }
    // }
    handleOk=()=>{
        doSearch('');
    }
    handleAF=(AFpdb)=>{
        doSearch(AFpdb);
    }
    render = ()=>{
        const { searchid, afmap } = this.props;
        const isJob = searchid.length === 15;
        const isAFId = searchid.length === 6 || searchid.length === 10;
        let representativeId = searchid;
       
        if (isAFId && afmap && afmap.value) {
            representativeId = afmap.value[searchid];
            // console.log(afmap.value[searchid]);
        }
        let messageContent;
        if (isAFId && afmap && afmap.value && representativeId !== searchid && afmap.value[searchid]) {
            // New content for searchid length 6 or 10
            messageContent = (
                <p>
                    <strong>Representative Structure Found!</strong>
                    <br /><br />
                    The AF2 ID "{searchid}" has a representative: <strong>{representativeId}</strong>.
                    <br /><br />
                    <Button onClick={() => this.handleAF(representativeId)}>Search <strong> {representativeId}</strong> </Button>
                </p>
            );
        } else if(isAFId && afmap && afmap.value && representativeId === searchid && afmap.value[searchid]){
            // New content for searchid length 6 or 10
            messageContent = (
                <p>
                    <strong>Result not found!</strong>
                    <br /><br />
                    No result can be found for the AF2 ID
                    <strong>{' ' + searchid}</strong>.
                    <br />
                    Please make sure the ID is correct
                    <br /><br />
                    Please contact <a>{"castpfold.liang.lab@gmail.com"}</a> for further help.
                    <br /><br />
                    <span style={{ float: 'right' }}>
                        <Button onClick={this.handleOk}>Take me out of here!</Button>
                    </span>
                    <br /><br />
                </p>
            );
        } else if(isAFId && !afmap){
            messageContent = (
                <p>
                    <strong>Result not found!</strong>
                    <br /><br />
                    No result can be found for the AF2-like id, 
                    <strong>{' ' + searchid}</strong>.
                    <br />
                    <br />
                    We do not compute pocket for sequence labeled as <strong>"Fragment"</strong> in Uniprot. 
                    <br />
                    <br />
                    Please make sure the AF2 ID is correct and <strong>"Full-length"</strong>.
                    <br /><br />
                    Please contact <a>{"castpfold.liang.lab@gmail.com"}</a> for further help.
                    <br /><br />
                    <span style={{ float: 'right' }}>
                        <Button onClick={this.handleOk}>Take me out of here!</Button>
                    </span>
                    <br /><br />
                </p>
            );
        } else if(isAFId && afmap && !representativeId){
            messageContent = (
                <p>
                    <strong>Result not found!</strong>
                    <br /><br />
                    No result can be found for the AF2-like ID, 
                    <strong>{' ' + searchid}</strong>.
                    <br />
                    <br />
                    We do not compute pocket for sequence labeled as <strong>"Fragment"</strong> in Uniprot. 
                    <br />
                    <br />
                    Please make sure the AF2 ID is correct and <strong>"Full-length"</strong>.
                    <br /><br />
                    Please contact <a>{"castpfold.liang.lab@gmail.com"}</a> for further help.
                    <br /><br />
                    <span style={{ float: 'right' }}>
                        <Button onClick={this.handleOk}>Take me out of here!</Button>
                    </span>
                    <br /><br />
                </p>
            );
        }
        else{
            // Original content for other cases
            messageContent = (
                <p>
                    <strong>Result not found!</strong>
                    <br /><br />
                    No result can be found for the
                    {isJob ? ' job id' : ' pdb id'}
                    <strong>{' ' + searchid}</strong>.
                    <br />
                    Please make sure the ID is correct
                    {isJob ? ', and wait for the job to finish.' : '.'}
                    <br /><br />
                    Please contact <a>{"castpfold.liang.lab@gmail.com"}</a> for further help.
                    <br /><br />
                    <span style={{ float: 'right' }}>
                        <Button onClick={this.handleOk}>Take me out of here!</Button>
                    </span>
                    <br /><br />
                </p>
            );
        }
          
        // const msg = messageContent;
          
        // console.log('Repository State on Mount:', this.props.repository);
        // console.log('afmap:', this.props.afmap);
        return (
            <Modal visible={!this.props.generalInfo ||
                this.props.generalInfo.rejected}
                centered={true}
                closable={false}
                maskClosable={false}
                bodyStyle={{ padding: 0 }}
                footer={null}
            >
                <Alert type='warning' showIcon message={messageContent} />
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    searchid: state.router.location.search.slice(1),
    generalInfo: state.repository.general,
    repository: state.repository,
    afmap: state.repository.afmap,
});
export default connect(mapStateToProps)(ResultNotFound);