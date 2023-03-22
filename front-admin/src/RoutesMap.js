import React, {Suspense} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {compose} from "redux";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import axios from "axios";
import PrivateRoute from "./PrivateRoute";
import * as links from "./constants/links";
import arrayRoutesPrivate from "./constants/routesPrivate";


const styles = {
    mainContent: {
        // background: '#f8f8ff',
        height: 'calc(100% - 50px)',
        padding: '0 1.875rem 1rem',
        overflow: 'auto',
        '&$adminContent': {
            // height: '100vh'
        },
        '&.notLogin': {
            height: 0,
            padding: 0
        },
        '&.pageError': {
            height: 0
        }
    },
    adminContent: {

    }
};

class RoutesMap extends React.Component {
    constructor(props) {
        super(props);
        // axios.interceptors.response.use(
        //     response => response,
        //     error => {
        //         if (error.response && error.response.status === 401) {
        //             localStorage.removeItem(DATA_USER)
        //             // window.location.href = links.HOME;
        //         } else if (error.response && error.response.status === 500) {
        //             this.props.history.push(links.PAGE500);
        //         }
        //         return Promise.reject(error);
        //     }
        // );
    }


    componentWillUnmount() {
        this.unlisten();
    }

    render() {

        const {classes,
            // history,
            location,
            dataUser,
            checkViewSidebarByGroup
        } = this.props;
        const groupCode = dataUser && dataUser.data && dataUser.data.group ? dataUser.data.group : null;
        const routesMap = arrayRoutesPrivate.filter((route) => {
          return true;
            // return dataUser &&  dataUser.data &&  dataUser.data.group && (!route.permission || route.permission.length<1 || (route.permission.length > 0  && route.permission.includes(groupCode)));
        }).map((route, index)=> {
            const component = route.component;
            return <PrivateRoute
                key={index}
                path={route.path}
                exact={route.exact}
                component={component}
                // history={history}
            />
        });


        return (
            <div>
                <Suspense fallback={<div>Loading</div>}>
                    <Switch>
                        {routesMap && routesMap.length >0 ? routesMap : ""}
                        {/*<Route exact={true} path="*" component={Page404} />*/}
                    </Switch>
                </Suspense>
            </div>
        );
    }
}

RoutesMap.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        dataUser: state.authReducer.dataUser,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
};

export default compose(connect(mapStateToProps,mapDispatchToProps),withRouter)(RoutesMap);
