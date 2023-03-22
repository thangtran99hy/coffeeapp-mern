import React, {Component} from "react";
import {Button, Form, Input, notification, Upload} from "antd";
import * as demoAction from "../redux/actions/auth";
import {compose} from "redux";
import {connect} from "react-redux";
import LoadingAction from "../theme/LoadingAction";
import axiosClient from "../api/axiosClient";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {beforeUpload, getBase64} from "../functions/functions";
import {LINK_DIRECTORY_FILES, LINK_UPLOAD_PHOTO} from "../constants/constants";
class EditUser extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fileList: [],
            imageUrl: props.dataUser.dataUser.photo ?? null,
            loadingPhoto: false
        }
        this.onFinish = this.onFinish.bind(this);
        this.openNotificationWithIcon = this.openNotificationWithIcon.bind(this);
    }
    openNotificationWithIcon(type, text) {
        notification[type]({
            message: "Thông báo",
            description: text
        });
    }
    onFinish(values) {
        let {
            dataUser
        } = this.props;
        this.setState({
            isLoading: true
        })
        axiosClient.patch("api/user/" + dataUser.dataUser._id, {
            "name": values.name,
            "email": values.email,
            "password": values.password,
            "address" : values.address,
            "phone" : values.phone,
            "photo": this.state.imageUrl
        })
            .then(res => {
                this.setState({
                    isLoading: false
                })
                let dataUserUpdate = dataUser.dataUser;
                dataUserUpdate = {
                    ...dataUserUpdate,
                    ...res.data
                }
                dataUser.dataUser = dataUserUpdate;
                this.props.setDataUser(dataUser);
                this.openNotificationWithIcon("success", "Thay đổi thông tin thành công");
            })
            .catch(err => {
                this.setState({
                    isLoading: false
                })
                if (err.response && err.response.data && err.response.data.message) {
                    this.openNotificationWithIcon("error", err.response.data.message);
                } else {
                    this.openNotificationWithIcon("error", "Có lỗi xảy ra");
                }
            })
    }

    handleChangeAvatar = (info) => {
        this.setState({
            fileList: info.fileList
        })
        const that = this;
        if (info.file.status === "uploading") {
            that.setState({
                loadingPhoto: true
            })
            return;
        }
        if (info.file.status === "done") {
            getBase64(info.file.originFileObj, (imageUrl) => {
                that.setState({
                    imageUrl: info.file.response.photo,
                    loadingPhoto: false
                })
            });
        }
    };

    render(){
        const {dataUser} = this.props;
        const {
            isLoading,
            fileList,
            imageUrl,
            loadingPhoto
        } = this.state;
        let email = dataUser.dataUser.email ? dataUser.dataUser.email : "";
        let address = dataUser.dataUser.address ? dataUser.dataUser.address : "";
        let name = dataUser.dataUser.name ? dataUser.dataUser.name : "";
        let phone = dataUser.dataUser.phone ? dataUser.dataUser.phone : "";
        console.log(imageUrl)
        return (
            <div className="registration-form">
                {isLoading && <LoadingAction/>}
                <Form.Item name={"photo"} label="Ảnh đại diện">
                    <Upload
                        name="photo"
                        listType="picture-card"
                        className="avatar-uploader"
                        fileList={fileList}
                        showUploadList={false}
                        action={LINK_UPLOAD_PHOTO}
                        beforeUpload={beforeUpload}
                        onChange={this.handleChangeAvatar}
                    >
                        {imageUrl ? (
                            <img
                                src={
                                    LINK_DIRECTORY_FILES + imageUrl
                                }
                                alt="avatar"
                                style={{ width: "100%" }}
                            />
                        ) : (
                            <div>
                                {loadingPhoto ? <LoadingOutlined /> : <PlusOutlined />}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Xin hãy nhập tên của bạn!',
                            },
                        ]}
                        initialValue={name}
                    >
                        <Input placeholder="Tên"/>
                    </Form.Item>
                    <Form.Item
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: 'Xin hãy nhập địa chỉ của bạn!',
                            },
                        ]}
                        initialValue={address}
                    >
                        <Input placeholder="Địa chỉ"/>
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Xin hãy nhập số điện thoại của bạn!',
                            },
                        ]}
                        initialValue={phone}
                    >
                        <Input placeholder="Số điện thoại"/>
                    </Form.Item>
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
                        initialValue={email}
                    >
                        <Input placeholder="Địa chỉ email" disabled={true}/>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            style={{
                                backgroundColor: '#53382c',
                                borderColor: '#53382c'
                            }}
                        >
                            Cập nhật thông tin
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        dataUser: state.demo.dataUser
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDataUser: (dataUser) => dispatch(demoAction.setDataUser(dataUser))
    }
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(EditUser);
