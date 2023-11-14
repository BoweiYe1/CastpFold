import React, { Component } from 'react';
import { Spin, Affix, Card, Switch, Button} from 'antd'
import {initializeGlobalViewer, protColor} from '../../actions/viewerActions';
import {connect} from 'react-redux';
import {pdbPdbFileUrl} from '../../UrlManager'
import './molviewer.css'

class MolViewer extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, affixed: false, searchid:null };
    }

    // componentDidMount=()=>{
    //     this.createViewer();
    //     this.setState({
    //         loading: false,
    //         height: document.getElementById('viewer-box').clientHeight,
    //         width: document.getElementById('viewer-box').clientWidth,
    //         searchid:this.props.searchid,
    //     })

    //     this.renderViewer();
    // }

    componentDidMount = () => {
        this.createViewer();
    
        this.setState({
            loading: false,
            height: document.getElementById('viewer-box').clientHeight/2,
            width: document.getElementById('viewer-box').clientWidth/2,
            searchid: this.props.searchid,
        }, () => {
            this.renderViewer();
        });
    }

    componentDidUpdate=()=>{
        if(this.state.searchid!==this.props.searchid){
            this.setState({searchid:this.props.searchid});
            this.renderViewer();
        }
    }

    changeAffixStatus = () => {
        let viewer = this.viewer;
        this.setState({ affixed: !(this.state.affixed), searchid:this.props.searchid });
        if(viewer){ // TODO && have data
            if (!this.state.affixed) {
                viewer.setHeight(this.state.height);
                viewer.setWidth(this.state.width);
            }
            else {
                viewer.setHeight(this.state.height);
                viewer.setWidth(this.state.width);
            }
        }
    }

    render = () => (
        <div align='right'>
            <Affix offsetTop={40} onChange={this.changeAffixStatus} >
                <Spin spinning={this.state.loading} size="large">
                    <Card id='viewer-box' className={this.state.affixed ? 'testaffixed' : 'test'}/>
                    {/* <Button size="small" type="primary" onClick={() => this.componentDidMount()} className="load-button">
                        Reload Viewer
                    </Button> */}
                    <Switch size="small" defaultChecked
                        checkedChildren="Spectrum" 
                        unCheckedChildren="Plain"
                        onChange={(spectrum)=>{protColor(spectrum)}}
                    />
                </Spin>
            </Affix>
        </div>
    )

    createViewer = ()=>{
        if(this.viewer){
            return;
        }
        this.viewer = window.$3Dmol.createViewer('viewer-box', {})
        initializeGlobalViewer(this.viewer);
    }

    renderViewer = () => {
        const {searchid} = this.props;
        let viewer = this.viewer;
        viewer.clear();
        console.log(this.viewer);
        console.log(this);

        window.jQuery.ajax(pdbPdbFileUrl(searchid),{
            success: function(data){
                viewer.addModel( data, "pdb" );                       /* load data */
                viewer.setStyle({}, {cartoon: {color: 'spectrum'}});  /* style all atoms */
                viewer.zoomTo();                                      /* set camera */
                viewer.zoom(1.2, 1000);                               /* slight zoom */
                viewer.setHoverable({}, true,
                    function (atom, viewer, event, container) {
                        //console.log('hover', atom);
                        if (!atom.label) {
                            //atom.label = viewer.addLabel(atom.chain + ":" + atom.resi + atom.resn + ":" + atom.atom, { position: { x: 0, y: 0, z: 0 }, backgroundColor: 'mintcream', fontColor: 'black' });
                            atom.label = viewer.addLabel(atom.chain + " : " + atom.resi +" "+ atom.resn + " : " + atom.atom, 
                                { position: atom, backgroundColor: 'black', backgroundOpacity:0.85, 
                                    fontColor: '#ffffff', fontSize:14 });
                            //viewer.setStyle({ 'chain': atom.chain, 'resi': atom.resi }, { 'cartoon': { 'color': 'red' } });
                            //viewer.render();
                        }
                    },
                    function (atom) {
                        //console.log('unhover', atom);
                        if (atom.label) {
                            viewer.removeLabel(atom.label);
                            delete atom.label;
                            //viewer.setStyle({ 'chain': atom.chain, 'resi': atom.resi }, { 'cartoon': { 'color': 'gray' } });
                            //viewer.render();
                        }
                    }
                );
                viewer.setHoverDuration(200);
                viewer.render();                                      /* render scene */
    
            },
              error: function(hdr, status, err) {
                console.error( "Failed to load PDB " + pdbPdbFileUrl(searchid) + ": " + err );
              },
        })
    }
}

const mapStateToProps = state => ({
    searchid: state.router.location.search.slice(1),
    //viewer: state.viewer.viewer,
});
export default connect(mapStateToProps)(MolViewer);