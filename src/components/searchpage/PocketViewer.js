import React, { Component } from 'react';
import { Card, Switch, Button, Form } from 'antd';
import { connect ,useDispatch} from 'react-redux';
import {
    protColor,
    initializePocketViewer
} from '../../actions/simiPocAction';
import {fetchSimiPocBulbData,
    fetchSimiPocMeasure} from '../../actions/httpActions'
import {setupSimiViewer} from '../../actions/simiPocAction';
import { pdbPdbFileUrl } from '../../UrlManager';
import { store } from '../../store';
import './molviewer.css'
// import { pocBulbShow, pocBulbColor,loadMeasureInfo } from '../../actions/simiPocAction';



class PocketViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            affixed: true,
            renderedMembers: {}, // Keep track of rendered members
            simipocviewer: {}, // Initialize as an empty object
            similarPocketBulbData: {}, // Initialize as an empty object
        };
        // this.simipocviewer = null;
    }

    getViewerId() {
        const { searchId, pocId, similarMemberPdbId } = this.props;
        return `${searchId}_${pocId}_${similarMemberPdbId}`;
    }

    
    createViewer = () => {
        const viewerId = this.getViewerId();
        // console.log("vid",viewerId);
        const { searchId } = this.props;
        const { pocId } = this.props;
        const { similarMemberPdbId } = this.props;
        if (!this.state.simipocviewer[viewerId]) {
            const simipocviewer = window.$3Dmol.createViewer(viewerId, {});
            initializePocketViewer(simipocviewer, searchId, pocId, similarMemberPdbId);
            this.setState((prevState) => ({
                simipocviewer: {
                    ...prevState.simipocviewer,
                    [viewerId]: simipocviewer,
                },
            }), () => {
                // console.log("Updated state:", this.state);
            });
        }
    };
    


    renderViewer = () => {
       
    
    const { similarMemberPdbId } = this.props; // The pdbid from the similar pocket
    const viewerId = this.getViewerId(); // The unique viewer identifier

    let viewer = this.state.simipocviewer[viewerId];
    // console.log("renderviewer state:", this.state);
    viewer.clear();


        window.jQuery.ajax(pdbPdbFileUrl(similarMemberPdbId), {
            success: (data) => {
                viewer.addModel(data, "pdb");
                viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
                viewer.zoomTo();
                viewer.zoom(1.2, 1000);
                viewer.setHoverable({}, true, 
                    function (atom, viewer, event, container) {
                        if (!atom.label) {
                            atom.label = viewer.addLabel(atom.chain + " : " + atom.resi + " " + atom.resn + " : " + atom.atom,
                                { position: atom, backgroundColor: 'black', backgroundOpacity: 0.85, fontColor: '#ffffff', fontSize: 14 });
                        }
                    },
                    function (atom) {
                        if (atom.label) {
                            viewer.removeLabel(atom.label);
                            delete atom.label;
                        }
                    }
                );
                viewer.setHoverDuration(200);
                viewer.render();
                this.setState({ loading: false });
            },
            error: (hdr, status, err) => {
                console.error("Failed to load PDB " + pdbPdbFileUrl(similarMemberPdbId) + ": " + err);
                this.setState({ loading: false });
            },
        });
    }

    handleLoadViewer = () => {
        // const { similarMemberPdbId } = this.props;
        const viewerId = this.getViewerId();
        const { searchId } = this.props;
        const { pocId } = this.props;
        const { similarMemberPdbId } = this.props;
        fetchSimiPocBulbData(similarMemberPdbId); // Call the action with pdbid
        this.createViewer(); // Use the composite viewerId for creating the viewer
        this.setState((prevState) => ({
            renderedMembers: {
                ...prevState.renderedMembers,
                [viewerId]: true,
            },
        }), () => {
            this.renderViewer();
            store.dispatch(setupSimiViewer(this.state.simipocviewer[viewerId], searchId, pocId, similarMemberPdbId));
        });
    
    }

   
    componentDidUpdate(prevProps) {
        const oldViewerId = `${prevProps.searchId}_${prevProps.pocId}_${prevProps.similarMemberPdbId}`;
        const newViewerId = this.getViewerId();
        if (newViewerId !== oldViewerId) {
            this.setState({
                loading: true,
                simipocviewer: {
                    ...this.state.simipocviewer,
                    //  [oldViewerId]: undefined // Optionally remove the old viewer instance
                },
                similarPocketBulbData: null,
            }, () => {
                this.handleLoadViewer();
            });
        }
    }

  
    render = () => {
        const viewerId = this.getViewerId();
        const { similarMemberPdbId } = this.props;
    
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}> {/* This will center the content vertically and horizontally */}
                <div key={viewerId}>
                    <Card
                        id={viewerId}
                        className={this.state.affixed ? 'testaffixed' : 'test'}
                        style={{ width: '700px', height: '600px' }}
                    />
                    <div style={{ marginTop: '10px' }}> {/* This div will contain your button and switch */}
                        <Button type="primary" onClick={this.handleLoadViewer} style={{ marginRight: '10px' }}>
                            Load or Refresh Pdb File
                        </Button>
                        <Switch
                            size="small"
                            defaultChecked
                            checkedChildren="Spectrum"
                            unCheckedChildren="Plain"
                            onChange={(spectrum) => { protColor(spectrum, this.state.simipocviewer[viewerId]); }}
                        />
                    </div>
                </div>
            </div>
        );
    };
    
    
}


const mapStateToPropsViewer = (state, ownProps) => {
    // If the Redux store's viewer state is now indexed by the unique identifier,
    // you must construct it here to retrieve the correct viewer.
    const viewerId = `${ownProps.searchId}_${ownProps.pocId}_${ownProps.similarMemberPdbId}`;
    const simipocviewer = state.viewer[viewerId];
    return {
        simipocviewer: simipocviewer ? simipocviewer : null,
    };
};

export default connect(mapStateToPropsViewer, { setupSimiViewer })(PocketViewer);
