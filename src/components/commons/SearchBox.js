import React, { Component } from 'react'
import { Form, Input, message } from 'antd'
import PropTypes from 'prop-types';
import { doSearch } from '../../containers/doSearch'
import {isValidId} from '../../IdUtils'

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 'size': 'small' }
        if (this.props.size !== undefined) {
            this.state.size = this.props.size
        }
    }
    handleSearch = (v, e) => {
        e.preventDefault();
        if (isValidId(v)) {
            this.props.form.resetFields();
            doSearch(v);
        }
        else{
            message.warning("Please specify a valid PDB or job id ");
        }
    }

    render = () => {
        const { getFieldDecorator } = this.props.form;
        return (
            getFieldDecorator('searchinput', {
                initialValue: '',
                rules:[]
            })(<Input.Search size={this.state.size}
                autoFocus={this.props.autoFocus}
                placeholder="input PDB, AF, or job id"
                onSearch={this.handleSearch}
            />)
        )
    };
}

SearchForm.propTypes = {
    size: PropTypes.string,
    autoFocus: PropTypes.bool,
};

const SearchBox = Form.create()(SearchForm);

export default SearchBox;
