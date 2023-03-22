import React, {Suspense} from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import PropTypes from "prop-types";
import {compose} from "redux";
import {connect} from "react-redux";
import arrayRoutesPublic from "./constants/routePublic";
import PublicRoute from "./PublicRoute";
import * as authActions from "./redux/actions/auth";
import PrivateRoute from "./PrivateRoute";
import MainAppRoutes from './routers/MainAppRoute';
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const {
      classes,
      tReady,
      location,
      dataUser
    } = this.props;
    return (
      <div>
        <Switch>
          <div>
            <div>
              {arrayRoutesPublic.map(item => {
                return <PublicRoute
                  path={item.path}
                  exact={item.exact}
                  component={item.component}
                />;
              })}
              <PrivateRoute component={MainAppRoutes} path="*" exact />
            </div>
          </div>
        </Switch>
          </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    dataUser: state.authReducer.dataUser
  }
};
const mapDispatchToProps = (dispatch)=>{
  return {
    setDataUser: (dataUser) => dispatch(authActions.setDataUser(dataUser)),
  }
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(App);
