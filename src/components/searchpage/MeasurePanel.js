import React, { Component } from 'react';
import { Card, Table, Tooltip, Icon, Collapse, Switch, Select, Form } from 'antd';
import { connect } from 'react-redux';
import './measurepanel.css'
import { bulbShow, bulbColor, resStyle } from '../../actions/viewerActions';
import { bulbDefaultColor } from './PocketBulb';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

class MeasurePanel extends Component {
    render = () => {
        const measureTip =
            <p className='tip'> 
            The surface area (SA) and volume (V) of pocket.
                The values are calculated in both the solvent accessible (SA)
                and solvent excluded (SE) ways.<br />
                Click "+" to see how each residue/atom contribute to pockets.
            </p>;

        const measureTitle = <span> Pocket info <Tooltip title={measureTip} arrowPointAtCenter={true} placement='right'> <Icon type="question-circle" /> </Tooltip> </span>;

        const pocketAtomTableRender = (record) => {
            const columns = [
                { title: 'Atom', dataIndex: 'atom', key: 'atom', align:'center' },
                { title: <span>SASA (&#8491;<sup>2</sup>)</span>, dataIndex: 'sasa', key: 'sasa', align:'center' },
                { title: <span>SESA (&#8491;<sup>2</sup>)</span>, dataIndex: 'sesa', key: 'sesa', align:'center' },
            ];

            return (
                <Table
                    columns={columns}
                    className='pocket-atom-table'
                    dataSource={record.atoms}
                    pagination={false}
                    /*onRow={(record) => {
                        return {
                            onClick: () => { console.log(record) },       // click row TODO
                            onMouseEnter: () => {
                                document.body.style.cursor = "pointer";
                            },
                            onMouseLeave: () => {
                                document.body.style.cursor = "default";
                            },
                        };
                    }}*/
                />
            );
        }

        const pocketAtomListRender =(record)=>{
            let list = record.atoms.map((rec)=>`${rec.atom}`).join(', '); // FIXME add onClick to this zoomTo
            return(<p style={{margin:5,paddingLeft:40}}> 
                Atoms in pocket formation: {list}
            </p>);
        }

        const pocketResidueTableRender = (record) => {
            const columns = [
                { title: 'Chain', dataIndex: 'chain', key: 'chain', align:'center' },
                { title: 'Seq ID', dataIndex: 'seqId', key: 'seqId', align:'center' },
                { title: 'AA', dataIndex: 'aa', key: 'aa', align:'center' },
                //TODO add following back once ULTRACAST is fixed
                //{ title: <span>SASA (&#8491;<sup>2</sup>)</span>, dataIndex: 'sasa', key: 'sasa', align:'center' },
                //{ title: <span>SESA (&#8491;<sup>2</sup>)</span>, dataIndex: 'sesa', key: 'sesa', align:'center' },
            ];

            return (
                <Table
                    columns={columns}
                    //TODO add following back once ULTRACAST is fixed
                    //expandedRowRender={pocketAtomTableRender}
                    expandedRowRender={pocketAtomListRender}

                    dataSource={record.residues}
                    //pagination={false}
                    //scroll={{ y: 240 }}
                    onRow={(record) => {
                        return {
                            onClick: () => { this.props.viewer.zoomTo({chain:record.chain, resi:record.seqId}) },// click row TODO zoomTo
                            onMouseEnter: () => {
                                document.body.style.cursor = "pointer";
                            },
                            onMouseLeave: () => {
                                document.body.style.cursor = "default";
                            },
                        };
                    }}
                />
            );
        }

        const mouthAtomListRender =(record)=>{
            let list = record.atoms.map((rec)=>`${rec.chain}:${rec.seqId}${rec.aa}:${rec.atom}`).join(', '); // FIXME add onClick to this zoomTo
            return(<p style={{margin:5,paddingLeft:40}}> 
                Atoms in mouth formation: {list}
            </p>);
        }

        const mouthInfoTableRender = (record) => {
            const columns = [
                { title: <span>SA Area (&#8491;<sup>2</sup>)</span>, dataIndex: 'sama', key: 'sama', align:'center' },
                { title: <span>SA Perimeter (&#8491;)</span>, dataIndex: 'salen', key: 'salen', align:'center' },
                { title: <span>SE Area (&#8491;<sup>2</sup>)</span>, dataIndex: 'sema', key: 'sema', align:'center' },
                { title: <span>SE Perimeter (&#8491;)</span>, dataIndex: 'selen', key: 'selen', align:'center' },
            ];

            return (
                <Table
                    columns={columns}
                    expandedRowRender={mouthAtomListRender}
                    dataSource={record.mouths}
                    pagination={false}
                    //scroll={{ y: 240 }}
                    /*onRow={(record) => {
                        return {
                            onClick: () => { console.log(record) },       // click row TODO
                            onMouseEnter: () => {
                                document.body.style.cursor = "pointer";
                            },
                            onMouseLeave: () => {
                                document.body.style.cursor = "default";
                            },
                        };
                    }}*/
                />
            );

        }
        // key={`${record.pocId}-${record,pdbid}`}
        const pocketAndMouth = (record) => {
            console.log(record)
            return (
                <Collapse bordered={false}>  
                    <Collapse.Panel header={ <Form layout='inline'>
                        <Form.Item label="Show negative volume">
                        <Switch size="small" onChange={(show)=>{bulbShow(record.pocId-1, show)}} />
                        </Form.Item>

                        <Form.Item label="Negative volume color">
                        <ColorPicker color={bulbDefaultColor} enableAlpha={false} onClose={(c)=>{bulbColor(record.pocId-1, c.color)}} placement="topRight" />
                        </Form.Item>

                        <Form.Item label="Representation style">
                        <Select defaultValue="cartoon" onChange={(stl)=>{resStyle(record.residues,stl)}}>
                            <Select.Option value="cartoon">Cartoon</Select.Option>
                            <Select.Option value="sphere">Sphere</Select.Option>
                            <Select.Option value="stick">Stick</Select.Option>
                            <Select.Option value="line">Line</Select.Option>
                            <Select.Option value="surface">Surface</Select.Option>
                        </Select>
                        </Form.Item>
                    </Form>} showArrow={false} className="pocket-and-mouth">
                    </Collapse.Panel>
                    <Collapse.Panel header="Pocket Info" className="pocket-and-mouth">
                        {pocketResidueTableRender(record)}
                    </Collapse.Panel>
                    <Collapse.Panel header="Mouth Info" className="pocket-and-mouth" disabled={record['mouths'].length===0}>
                        {mouthInfoTableRender(record)}
                    </Collapse.Panel>
                </Collapse>
            );
        }

        const columns = [
            { title: 'Pocket ID', dataIndex: 'pocId', key: 'pocId', align:'center'},
            { title: <span>SASA (&#8491;<sup>2</sup>)</span>, dataIndex: 'sasa', key: 'sasa' , align:'center'},
            { title: <span>SAV (&#8491;<sup>3</sup>)</span>, dataIndex: 'sav', key: 'sav' , align:'center'},
            { title: <span>SESA (&#8491;<sup>2</sup>)</span>, dataIndex: 'sesa', key: 'sesa' , align:'center'},
            { title: <span>SEV (&#8491;<sup>3</sup>)</span>, dataIndex: 'sev', key: 'sev' , align:'center'},
            { title: 'Mouth Num', dataIndex: 'mouthNum', key: 'mouthNum' , align:'center'},
        ];

        const {measureInfo} = this.props;
        var MyTable;
        if(measureInfo===undefined||measureInfo.pending){
            MyTable = ()=>(<Table
                className="components-table-demo-nested"
                columns={columns}
                dataSource={null}
                pagination={false}
                loading={true}
            />)
        }
        else if(measureInfo.rejected){
            MyTable = ()=>(<Table
                className="components-table-demo-nested"
                columns={columns}
                dataSource={null}
                pagination={false}
            />)
        }
        else if(measureInfo.fulfilled){
            MyTable = ()=>(<Table
                className="components-table-demo-nested"
                columns={columns}
                expandedRowRender={pocketAndMouth}
                dataSource={measureInfo.value}
                //pagination={{ pageSize: 20 }}
                //scroll={{ y: 280 }}
                // key={record.pocId}
            />)
        }

        return (
            <Card title={measureTitle} bodyStyle={{padding:10}} id={this.props.id}>
                <MyTable/>
            </Card>
        );
    }
}


const mapStateToProps = state => ({
    searchid: state.router.location.search.slice(1),
    measureInfo: state.repository.measure,
    viewer: state.viewer.viewer,
});


export default connect(mapStateToProps)(MeasurePanel);
