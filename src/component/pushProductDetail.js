/**
 * @file 插件列表
 * @author ()
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {push} from 'react-router-redux';
import PropTypes from 'prop-types';

import Breadcrumb from '../../../../dep/ui/components/Breadcrumb';
import Button from '../../../../dep/ui/components/Button';
import Modal from '../../../../dep/ui/components/Modal';
import Toast from '../../../../dep/ui/components/Toast';

import * as pushProductDetailsActions from './PushProductDetailsRedux';

import RenderDetailFn from './DetailUl';
import {conf} from '../../../../conf';
import {util, getLog} from '../../Common/util';

import './PushProductDetails.less';

@connect(
    state => {
        return {
            userInfo: state.navList.modal.userInfo.data,
            instanceId: state.navList.modal.saveList.instance_id,
            pushProductDetails: state.pushProductDetails.pushProductDetails
        };
    },
    dispatch => {
        return {
            pushProductDetailsActions: bindActionCreators(pushProductDetailsActions, dispatch),
            push: bindActionCreators(push, dispatch)
        };
    }
)
export default class EquipmentManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cannotDel: false,
            deleteModal: false
        };
        this.urlArr = this.props.location.pathname.split('/');
        this.onDelectModalClick = this.onDelectModalClick.bind(this);

    }

    componentDidMount() {
        document.body.scrollTop = 0;
        const param = '?instance_id=' + this.props.instanceId;
        this.props.pushProductDetailsActions.detail(this.urlArr[2] + param);
        window._hmt.push(['_trackPageview', '/AppDetailsPage_View']);
    }

    componentWillReceiveProps(nextProps) {
        window.scrollTo(0, 0);
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.urlArr = nextProps.location.pathname.split('/');
            const param = '?instance_id=' + this.props.instanceId;
            this.props.pushProductDetailsActions.clearDetailData();
            this.props.pushProductDetailsActions.detail(this.urlArr[2] + param);
            window._hmt.push(['_trackPageview', '/AppDetailsPage_View']);
        }
        if (this.props.instanceId !== nextProps.instanceId) {
            this.props.push('/pushmanage');
            window._hmt.push(['_trackPageview', '/AppDetailsPage_View']);
        }
        if (nextProps.userInfo !== this.props.userInfo) {
            getLog(
                nextProps.userInfo.display_name,
                this.props.instanceId,
                '',
                'AppDetailsPage_View',
                'enter'
            );
        }
    }
    onDelectModalClick() {
        if (this.state.cannotDel) {
            // 不可删除
            this.setState({
                deleteModal: true
            });
            this.props.push('/pushmanage');
        }
        else {
            // 可删除
            const param = 'instance_id='
                + this.props.instanceId
                + '&flag=1'; // flag="0"：查询;flag="1"：删除;
            this.props.pushProductDetailsActions.deleteApplist(this.urlArr[2], param).then(data => {
                if (data && data.retcode === 0) {
                    this.setState({
                        deleteModal: true
                    });
                    this.props.push('/pushmanage');
                }
            });
        }
    }

    detailCallback = () => {
        this.props.pushProductDetailsActions.resetmsk(this.urlArr[2],
            'instance_id=' + this.props.instanceId).then(data => {
                if (data && data.retcode === 0) {
                    Toast.display({
                        type: 'success',
                        info: 'MasterSecret将于1分钟后生效',
                        delay: 3500
                    });
                }
            });
    }

    render() {
        let data;
        let tmp1 = this.props.pushProductDetails.detail;
        if (tmp1 && tmp1.result) {
            data = tmp1.result.list[0];
        }
        const viewBtnProps = {
            label: '查看集成指南',
            className: 'viewBtnProps',
            value: 'viewBtnProps',
            styleType: 'modal',
            onClick: () => {
                window._hmt.push(['_trackPageview', '/AppDetails_Integration']);
                window.open(conf.ipXtstWord);
                getLog(
                    this.props.userInfo.display_name,
                    this.props.instanceId,
                    'AppDetails_Integration',
                    'IntegrationPage_View',
                    'enter'
                );
                getLog(
                    this.props.userInfo.display_name,
                    this.props.instanceId,
                    'AppDetails_Integration',
                    'AppDetailsPage_View',
                    'left'
                );
            }
        };
        const deleteBtnProps = {
            label: '删除应用',
            className: 'deleteBtnProps',
            value: 'deleteBtnProps',
            styleType: 'ghost',
            onClick: () => {
                window._hmt.push(['_trackPageview', '/AppDetails_DeleteApp']);
                const param = 'instance_id='
                    + this.props.instanceId
                    + '&flag=0'; // flag="0"：查询;flag="1"：删除;
                this.props.pushProductDetailsActions.deleteApplist(this.urlArr[2], param).then(data => {
                    if (data && data.retcode === 0) {
                        this.setState({
                            deleteModal: true,
                            cannotDel: false
                        });
                    }
                    else if (data && data.retcode !== 0) {
                        this.setState({
                            deleteModal: true,
                            cannotDel: true
                        });
                    }
                });
            }
        };

        return <div className="second-con">
            <Breadcrumb>
                <Breadcrumb.Item><a>应用详情</a></Breadcrumb.Item>
            </Breadcrumb>
            {/* <p className="page-title">基本信息</p> */}

            {data && <div className="push-detail-content">
                <RenderDetailFn
                    data={data}
                    isDemo={this.urlArr[2] === util.demoAppKey}
                    callBack={this.detailCallback}
                />

                {
                    this.urlArr[2] !== util.demoAppKey
                    && <div className="button" style={{marginTop: '2px', marginLeft: '162px'}}>
                        <Button {...viewBtnProps} />
                        <Button {...deleteBtnProps} />
                    </div>
                }

            </div>}

            <Modal
                title={this.state.cannotDel ? '无法删除' : '确认删除吗？'}
                warningType
                buttonReverse
                buttonType={0}
                maskClosable={false}
                CancelText={'取消'}
                classPrefix={'spui'}
                okText={this.state.cannotDel ? '前往消息列表' : '删除'}
                className={'spui-modal-other'}
                onOk={this.onDelectModalClick}
                onCancel={() => {
                    this.setState({
                        deleteModal: false
                    });
                }}
                visible={this.state.deleteModal}
            >
                {
                    this.state.cannotDel
                        ? <div className="module-content-style">
                            {this.props.pushProductDetails.deleteApplist.message}
                        </div>
                        : <div className="module-content-style">
                            删除应用后，将无法再向用户推送应用通知，透传消息等，请谨慎操作！
                        </div>
                }
            </Modal>
        </div>;
    }
}
EquipmentManage.propTypes = {
    location: PropTypes.object,
    instanceId: PropTypes.number,
    userInfo: PropTypes.object,
    push: PropTypes.func,
    pushProductDetailsActions: PropTypes.object,
    pushProductDetails: PropTypes.object
};
