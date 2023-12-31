import React,{Component} from 'react'
import { Row, Col} from 'antd';
import { connect } from "react-redux";
import MolViewer from './Molviewer';
import ControlPanel from './ControlPanel'
import GeneralInfo from './GeneralInfo'
import MeasurePanel from './MeasurePanel';
import FeaturePanel from "./FeaturePanel";
import SequencePanel from './SequencePanel';
import ResultNotFound from './ResultNotFound';
// import PocketSimilarity from './PocketSimilarity';
import OnestepPocSimViewer from './OnestepPocSimViewer';


class ResultContent extends Component{
    constructor(props){
        super(props);
        this.generalref = React.createRef();
        this.measureref = React.createRef();
        this.seqref = React.createRef();
        this.featref = React.createRef();
        // this.pocsimi = React.createRef();
        this.onestepps = React.createRef();
    }
    render = ()=>{
        // console.log('RC')
        const shouldHidePanels = this.props.searchid.length === 15;
        return (
            <div>
                <Row type='flex' justify='space-around'>
                    <Col span={23}>
                        <GeneralInfo ref={this.generalref} />
                    </Col>
                    
                </Row>

                <Row type='flex' justify='space-around'>
                    <Col span={14}>
                        <MeasurePanel ref={this.measureref} /> 
                    </Col>
                    <Col span={8}>
                        <MolViewer searchid={this.props.searchid} />
                    </Col>
                </Row>

                <br/>
                <Row type='flex' justify='space-around'>
                    <Col span={23}>
                        <SequencePanel ref={this.seqref} />
                    </Col>
                </Row>
                {!shouldHidePanels && (
                <React.Fragment>
                <br/>
                <Row type='flex' justify='space-around'>
                    <Col span={23}>
                        <FeaturePanel ref={this.featref} />
                    </Col>
                </Row>

                {/* <br/>
                <Row type='flex' justify='space-around'>
                    <Col span={23}>
                        <PocketSimilarity ref={this.pocsimi} />
                    </Col>
                </Row> */}

                <br/>
                <Row type='flex' justify='space-around'>
                    <Col span={23}>
                        <OnestepPocSimViewer ref={this.onestepps} />
                    </Col>
                </Row>
                </React.Fragment>
                )}

                <ControlPanel refs={[
                    this.generalref,
                    this.measureref, 
                    this.seqref, 
                    // this.featref,
                    // this.pocsimi,
                    // this.onestepps
                    ...(!shouldHidePanels ? [this.featref, this.onestepps] : []),
                ]}/>{/**TODO change controlpanel to be automatic */}
                <ResultNotFound />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    searchid: state.router.location.search.slice(1),
});

export default connect(mapStateToProps)(ResultContent);