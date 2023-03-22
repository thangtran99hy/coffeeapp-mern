import React, { useState } from "react";
import "./LayoutMenu.css";
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Button } from "antd";
import {
  ScheduleOutlined,
  HomeOutlined,
  BarsOutlined,
  TeamOutlined,
  UserOutlined,
  TableOutlined,
  ImportOutlined,
  ExportOutlined,
  ExperimentOutlined,
  BankOutlined,
  TagsOutlined,
  ShopOutlined,
  MenuOutlined,
  DatabaseOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import {Link, withRouter} from "react-router-dom";
import logo from "../../assets/images/logo.png";
import logoFull from "../../assets/images/logoFull.png";
import {compose} from "redux";
import {connect} from "react-redux";
import * as authActions from "./../../redux/actions/auth";
import {LINK_DIRECTORY_FILES, ROLE_ADMIN, ROLE_CASHIER, ROLE_INVENTORY_MANAGER} from "../../constants/constants";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class LayoutMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    }
  }
  onCollapse = (collapsed) => {
    this.setState({
      collapsed: collapsed
    })
  };

  render() {
    const { children, dataUser } = this.props;
    const {
      collapsed
    } = this.state;

    const menu = (
      <Menu>
        <Menu.Item>{dataUser.dataUser && dataUser.dataUser.email ? dataUser.dataUser.email : ""}</Menu.Item>
        <Menu.Item onClick={() => {
          this.props.setDataUser(null);
        }}>Đăng xuất</Menu.Item>
      </Menu>
    );
    const name = dataUser.dataUser && dataUser.dataUser.name ? dataUser.dataUser.name : "";
    const role = dataUser.dataUser && dataUser.dataUser.role ? dataUser.dataUser.role : "";
    const photo = dataUser.dataUser && dataUser.dataUser.photo ? dataUser.dataUser.photo : null;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div
            className="logo"
            style={collapsed ? { padding: "4px" } : { padding: "4px" }}
          >
            <img src={collapsed ? logo : logoFull} height={"60px"} />
          </div>
          <Menu theme="dark"  defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/">Trang chủ</Link>
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<ScheduleOutlined />}
              disabled={![ROLE_ADMIN, ROLE_CASHIER].includes(role)}
            >
              <Link to="/order">Quản lý đơn hàng</Link>
            </Menu.Item>
            <SubMenu
              key="sub3"
              icon={<MenuOutlined />}
              title="Quản lý sản phẩm"
              disabled={![ROLE_ADMIN].includes(role)}
            >
              <Menu.Item key="3" icon={<ProfileOutlined />}>
                <Link to="/product">Danh mục sản phẩm</Link>
              </Menu.Item>
              <Menu.Item key="10" icon={<TagsOutlined />}>
                <Link to="/typeProduct">Quản lý loại sản phẩm</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub1"
              icon={<DatabaseOutlined />}
              title="Quản lý kho"
              disabled={![ROLE_ADMIN, ROLE_INVENTORY_MANAGER].includes(role)}
            >
              <Menu.Item key="4" icon={<BarsOutlined />}>
                <Link to="/material">Quản lý nguyên liệu</Link>
              </Menu.Item>
              <Menu.Item key="5" icon={<ImportOutlined />}>
                <Link to="/material/import">Nhập nguyên liệu</Link>
              </Menu.Item>
              <Menu.Item key="6" icon={<ExportOutlined />}>
                <Link to="/material/export">Xuất nguyên liệu</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              icon={<ShopOutlined />}
              title="Quản lý cửa hàng"
              disabled={![ROLE_ADMIN].includes(role)}
            >
              <Menu.Item
                key="7"
                icon={<TableOutlined />}
                disabled={![ROLE_ADMIN].includes(role)}
              >
                <Link to="/store/table">Quản lý bàn</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item
              key="8"
              icon={<TeamOutlined />}
              disabled={![ROLE_ADMIN].includes(role)}
            >
              <Link to="/member">Quản lý thành viên</Link>
            </Menu.Item>
            <Menu.Item key="9" icon={<UserOutlined />}>
              <Link to="/account">Quản lý tài khoản</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header class="layout-menu-header">
            <div className="header-avatar">
              <Dropdown overlay={menu} placement="bottomRight" arrow>
                <Button
                  shape="circle"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  icon={photo ? <div style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    overflow: 'hidden'
                  }}>
                    <img style={{
                      width: '100%',
                      height: '100%'
                    }} src={LINK_DIRECTORY_FILES + photo} alt=""/>
                  </div>: <UserOutlined />}
                ></Button>
              </Dropdown>
            </div>
            <div className="header-name">{name}</div>
          </Header>
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360, height: "100%" }}
            >
              {children}
            </div>
          </Content>
          <Footer class="layout-menu-footer">Quản lý - Cafe cùng Tony Buổi Sáng</Footer>
        </Layout>
      </Layout>
    );
  }
}

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
)(LayoutMenu);
