import React from 'react'
import { Row } from 'antd'
import { Link } from 'react-router-dom'
import { RootPath } from '../Settings';

const NoMatchPage = () => (
    <Row type='flex' justify='center' align='middle' style={{ 'minHeight': '200px' }}>
        <div>
            <h1>Oops! 404</h1>
            <br />
            The page you are looking for cannot be found.
        <br />
            <br />
            <Link to={RootPath}>Fly to Homepage</Link>
        </div>
    </Row>
);

export default NoMatchPage