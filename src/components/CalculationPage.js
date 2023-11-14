import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { Form, Upload, Button, Icon, Row, 
    Col,InputNumber,Input, Collapse, Checkbox, 
    message, Modal } from 'antd';
import { RootPath } from '../Settings';


class CalculationForm extends Component {
    state = {
        uploading: false,
        fileList:[],
    }
    popErrorMessage = (msg)=>{
        message.error((
            <div>
                {msg}
                <br/>
                Please contact <strong>uic.lianglab&#123;at&#125;gmail.com</strong> for further help
            </div>), 5);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var valuesToSubmit = null;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                valuesToSubmit = values
            }
            else{
                this.popErrorMessage(<div>Something is wrong!<br/>{err}</div>)
            }
        });
        
        if (valuesToSubmit){
            this.setState({ uploading: true, });
            var data = new FormData();
            // Note: both following not work. this is a logic flaw in antd
            // Now using "beforeupload" to setState with the selected file,
            //   and read the state here 
            // see https://github.com/ant-design/ant-design/issues/6983
            //data.append('file', this.props.form.getFieldValue('file')[0]);
            //data.append('file', valuesToSubmit.file[0], valuesToSubmit.file[0].name);
            data.append('file', this.state.fileList[0]);
            data.append('probe', valuesToSubmit.probe);
            data.append('email', valuesToSubmit.email||'N/A');
            data.append('hetatm', valuesToSubmit.hetatm);
            data.append('mostfreq', valuesToSubmit.mostfreq);

            let tmpthis = this;
            window.jQuery.ajax({
                type: "POST",
                //url: "http://sts.bioe.uic.edu/castp/dev/submit_calc.php",
                url: "submit_calc.php",
                data: data,
                processData: false,
                contentType: false,
                success: function (serverReturn) {
                    serverReturn = JSON.parse(serverReturn);
                    console.log(serverReturn)
                    if (serverReturn.success) {
                        Modal.success({
                                title: "Job submitted successfully!",
                                content: (//FIXME the link
                                    <div>
                                        <p>The jobid is <strong>{serverReturn.jobid}</strong>.</p>
                                        <p>
                                        Please allow minutes to hours for the job to be finished. <br/>
                                        Once the jobs is finished, you can check the results with this link <a href={RootPath+`search?${serverReturn.jobid}`}>{serverReturn.jobid}</a>  <br/>
                                        Results will also be sent to the email you provided. <br/>
                                        </p>
                                        <p>
                                        Your inputs: <br/>
                                        filename: {serverReturn.filename} <br/>
                                        probe: {serverReturn.probe} <br/>
                                        use hetatm as well: {serverReturn.hetatm} <br/>
                                        most frequent altLoc: {serverReturn.mostfreq} <br/>
                                        email: {serverReturn.email} <br/>
                                        </p>
                                    </div>
                                ),
                                cancelButtonProps: {
                                  hidden: true
                                },
                        })
                        tmpthis.props.form.resetFields();
                    }
                    else {
                        tmpthis.popErrorMessage(serverReturn.what);
                    }
                    tmpthis.setState({ uploading: false, });
                },
                error: function(jqxhr,err,what){
                    tmpthis.popErrorMessage(<div>{err+": "+what}</div>)
                    tmpthis.setState({ uploading: false, });
                }
            });
            
        }
    }

    checkFile = (rule, value, callback) => {
        if(value===undefined || value.length===0){
            callback('Please select your PDB file.');
            return;
        }
        if (value[0].size < 2000000) {
            callback();
        }
        else{
            callback('The file size shall be less than 2M.');
        } 
    }
    fileInList(file, fileList){
        var exists = false;
        fileList.forEach((f)=>{
            if(file.uid===f.uid){
                exists = true;
            }
        });
        return exists;
    }

    processUpload = (e) => {
        if (Array.isArray(e)) {
            console.log('herereerereeeeee')
            return e;
        }
        if (this.fileInList(e.file,e.fileList)){
            return e && [e.fileList[e.fileList.length-1]]
        }
        return e && e.fileList;
    }

    render() {
        const { uploading } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const uploadprops = {
            accept: '.pdb',
            beforeUpload: (file)=>{
                this.setState({fileList:[file]});
                return false;
            },
        };

        return (
            <Form onSubmit={this.handleSubmit}>

                <Form.Item
                    {...formItemLayout}
                    label="Upload"
                    extra="Upload a molecular structure in standard PDB format. 
                        All nonpolar H atoms will be ignored.
                        No multiple-model NMR structures allowed, 
                        The maximum file size allowed is 2M.
                        Try to remove unnecessary lines from your file if the size exceeds."
                >
                    {getFieldDecorator('file', {
                        rules: [
                            { validator: this.checkFile },
                        ],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.processUpload,
                    })(
                        <Upload {...uploadprops}  >
                            <Button>
                                <Icon type="upload" /> Select File
                             </Button>
                        </Upload>
                    )}
                </Form.Item>


                <Form.Item
                    {...formItemLayout}
                    label="Email"
                    extra="The results will be sent to you when the computation is finished."
                >
                    <Row>
                        <Col span={10}>
                            {getFieldDecorator('email',{
                                rules: [
                                    { type: 'email', message: 'Please enter a proper email address.' }
                                ],
                            })(
                                <Input  placeholder='your_email@com' />
                            )}
                        </Col>
                    </Row>
                </Form.Item>


                <Form.Item {...formItemLayout} label="Advanced options">
                    <Collapse bordered={false} >
                    <Collapse.Panel style={{border:0}} 
                        header={<span  className="ant-form-explain">
                        Change default settings. For advanced users.</span>}
                    >
                        <Form.Item
                            {...formItemLayout}
                            label="Probe radius"
                            extra="The default value used is 1.4 Å,
                                which approximates the radius of a water molecule. 
                                Only values between 0.0 and 10.0 will be accepted"
                        >
                            {getFieldDecorator('probe', { 
                                initialValue: 1.4,
                                rules:[
                                    {required:true, message: 'Please enter a probe radius.'},
                                    {type:'number', message: 'The probe radius must be a number.'},
                                ] 
                            })(
                                <InputNumber min={0} max={10} />
                            )}
                            <span className="ant-form-text"> Å </span>
                            {/* <span className="ant-form-text"> Angstroms</span> */}
                        </Form.Item>
                        <Form.Item
                            wrapperCol={ {span: 20} }
                            extra="Only ATOM records in the PDB file
                                are used in computation by default.
                                The HETATM records will be used as well
                                if this is checked."
                        >
                            {getFieldDecorator('hetatm', {
                                valuePropName: 'checked',
                                initialValue: false,
                            })(
                                <Checkbox>Include HETATM records</Checkbox>
                            )}
                        </Form.Item>

                        <Form.Item
                            wrapperCol={ {span: 20} }
                            extra="If alternative coordinates exist for an atom,
                            the one with the highest occupany will be used in computation 
                            by default. If this is unchecked, the first record of an atom
                            in the PDB file will be used."
                        >
                            {getFieldDecorator('mostfreq', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>Use most frequent alternative locations</Checkbox>
                            )}
                        </Form.Item>
                    </Collapse.Panel>
                    </Collapse>        
                </Form.Item>


                <Form.Item wrapperCol={{ span: 12, offset: 6 }} >
                    <Button type="primary" htmlType="submit"
                        onClick={this.handleSubmit}
                        loading={uploading}
                    >
                        {uploading ? 'Submitting' : 'Submit'}
                    </Button>
                </Form.Item>

                </Form>

        );
    }
}

const CalculationPage = Form.create()(CalculationForm);

export default CalculationPage;

