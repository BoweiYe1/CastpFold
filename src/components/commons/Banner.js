import React, { Component } from 'react'
import { Card, Row, Col, Breadcrumb, Affix, Alert, Icon } from 'antd'
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import logo from '../../icon.png'
import SearchBox from './SearchBox';
import './Banner.css'
import { RootPath } from '../../Settings';

//------------------- Breadcrumb --------------------
/*
const breadcrumbNameMap = {
    '/search': 'Search',
    '/compute': 'Computation',
    '/about': 'About',
    '/news': 'News',
    '/404': 'Page not found',
    '/': 'CASTp'
};
*/
const breadcrumbNameMap = {};
breadcrumbNameMap[RootPath+'search']= 'Search';
breadcrumbNameMap[RootPath+'compute']= 'Computation';
breadcrumbNameMap[RootPath+'about']= 'About';
breadcrumbNameMap[RootPath+'news']= 'News';
breadcrumbNameMap[RootPath+'404']= 'Page not found';
breadcrumbNameMap[RootPath+'']= 'CASTp';

const MyBreadCrumb = ({ pathname }) => {
    //const snippets = [pathname.slice(0, 1)]
    const snippets = [pathname.slice(0, RootPath.length)]
    if (pathname.length > RootPath.length) {
        snippets.push(pathname);
    }
    const crumbs = snippets.map((snip) => (
        <Breadcrumb.Item key={snip}>
            <Link to={snip}>
                {breadcrumbNameMap[snip]}
            </Link>
        </Breadcrumb.Item>
    ))

    return (
        <Breadcrumb>
            {crumbs}
        </Breadcrumb>
    );
}

const Citation = ()=>{
    const msg = (
        <div>
            Your citation is really imortant for us. Please cite this paper if you publish or present results using CASTp analysis:
            <strong>
            <center>Tian et al., Nucleic Acids Res. 46(W1): W363–W367, 2018. <br/>
            PMID: <a target='_blank' rel="noopener noreferrer" href="https://www.ncbi.nlm.nih.gov/pubmed/29860391">29860391</a> DOI: <a target='_blank' rel="noopener noreferrer" href="https://doi.org/10.1093/nar/gky473">10.1093/nar/gky473</a>.</center>
            </strong>
        </div>
    )
    return (
        <Alert message={msg} type="info" showIcon />
    );
}

//------------------- SubBanner --------------------
const SubBannerToConnect = ({ pathname }) => {
    if (pathname === RootPath || pathname === RootPath.slice(0,-1)) {
        return (<Row />)
    }
    else {
        return (
            <Row type='flex' justify='space-between' className="subbanner">
                {/* <Col><MyBreadCrumb pathname={pathname} /></Col> */}
                <Col>
                    <Breadcrumb separator='  '>
                        <Breadcrumb.Item><Link to={RootPath}>Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={RootPath+'compute'}>Compute</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={RootPath+'news'}>News</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={RootPath+'about'}>About</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <SearchBox />
                </Col>
            </Row>
        )
    }
}
const mapStateToProps = state => ({
    pathname: state.router.location.pathname,
});
const SubBanner = connect(mapStateToProps)(SubBannerToConnect);


//------------------- BannerTitle --------------------

const BannerTitle = (
    <Link to={RootPath} className='bannerlink'>
        <Row type='flex' align='middle'>
            <Col>
                <img src={logo} alt="CASTp" style={{ 'height': '80px' }} />
            </Col>
            <Col span={1} />
            <Col>
                <div style={{ 'fontSize': '40px' }}>
                    CASTp
            </div>
                <div style={{ 'fontSize': '20px' }}>
                    <u>C</u>omputed <u>A</u>tlas of <u>S</u>urface <u>T</u>opography of <u>p</u>roteins
            </div>
            </Col>
        </Row>
    </Link>
)



//------------------- real Banner --------------------

class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = { affixed: false }
    }
    render = () => {
        return (
            <Card bordered={false}>
                {BannerTitle}
                <Affix offsetTop={0}>
                    <SubBanner />
                </Affix>
                <br/>
                <Row type='flex' justify='center'>
                    <Col><Citation /></Col>
                </Row>
            </Card>
        );

    }
}


export default Banner;
