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


        const pocketResidueTableRender = (record) => {
            const columns = [
                { title: 'Chain', dataIndex: 'chain', key: 'chain', align:'center' },
                { title: 'Seq ID', dataIndex: 'seqId', key: 'seqId', align:'center' },
                { title: 'AA', dataIndex: 'aa', key: 'aa', align:'center' },
                { title: 'ATOM', dataIndex: 'atom', key: 'atom', align:'center' },
             ];

            return (
                <Table
                    columns={columns}
                    dataSource={record.atoms}
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

        const pocketAndMouth = (record) => {
            console.log(record)
            return (
                <Collapse bordered={false}>  
                    <Collapse.Panel header={ <Form layout='inline'>
                        <Form.Item label="Show negative volume">
                        <Switch size="small" onChange={(show)=>{bulbShow(record.id-1, show)}} />
                        </Form.Item>

                        <Form.Item label="Negative volume color">
                        <ColorPicker color={bulbDefaultColor} enableAlpha={false} onClose={(c)=>{bulbColor(record.id-1, c.color)}} placement="topRight" />
                        </Form.Item>

                        <Form.Item label="Representation style">
                        <Select defaultValue="cartoon" onChange={(stl)=>{resStyle(record.atoms,stl)}}>
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
                </Collapse>
            );
        }


        const columns = [
            { title: 'Pocket ID', dataIndex: 'id', key: 'id', align:'center'},
            { title: <span>Area(SA) (&#8491;<sup>2</sup>)</span>, dataIndex: 'area', key: 'area' , align:'center'},
            { title: <span>Volume(SA) (&#8491;<sup>3</sup>)</span>, dataIndex: 'vol', key: 'vol' , align:'center'},
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
