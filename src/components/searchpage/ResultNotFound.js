import React, {Component} from 'react'
import { connect } from 'react-redux';
import { Modal, Alert, Button } from 'antd'
import { doSearch } from '../../containers/doSearch';

class ResultNotFound extends Component{// FIXME change to modal.error
    handleOk=()=>{
        doSearch('');
    }
    render = ()=>{
        const isJob=(searchid)=>{
            return searchid.length===15;
        }

        const isAFId=(searchid)=>{
            return searchid.length===10 | searchid.length===6;
        }
        // const msg = (<p> <strong>Result not found!</strong> <br/><br/>
        //     No result can be found for the 
        //     {isJob(this.props.searchid)? ' job id':' pdb id'}
        //     <strong> {' '+this.props.searchid} </strong>. <br/>
        //     Please make sure the id is correct{isJob(this.props.searchid)?
        //         ', and wait for the job to finish.':'.'}
        //     <br/><br/>
        //     Please contact <a>{"uic.lianglab{at}gmail.com"}</a> for further help.            
        //     <br/><br/>
        //     <span style={{float:'right'}}><Button onClick={this.handleOk}>
        //         Take me out of here!</Button></span>
        //     <br/><br/>
        // </p>)
        const messageContent = (
            <p>
              <strong>Result not found!</strong>
              <br /><br />
              No result can be found for the
              {isJob(this.props.searchid) ? ' job id' : ' pdb id'}
              <strong>{' ' + this.props.searchid}</strong>.
              <br />
              Please make sure the ID is correct
              {isJob(this.props.searchid) ? ', and wait for the job to finish.' : '.'}
              <br /><br />
              Please contact <a>{"uic.lianglab{at}gmail.com"}</a> for further help.
              <br /><br />
              <span style={{ float: 'right' }}>
                <Button onClick={this.handleOk}>Take me out of here!</Button>
              </span>
              <br /><br />
            </p>
          );
          
        const msg = messageContent;
          
        console.log(this.props)
        return (
            <Modal visible={!this.props.generalInfo ||
                this.props.generalInfo.rejected}
                centered={true}
                closable={false}
                maskClosable={false}
                bodyStyle={{ padding:0}}
                footer={null}
            >
                <Alert type='error' showIcon message= {msg} />
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    searchid: state.router.location.search.slice(1),
    generalInfo: state.repository.general,
});
export default connect(mapStateToProps)(ResultNotFound);