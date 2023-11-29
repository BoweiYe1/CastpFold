import React, { Component } from 'react';
import { Card, Table, Tooltip, Switch, Icon, Select, Form} from 'antd';
import { bulbShow, bulbColor, resStyle } from '../../actions/viewerActions';
import { connect } from 'react-redux';
import { bulbDefaultColor } from './PocketBulb';
import {fetchSimiPocBulbData,
    fetchSimiPocMeasure,onestepfetchSimiPocBulbData} from '../../actions/httpActions'
// import { bulbDefaultColor } from './PocketBulb';
// import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import { store } from '../../store';
import ColorPicker from 'rc-color-picker';
import PocketViewer from './PocketViewer';
import { pocBulbShow ,temppocBulbShow} from '../../actions/simiPocAction';
import './molviewer.css'
import {
    protColor,
    initializePocketViewer
} from '../../actions/simiPocAction';
import { pdbPdbFileUrl } from '../../UrlManager';
import {setupSimiViewer} from '../../actions/simiPocAction';

class OnestepPocSimViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            affixed: true,
            renderedMembers: {}, // Keep track of rendered members
            simipocviewer: {}, // Initialize as an empty object
            similarPocketBulbData: {}, // Initialize as an empty object
            currentPaginationPage: 1, // Added from previous state initialization
        };
    }

    downloadData = (members, searchId, pocketId) => {
                // Use searchId and pocketId to generate the file name
                const fileName = `${searchId}_pocket_${pocketId}_similar_list.json`;
                // Convert members to string
                const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                    JSON.stringify(members)
                )}`;
                // Create a link element
                const link = document.createElement('a');
                link.href = jsonString;
                link.download = fileName; // Set the download attribute to the new file name
                // Append to the DOM
                document.body.appendChild(link);
                // Trigger download
                link.click();
                // Clean up
                document.body.removeChild(link);
            };

    createViewer = (viewerId, searchId, pocId, similarMemberPdbId) => {
        if (!this.state.simipocviewer[viewerId]) {
            const simipocviewer = window.$3Dmol.createViewer(viewerId, {});
            initializePocketViewer(simipocviewer, searchId, pocId, similarMemberPdbId);
    
            // Update the state with the new viewer
            this.setState((prevState) => ({
                simipocviewer: {
                    ...prevState.simipocviewer,
                    [viewerId]: simipocviewer,
                },
            }));
    
            // Return the created viewer instance
            return simipocviewer;
        } else {
            // Return the existing viewer instance
            return this.state.simipocviewer[viewerId];
        }
    };

    renderViewer = (similarMemberPdbId, viewerId) => {
       
    
        // const { similarMemberPdbId } = this.props; // The pdbid from the similar pocket
        // const viewerId = this.getViewerId(); // The unique viewer identifier
        // console.log("Rendering viewer for ID:", viewerId);
        let viewer = this.state.simipocviewer[viewerId];
        // console.log("Viewer state at render:", this.state.simipocviewer);

        if (!viewer) {
        // console.error("Viewer not found for ID:", viewerId);
        return; // Early return if viewer isn't initialized
        }
    
        // let viewer = this.state.simipocviewer[viewerId];
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


    handleLoadViewer = async (viewerId, searchId, pocId, similarMemberPdbId, nestedRecordpocid, show) => {
        // Inside an async function in your component
        // console.log('About to fetch bulb data for:', similarMemberPdbId);
        const bulbData = await this.props.onestepfetchSimiPocBulbData(similarMemberPdbId);

    
        // Create viewer and get the instance
        const viewerInstance = this.createViewer(viewerId, searchId, pocId, similarMemberPdbId);
    
        // Pass the viewer instance directly to renderViewer
        this.renderViewer(similarMemberPdbId, viewerId, viewerInstance);
    
        temppocBulbShow(searchId, pocId, nestedRecordpocid, similarMemberPdbId, show, viewerInstance, bulbData);
        
        store.dispatch(setupSimiViewer(viewerInstance, searchId, pocId, similarMemberPdbId));
    
        this.setState({
            renderedMembers: {
                ...this.state.renderedMembers,
                [viewerId]: true,
                similarPocketBulbData: bulbData, 
                loading: false
            }
        });
    };


    pocketTableRender = (record) => {
        let pageSize = 10; // Change this dynamically as needed or receive it from props
  
     // Calculate the total records and the number of records to display based on pageSize
        const totalRecords = record.member.length;
        const displayAll = pageSize >= totalRecords; // Determine if we show all records
  
  // If pageSize >= totalRecords, show all, else show as many complete pages as possible
        const dataSourceToShow = displayAll ? record.member : 
                           record.member.slice(0, Math.floor(totalRecords / pageSize) * pageSize);

        const { searchid } = this.props; // Assuming searchid is being correctly mapped in mapStateToProps
        const columns = [
            { title: 'PDB ID', dataIndex: 'pdbid', key: 'pdbid', align: 'center' },
            { title: 'Similar Pocket ID', dataIndex: 'pocid', key: 'pocid', align: 'center' },
            {
                title: 'View PDB',
                key: 'actions',
                align: 'center',
                render: (nestedText, nestedRecord) => {
                    const viewerKey = `${searchid}_${record.pocid}_${nestedRecord.pdbid}`;
                    return (
                        <div 
                            key={viewerKey} 
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', // This centers the content horizontally
                                justifyContent: 'center', // This centers the content vertically if there is a height set
                                width: '100%' // Take the full width of the container to center content within it
                            }}
                        >
                        <Card
                              id={viewerKey}
                                 className={this.state.affixed ? 'testaffixed' : 'test'}
                                  style={{ width: '700px', height: '600px' }}
                              />
                        <div style={{ marginTop: '10px' }}>
                            {/* Warning message */}
                            <p style={{ color: 'red', textAlign: 'center' }}>
                                Warning: Opening too many viewers (&gt;15) will destroy older ones.
                            </p>
                            <button
                                className="ant-btn ant-btn-primary"
                                onClick={(show) => {
                                    this.handleLoadViewer(viewerKey,searchid,record.pocid,nestedRecord.pdbid,nestedRecord.pocid - 1, show);
                                }}
                                style={{ 
                                    marginTop: '10px', // Add spacing between the viewer and the button
                                }}
                            >
                                Show Similar Pocket with Negative Volume
                            </button>
                            <Switch
                            size="small"
                            defaultChecked
                            checkedChildren="Spectrum"
                            unCheckedChildren="Plain"
                            onChange={(spectrum) => { protColor(spectrum, this.state.simipocviewer[viewerKey]); }}
                        />
                        </div>
                        </div>
                    );
                },
                
            },
        ];

        
        const paginationConfig = displayAll ? false : { pageSize: pageSize }; // Disable pagination if showing all

      
        return (
            

         
            <div
            style={{
                maxWidth: '70%', // Set a maximum width for the expanded content
                overflowX: 'auto' // Add horizontal scroll if content exceeds the container width
            }}
        >
            
            <Form layout='inline'>
                <Form.Item label="Show negative volume">
                    <Switch size="small" onChange={(show) => { bulbShow(record.pocid-1, show) }} />
                </Form.Item>

                <Form.Item label="Negative volume color">
                    <ColorPicker color={bulbDefaultColor} enableAlpha={false} onClose={(c) => { bulbColor(record.pocid-1, c.color) }} placement="topRight" />
                </Form.Item>

            </Form>
            <Table
                columns={columns}
                dataSource={dataSourceToShow}
                rowKey={(nestedRecord) => `${nestedRecord.pdbid}_${nestedRecord.pocid}`}
                pagination={paginationConfig}
            />
            
            </div>
        );
    };

    render() {
        const { PocSimiInfo } = this.props;
        const columns = [
            { title: 'Pocket ID', dataIndex: 'pocid', key: 'pocid', align: 'center' },
            { title: 'Pocket Type', dataIndex: 'belonging', key: 'belonging', align: 'center' },
            { title: 'Similar Pocket Number', dataIndex: 'simnum', key: 'simnum', align: 'center' },
            {
                title: 'Download similar pocket list',
                key: 'download',
                align: 'center',
                render: (text, record) => (
                    <button
                        type="primary"
                        onClick={() => this.downloadData(record.member, this.props.searchid, record.pocid)}
                    >
                        Download File
                    </button>
                ),
            },
        ];

        // Function to render the data for the table
        const renderData = () => {
            if (PocSimiInfo && PocSimiInfo.fulfilled) {
                return PocSimiInfo.value;
            }
            return [];
        };

        return (
            <Card title="Pocket Similarity">
                <Table
                    columns={columns}
                    expandedRowRender={this.pocketTableRender} // Pass the method to expandedRowRender
                    dataSource={renderData()}
                    pagination={false}
                />
            </Card>
        );
    }
}

// mapStateToProps connects the Redux state to the props of this component
const mapStateToProps = state => ({
    PocSimiInfo: state.repository.pocsimi,
    searchid: state.router.location.search.slice(1),
});

const mapDispatchToProps = dispatch => ({
    onestepfetchSimiPocBulbData: (pdb) => dispatch(onestepfetchSimiPocBulbData(pdb)),
});


export default connect(mapStateToProps,mapDispatchToProps)(OnestepPocSimViewer);
