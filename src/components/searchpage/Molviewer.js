import React, { Component } from 'react';
import { Spin, Affix, Card, Switch, Button} from 'antd'
import {initializeGlobalViewer, protColor} from '../../actions/viewerActions';
import { fetchBulbData} from  '../../actions/httpActions'
import {connect} from 'react-redux';
import {pdbPdbFileUrl} from '../../UrlManager'
import './molviewer.css'

class MolViewer extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, affixed: false, searchid:null };
    }

    transformSearchId = (id) => {
        if (id.length === 4) {
            return id.toLowerCase();
        } else if (id.length === 6 || id.length === 10) {
            return id.toUpperCase();
        } else if (id.length === 15) {
            return id.toLowerCase();
        }
        return id;
    }

    componentDidMount = () => {
        const transformedId = this.transformSearchId(this.props.searchid);
        this.createViewer();
        const viewerBox = document.getElementById(`viewer-box${transformedId}`);
        this.setState({
            loading: false,
            originalHeight: viewerBox.clientHeight,
            originalWidth: viewerBox.clientWidth,
            affixedHeight: viewerBox.clientHeight, 
            affixedWidth: viewerBox.clientWidth,   
            searchid: transformedId,
        }, () => {
            this.renderViewer();
        });
    }


    componentDidUpdate = () => {
        const transformedId = this.transformSearchId(this.props.searchid);
        if(this.state.searchid !== transformedId){
            this.setState({searchid: transformedId});
            this.renderViewer();
        }
    }

    changeAffixStatus = (affixed) => {
        let viewer = this.viewer;
        const { originalHeight, originalWidth, affixedHeight, affixedWidth } = this.state;

        if (viewer) {
            if (affixed) {
                viewer.setHeight(affixedHeight);
                viewer.setWidth(affixedWidth);
            } else {
                viewer.setHeight(originalHeight);
                viewer.setWidth(originalWidth);
            }
            viewer.render();
        }
    }
    

    render = () => (
        <div align='right'>
            <Affix offsetTop={40} onChange={this.changeAffixStatus} >
                <Spin spinning={this.state.loading} size="large">
                    <Card id={`viewer-box${this.transformSearchId(this.props.searchid)}`} className={this.state.affixed ? 'testaffixed' : 'test'}>
                    </Card>
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
        const transformedId = this.transformSearchId(this.props.searchid);
        this.viewer = window.$3Dmol.createViewer(`viewer-box${transformedId}`, {})
        initializeGlobalViewer(this.viewer);
    }

    renderViewer = () => {
        // const {searchid} = this.props;
        // let viewer = this.viewer;
        // viewer.clear();
        const transformedId = this.transformSearchId(this.props.searchid);
        // console.log(searchid);
        let viewer = this.viewer;
        viewer.clear();
        // console.log(this.viewer);
        // console.log(this);

        window.jQuery.ajax(pdbPdbFileUrl(transformedId),{
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
                console.error( "Failed to load PDB " + pdbPdbFileUrl(transformedId) + ": " + err );
              },
        })
    }
}

const mapStateToProps = state => ({
    searchid: state.router.location.search.slice(1),
    //viewer: state.viewer.viewer,
});
export default connect(mapStateToProps)(MolViewer);