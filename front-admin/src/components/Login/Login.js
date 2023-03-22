import React, {Component} from "react";
import {Button, Form, Input, notification} from "antd";
import {connect} from 'react-redux';
import * as authActions from "../../redux/actions/auth";
import axiosClient from "../../api/axiosClient";
import cafe2 from "./../../assets/images/cafebg.jpg";
import "./Login.css";
import LoadingAction from "../../theme/LoadingAction";
class Login extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }
  openNotificationWithIcon = (type, text) => {
    notification[type]({
      message: "Thông báo",
      description: text
    });
  }
  onFinish = (values) => {
    this.setState({
      isLoading: true
    })
    axiosClient.post("api/auth/login", {
      "email": values.email,
      "password": values.password,
    })
      .then(res => {
        if (res.status === 200 && res.data && res.data.dataUser) {
          this.props.setDataUser(res.data);
          this.openNotificationWithIcon("success", "Đăng nhập thành công");
        } else {
          this.props.setDataUser(null);
          this.openNotificationWithIcon("error", "Có lỗi xảy ra");
        }
      })
      .catch(err => {
        this.props.setDataUser(null);
        if (err.response && err.response.data && err.response.data.message) {
          this.openNotificationWithIcon("error", err.response.data.message);
        } else {
          this.openNotificationWithIcon("error", "Có lỗi xảy ra");
        }
      })
      .finally(res => {
        this.setState({
          isLoading: false
        })
      })
  }
  render(){
    const {classes} = this.props;
    const {
      isLoading
    } = this.state;

    return (
      <div
        className="login-wrapper"
        style={{
          backgroundImage: `url("${cafe2}")`,
        }}
      >
        {isLoading && <LoadingAction textLoading={"Đang đăng nhập"}/>}
        <div className="login-form">
          <Form
            name="normal_login"
            className="login-form"
            onFinish={this.onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'Bạn nhập không đúng định dạng email!',
                },
                {
                  required: true,
                  message: 'Xin hãy nhập email của bạn!',
                },
              ]}
              initialValue={"dvcuong94@gmail.com"}
            >
              <Input placeholder="Địa chỉ email"/>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Xin hãy nhập mật khẩu!'
                }
              ]}
              initialValue={"12345678"}
            >
              <Input.Password placeholder="Mật khẩu"/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    dataUser: state.authReducer.dataUser
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDataUser: (dataUser) => dispatch(authActions.setDataUser(dataUser))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
