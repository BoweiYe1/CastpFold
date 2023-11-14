import React, { Component } from 'react'
import { Button, Drawer, Timeline } from 'antd';
import { pdbDownloadUrl } from '../../UrlManager';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom'
import './controlpanel.css'


class ControlPanel extends Component {
    state = { ctrlVisible: false, configVisible: false };

    showCtrl = () => {
        this.setState({
            ctrlVisible: true,
        });
    };

    closeCtrl = () => {
        this.setState({
            ctrlVisible: false,
        });
    };

    showConfig = () => {
        this.setState({
            configVisible: true,
        });
    };

    closeConfig = () => {
        this.setState({
            configVisible: false,
        });
    };

    scrollToRef(ref){
        ReactDOM.findDOMNode(ref.current).scrollIntoView({behavior:'smooth'});
    }

    render = () => {
        return (
            <div>

                {/* floating button */}
                <Button className="show-ctrl" size='large'
                    type='primary' shape='circle' icon='plus'
                    onClick={this.showCtrl}>
                </Button>

                <Drawer title="Navigation and Control"
                    placement="left"
                    closable={false}
                    onClose={this.closeCtrl}
                    visible={this.state.ctrlVisible}>

                    {/* 
                    <Button className='my-margin' onClick={this.showConfig}>
                        Configure visualization
                    </Button>
                    */}

                    <Timeline style={{marginLeft:20}}>
                        <Timeline.Item>
                            <a onClick={()=>{window.scroll({top:0,left:0,behavior:'smooth'})}}>Top</a>
                        </Timeline.Item>
                        <Timeline.Item>
                            <a onClick={()=>{this.scrollToRef(this.props.refs[0])}}>General Info</a>
                        </Timeline.Item>
                        <Timeline.Item>
                            <a onClick={()=>{this.scrollToRef(this.props.refs[1])}}>Pocket Info</a>
                        </Timeline.Item>
                        <Timeline.Item>
                            <a onClick={()=>{this.scrollToRef(this.props.refs[2])}}>Sequence</a>
                        </Timeline.Item>
                        <Timeline.Item>
                            <a onClick={()=>{this.scrollToRef(this.props.refs[3])}}>Features</a>
                        </Timeline.Item>
                    </Timeline>

                    <Button className='download-button'
                        onClick={()=>{
                            window.location.assign(pdbDownloadUrl('1bxw'), '_blank')
                        }}>
                        Download CASTp data
                    </Button>

                </Drawer>

            </div>
        )
    }
};

ControlPanel.propTypes = {
    refs: PropTypes.array,
}
/*
const mapStateToProps = state => ({
    searchid: state.router.location.search.slice(1),
});

export default connect(mapStateToProps)(ControlPanel);
*/export default ControlPanel;