import React, { Component } from "react";
import { Layout, Spin, Alert, Menu } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom"
import { RootPath } from "../../Settings";
const { Sider, Content } = Layout;
const MenuItem = Menu.Item;


class InfoLayout extends Component {

    render = () => {
        const { castpInfo, pathname, searchparam } = this.props;
        var MySider;
        var MyContent;

        if(castpInfo===undefined || castpInfo.pending){
            MySider = () => (<Spin ><Menu><MenuItem/></Menu></Spin>);
            MyContent = () => (<Spin />);
        }
        
        else if (castpInfo.rejected) {
            MySider = () => (<Menu><MenuItem>Contents</MenuItem></Menu>);
            MyContent = () => (<div><Alert message={castpInfo.reason.message} type="error" /></div>);
        }

        else if(castpInfo.fulfilled) {
            const mydata = castpInfo.value[pathname.slice(1)]
            // find active key
            var myDefaultSelectedKeys = [];
            var recIndex = 0
            const mysearchparam = searchparam.slice(1)
            for (var i = 0; i < mydata.length; i++) {
                if (mysearchparam === mydata[i].route) {
                    myDefaultSelectedKeys.push(mydata[i].id)
                    recIndex = i;
                    break;
                }
            }

            // prepare sider
            MySider = () => (
                <Menu defaultSelectedKeys={myDefaultSelectedKeys}>
                    {
                        mydata.map((rec) => (
                            <MenuItem key={rec.route}>
                                <Link to={RootPath+`${pathname.slice(1)}?${rec.route}`}>
                                    <strong>{rec.title}</strong>
                                </Link>
                            </MenuItem>
                        ))
                    }
                </Menu>);
            // prepare content
            console.log(mydata)
            MyContent = () => (
                <iframe src={RootPath+`${mydata[recIndex].path}`} title="CASTp Info" style={{'width':'100%','height':'100%','borderWidth':'0'}}/>
            );
        }

        return (
            <Layout>
                <Sider style={{background: '#ffffff'}}><MySider /></Sider>
                <Content style={{padding: '0 24px',background: '#ffffff'}}><MyContent /></Content>
            </Layout>
        )
    }
}


const mapStateToProps = state => ({
    castpInfo : state.repository.castpInfo,
    pathname: state.router.location.pathname.substring(
        state.router.location.pathname.lastIndexOf('/')),
    searchparam: state.router.location.search,
});
export default connect(mapStateToProps)(InfoLayout);