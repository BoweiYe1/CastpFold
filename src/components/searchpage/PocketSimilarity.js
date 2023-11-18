import React, { Component } from 'react';
import { Card, Table, Tooltip, Switch, Icon, Select, Form} from 'antd';
import { bulbShow, bulbColor, resStyle } from '../../actions/viewerActions';
import { connect } from 'react-redux';
import { bulbDefaultColor } from './PocketBulb';
// import { bulbDefaultColor } from './PocketBulb';
// import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import { store } from '../../store';
import ColorPicker from 'rc-color-picker';
import PocketViewer from './PocketViewer';
import { pocBulbShow } from '../../actions/simiPocAction';
import './molviewer.css'

class PocketSimilarity extends Component {
    state = {
        currentPaginationPage: 1,
    };

    onPageChange = (page) => {
        this.setState({
            currentPaginationPage: page,
        });
    };

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
                            <PocketViewer
                                searchId={searchid}
                                pocId={record.pocid}
                                similarMemberPdbId={nestedRecord.pdbid}
                            />
                            <button
                                className="ant-btn ant-btn-primary"
                                onClick={(show) => {
                                    pocBulbShow(searchid, record.pocid, nestedRecord.pocid - 1, nestedRecord.pdbid, show);
                                }}
                                style={{ 
                                    marginTop: '10px', // Add spacing between the viewer and the button
                                }}
                            >
                                Show Pocket Negative Volume
                            </button>
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

                {/* <Form.Item label="Representation style">
                    <Select defaultValue="cartoon" onChange={(stl) => { resStyle(record.residues, stl) }}>
                        <Select.Option value="cartoon">Cartoon</Select.Option>
                        <Select.Option value="sphere">Sphere</Select.Option>
                        <Select.Option value="stick">Stick</Select.Option>
                        <Select.Option value="line">Line</Select.Option>
                        <Select.Option value="surface">Surface</Select.Option>
                    </Select>
                </Form.Item> */}
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

// mapDispatchToProps connects Redux actions to props
// const mapDispatchToProps = {
//     pocBulbShow, // Import this action creator from your actions file
// };mapDispatchToProps

export default connect(mapStateToProps)(PocketSimilarity);
