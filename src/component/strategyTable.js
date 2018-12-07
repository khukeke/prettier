/**
 * @file 激活唤醒表格
 * @author hukeke01
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {push} from 'react-router-redux';

import Table from 'antd/lib/table';
import Input from 'antd/lib/input';
import Popconfirm from 'antd/lib/popconfirm';
import Popover from 'antd/lib/popover';
import Select from 'antd/lib/select';
// import message from 'antd/lib/message';

import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import {connect} from 'react-redux';
import * as ruleControlStrategyActions from '../RuleControlStrategy/RuleControlStrategyRedux';
import {userPermitions} from '../../common';
import 'antd/lib/table/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/popover/style/index';
// import 'antd/lib/message/style/index';
import 'antd/lib/form/style/index';
import 'antd/lib/button/style/index';
// import 'antd/lib/popconfirm/style/index.css';
import 'antd/lib/popconfirm/style/index';

import Toast from '../dep/ui/components/Toast';
const Option = Select.Option;
const FormItem = Form.Item;

const EditableInputCell = ({editable, value, isDefault, onChange, onBlur}) => (
    <div>
        {editable
            ? <Input
                style={{margin: '-5px 0'}}
                value={value}
                onChange={e => onChange(e.target.value)}
                onBlur={e => onBlur(e.target.value)}
            />
            : <span className={isDefault ? '' : 'colorYellow'}>{value}</span>
        }
    </div>
);

const EditableSelectCell = ({editable, value, isDefault, onChange}) => {
    return <div>
        {editable
            ? <Select defaultValue={value + ''} onChange={onChange}>
                <Option value='0'>不执行</Option>
                <Option value='1'>执行</Option>
            </Select>
            : <span className={isDefault ? '' : 'colorYellow'}>{value ? '执行' : '不执行'}</span>
        }
    </div>;
};

connect(
    state => {
        return {
            nav: state.nav.nav,
            ruleControlStrategy: state.ruleControlStrategy.ruleControlStrategy
        };
    },
    dispatch => ({
        ruleControlStrategyActions: bindActionCreators(ruleControlStrategyActions, dispatch),
        push: bindActionCreators(push, dispatch)
    })
)
export default class StrategyTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            initSelectProduct: [],
            temAdd: {},
            isAddRow: false,
            category: [
                'master_activate_count',
                'activate_interval',
                'activate_perform_total_count',
                'activate_delay_time',
                'app_activate_count',
                'activate_priority',
                'activate_total_count',
                'noti_show_count',
                'noti_show_interval',
                'activated_interval',
                'do_activate_pr',
                'do_activity',
                'pre_activate_stop_time',
                'to_back_activate',
                'to_back_delay',
                'to_front_activate',
                'to_front_delay',
                'do_limit'
            ]
        };
        this.cacheData = [];
        this.validateTemp = [];
    }
    componentWillReceiveProps(nextProps) {
        const temAdd = this.state.temAdd.id ? this.state.temAdd : '';
        let temData = [];
        if (this.state.temAdd.id) {
            temData = [temAdd, ...nextProps.data];

        } else {
            temData = [...nextProps.data];
        }
        // const temData = [temAdd, ...nextProps.data]
        // this.setState({data: nextProps.data, initSelectProduct: nextProps.initSelectProduct})
        this.setState({data: temData, initSelectProduct: nextProps.initSelectProduct});
        this.cacheData = nextProps.data.map(item => ({...item}));
        this.validateTemp = nextProps.data.map(item => ({...item}));
    }

    renderInputColumns(text, record, column) {
        const isDefault = this.compareValue(this.handleValue(text, column), column);
        return (
            <EditableInputCell
                editable={record.editable}
                value={text}
                isDefault = {isDefault}
                onChange={value => this.handleChange(value, record.id, column)}
                onBlur={value => this.handleBlur(value, record.id, column)}
            />
        );
    }
    renderSelectColumns(text, record, column) {

        const isDefault = this.compareValue(text, column);
        return (
            <EditableSelectCell
                editable={record.editable}
                value={text}
                isDefault = {isDefault}
                onChange={value => this.handleChange(value, record.id, column)}
            />
        );
    }
    handleChange(value, id, column) {
        const newData = [...this.state.data];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
            target[column] = this.handleValue(value, column);
            this.setState({data: newData});
        }
    }
    handleBlur(value, id, column) {
        const newData = [...this.state.data];
        let target = [];
        const validateStatus = this.validateCheck(value, column);
        if (id) {
            target = newData.filter(item => id === item.id)[0];
            if (!validateStatus) {
                Toast.display({
                    type: 'danger',
                    info: this.validateMsg()[column],
                    delay: 3500
                });
                if (target) {
                    Object.assign(target, this.validateTemp.filter(item => id === item.id)[0]);
                    this.setState({data: newData});
                }
            }
            if (target && validateStatus) {
                target[column] = this.handleValue(value, column);
                this.setState({data: newData});
                this.validateTemp = newData.map(item => ({...item}));
            }
        }
    }
    validateCheck(value, column) {
        let formValidate = {
            // 整数
            positiveInteger() {
                let reg = /^(0|([1-9]\d*))$/;
                return reg.test(value);
            },
            // 从0-3的正整数
            from0To3() {
                let reg = /^([0-3])$/;
                return reg.test(value);
            },
            from0To30() {
                let reg = /^30$|^(\d|[0-2]\d)$/;
                return reg.test(value);
            },
            // 小于百万的正整数
            lessThanTenBillion() {
                return this.positiveInteger() && value <= 10000000000;
            },
            // 可显示四位小数点，且小于一亿
            fourPoint() {
                let reg = /^\d+(\.\d{1,4})?$/;
                return reg.test(value) && value <= 1000000000;
            },
            // 1-14400
            from1ToNum() {
                return this.positiveInteger() && value <= 14400 && value >= 1;
            },
            // 可显示2位小数点 且从0-14400
            from0ToNum() {
                // return this.positiveInteger() && value <= 14400 && value >= 0;
                return  value <= 14400 && value >= 0;
            },
            from0ToHan() {
                return value <= 100 && value >= 0;
            },
            from0ToTenThous() {
                return value <= 10000 && value >= 0;
            },
            from0ToThous() {
                return value <= 1000 && value >= 0;
            },
            from1ToHanThous() {
                return this.positiveInteger() && value <= 100000 && value >= 1;
            }
        };
        const columnValidate = {
            'master_activate_count': () => formValidate.from0To3(),
            'activate_interval': () => formValidate.from1ToNum(),
            'activate_perform_total_count': () => formValidate.lessThanTenBillion(),
            'activate_delay_time': () => formValidate.from1ToNum(),
            'do_activate_pr': () => formValidate.from0ToHan(),
            'to_back_delay': () => formValidate.from0ToTenThous(),
            'to_front_delay': () => formValidate.from0ToTenThous(),
            'app_activate_count': () => formValidate.from0To30(),
            'activated_interval': () => formValidate.from1ToNum(),
            'activate_priority': () => formValidate.from0ToTenThous(),
            'pre_activate_stop_time': () => formValidate.from0ToNum(),
            'activate_total_count': () => formValidate.lessThanTenBillion(),
            'do_limit': () => formValidate.from0ToThous(),
            'noti_show_count': () => formValidate.from0To30(),
            'noti_show_interval': () => formValidate.from1ToHanThous()
        };
        if (columnValidate[column] === undefined) {
            return true;
        }
        return columnValidate[column]();
        // if (column === 'master_activate_count') {
        //     // 执行激活（次/日/设备）
        //     return formValidate.from0To3();
        // } else if (column === 'activate_interval') {
        //     // 激活间隔
        //     return formValidate.from1ToNum();
        // } else if (column === 'activate_perform_total_count') {
        //     // 执行激活总数（次/日）
        //     return formValidate.lessThanTenBillion();
        // } else if (column === 'activate_delay_time') {
        //     // 启动延时（分）
        //     return formValidate.from1ToNum();
        // } else if (column === 'do_activate_pr') {
        //     // 亮屏前台激活概率（%）
        //     return formValidate.from0ToHan();
        // } else if (column === 'to_back_delay') {
        //     // 前台转后台延时（秒）
        //     return formValidate.from0ToTenThous();
        // } else if (column === 'app_activate_count') {
        //     // 被激活（次/日/设备）
        //     return formValidate.from0To30();
        // } else if (column === 'activated_interval') {
        //     // 被激活间隔(分)
        //     return formValidate.from1ToNum();
        // } else if (column === 'activate_priority') {
        //     // 被激活优先级
        //     return formValidate.from0ToTenThous();
        // } else if (column === 'pre_activate_stop_time') {
        //     // 激活前强停（小时）
        //     return formValidate.from1ToNum()
        // } else if (column === 'activate_total_count') {
        //     // 被激活总数（次/日）
        //     return formValidate.lessThanTenBillion();
        // } else if (column === 'do_limit') {
        //     // 可优先被激活上限（次/日/设备）
        //     return formValidate.from0ToThous()
        // } else if (column === 'noti_show_count') {
        //     // 通知展示（次/日/设备）
        //     return formValidate.from0To30()
        // } else if (column === 'noti_show_interval') {
        //     // 通知展示间隔（分）
        //     return formValidate.from1ToHanThous()
        // } else {
        //     return true;
        // }
    }
    // 校验提示信息
    validateMsg() {
        return {
            'master_activate_count': '请输入0-3的整数',
            'activate_interval': '请输入1-14400的整数',
            'activate_perform_total_count': '请输入整数，且不可超过10亿',
            'activate_delay_time': '请输入1-14400的整数',
            'do_activate_pr': '请输入0-100的数字',
            'to_back_delay': '请输入0-10000的数字',
            'to_front_delay': '请输入0-10000的数字',
            'app_activate_count': '请输入0-30的整数',
            'activated_interval': '请输入1-14400的整数',
            'activate_priority': '请输入0-10000的数字',
            'pre_activate_stop_time': '请输入0-14400的数字，保留两位小数',
            'activate_total_count': '请输入整数，且不可超过10亿',
            'do_limit': '请输入0-1000的数字',
            'noti_show_count': '请输入0-30的整数',
            'noti_show_interval': '请输入1-100000的整数'
        };
    }
    handleValue(value, column) {
        switch (column) {
            case 'activate_delay_time':
                return value * 60;
            case 'activate_interval':
                return value * 60;
            case 'pre_activate_stop_time':
                // return Number(value * 3600.0);
                return Math.floor(parseFloat(value * 3600));
            case 'activated_interval':
                return value * 60;
            case 'do_activate_normal':
                return Number(value) === 1 ? 100 : 200;
            case 'do_activate_front':
                return Number(value) === 1 ? 1 : 0;
            case 'do_activate_offscreen':
                return Number(value) === 1 ? 1000 : 2000;
            default:
                return value;
        }
    }
    edit(id) {
        const newData = [...this.state.data];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
            target.editable = true;
            this.setState({data: newData});
        }
    }
    // do_activate由于后端返回的一个字段控制3个状态，需要单独处理
    handleDoActive(target) {
        // 亮屏前台激活
        const doActivateFront = target.do_activate_front === undefined
            ? target.do_activate % 2
            : target.do_activate_front % 2;
         //  亮屏激活
        const doActivateNormal = target.do_activate_normal === undefined
            ? Math.floor(target.do_activate / 100) % 2
            : Math.floor(target.do_activate_normal / 100) % 2;
        // 灭屏前台激活
        const doActivateOffscreen = target.do_activate_offscreen === undefined
            ? Math.floor(target.do_activate / 1000) % 2
            : Math.floor(target.do_activate_offscreen / 1000) % 2;
        const doActivate = (doActivateFront === 1 ? 1 : 0)
            + (doActivateNormal === 1 ? 100 : 200)
            + (doActivateOffscreen === 1 ? 1000 : 2000);
        return doActivate;
    }
    formatterData(target) {
        const doActivate = this.handleDoActive(target);
        let temTarget = 'app_activate_count=' + target.app_activate_count
                + '&activate_priority=' + target.activate_priority
                + '&master_activate_count=' + target.master_activate_count
                + '&activate_total_count=' + target.activate_total_count
                + '&activate_perform_total_count=' + target.activate_perform_total_count
                + '&noti_show_count=' + target.noti_show_count
                + '&noti_show_interval=' + target.noti_show_interval
                + '&activate_delay_time=' + target.activate_delay_time
                + '&activate_interval=' + target.activate_interval
                + '&pre_activate_stop_time=' + target.pre_activate_stop_time
                + '&activated_interval=' + target.activated_interval
                + '&do_activate=' + doActivate
                + '&do_activate_pr=' + target.do_activate_pr
                + '&do_activity=' + target.do_activity
                + '&to_back_activate=' + target.to_back_activate
                + '&to_back_delay=' + target.to_back_delay
                + '&to_front_delay=' + target.to_front_delay
                + '&do_limit=' + target.do_limit
                + '&to_front_activate=' + target.to_front_activate;
        return {
            temTarget: temTarget,
            doActivate: doActivate
        };
    }

    // 比较当前值和默认值是否全部一样，如果一样则false
    checkSaveDefault(target) {
        const category = this.state.category;
        let flag = true;
        const addData = this.defaultData();
        category.forEach(e => {
            if (!this.compareValue(target[e], e)) {
                flag = false;
            }
        });
        // 针对do_activate由于后端返回的一个字段控制3个状态，需要单独处理
        const doActivate = this.handleDoActive(target);
        if (!this.compareValue(doActivate, 'do_activate')) {
            flag = false;
        };
        return flag;
    }

    // 检测如果数据不合法则返回false
    checkSaveVertify(target) {
        const category = this.state.category;
        let flag = true;
        category.forEach(e => {
            let init = target[e];
            if (e === 'pre_activate_stop_time') {
                // init = parseFloat((init / 3600).toFixed(3));
                init = (init / 3600).toFixed(2);
            }
            if (!this.validateCheck(init, e)) {
                flag = false;
            }
        });
        return flag;
    }
    save(id) {
        const temAdd = this.state.temAdd;
        const newData = [...this.state.data];
        const target = newData.filter(item => id === item.id)[0];
        const fromData = this.formatterData(target);
        if (target) {
            if (this.checkSaveDefault(target)) {
                Toast.display({
                    type: 'danger',
                    info: '未修改默认配置',
                    delay: 3500
                });
                return false;
            }
            if (id === 'unique') {  // 新建
                const appName = temAdd.app_name;
                if (!appName) {
                    Toast.display({
                        type: 'danger',
                        info: '未选择应用',
                        delay: 3500
                    });
                    return false;
                }
                if (!this.checkSaveVertify(target)) {
                    Toast.display({
                        type: 'danger',
                        info: '请检查参数',
                        delay: 3500
                    });
                    return false;
                }
                let fromData = this.formatterData(temAdd);
                fromData.temTarget += '&product=' + Number(temAdd.app_name);
                this.props.ruleControlStrategyActions.addListData(fromData.temTarget).then(data => {
                    if (data && data.retcode === 0) {
                        this.setState({
                            isAddRow: false,
                            temAdd: {}
                        });
                        Toast.display({
                            type: 'success',
                            info: '添加成功',
                            delay: 3500
                        });
                        this.props.initFresh();
                    } else {
                        this.setState({
                            data: [temAdd, ...this.cacheData]
                        });
                        // this.setState({
                        //     isAddRow: false,
                        // });
                        return false;
                    }
                });
            } else {
                this.props.ruleControlStrategyActions.editListData(id, fromData.temTarget).then(data => {
                    if (data && data.retcode === 0) {
                        delete target.editable;
                        // target.do_activate = fromData.doActivate;
                        target['do_activate'] = fromData.doActivate;
                        this.setState({data: newData});
                        this.cacheData = newData.map(item => ({...item}));
                        Toast.display({
                            type: 'success',
                            info: '修改成功',
                            delay: 3500
                        });
                    }
                });
            }
        }
    }

    // todo ,删除操作后对表格页数的处理
    deleteItem(id) {
        const newData = [...this.state.data];
        const target = newData.filter(item => id !== item.id);
        this.props.ruleControlStrategyActions.deleteData(id).then(data => {
            if (data && data.retcode === 0) {
                this.setState({isAddRow: false, temAdd: {}});
                Toast.display({
                    type: 'success',
                    info: '删除成功',
                    delay: 3500
                });
                this.props.delectFn(data);
                // this.setState({data: target});
                // this.props.initFresh();
            } else {
                Toast.display({
                    type: 'danger',
                    info: '删除失败',
                    delay: 3500
                });
            }
        });
    }
    cancel(id) {
        const newData = [...this.state.data];
        let target = [];
        if (id === 'unique') {
            // 新建时取消按钮
            target = newData.filter(item => id !== item.id);
            if (target) {
                delete target.editable;
                this.setState({data: target, isAddRow: false, temAdd: {}});
                this.cacheData = target.map(item => ({...item}));
            }
        } else {
            // 修改时取消按钮
            target = newData.filter(item => id === item.id)[0];
            if (target) {
                Object.assign(target, this.cacheData.filter(item => id === item.id)[0]);
                delete target.editable;
                this.setState({data: newData});
                this.validateTemp = this.props.data.map(item => ({...item}));
            }
        }
    }
    defaultData() {
        const result = this.props.ruleControlStrategy.detailListDataDefault.result;
        let addData = {};
        if (result && result.list[0]) {
            const list = result.list[0];
            addData = {
                editable: true,
                isAddCurrent: true,
                'app_activate_count': list.app_activate_count,
                'activate_priority': list.activate_priority,
                'master_activate_count': list.master_activate_count,
                'activate_total_count': list.activate_total_count,
                'activate_perform_total_count': list.activate_perform_total_count,
                'noti_show_count': list.noti_show_count,
                'noti_show_interval': list.noti_show_interval,
                'activate_delay_time': list.activate_delay_time,
                'activate_interval': list.activate_interval,
                'pre_activate_stop_time': list.pre_activate_stop_time,
                'activated_interval': list.activated_interval,
                'do_activate': list.do_activate,
                'do_activate_pr': list.do_activate_pr,
                'do_activity': list.do_activity,
                'to_back_activate': list.to_back_activate,
                'to_back_delay': list.to_back_delay,
                'to_front_delay': list.to_front_delay,
                'do_limit': list.do_limit,
                'to_front_activate': list.to_front_activate
            };
        }
        return addData;
    }
    compareValue(init, cate) {
        const addData = this.defaultData();
        if (cate === 'do_activate_normal') {
            return Number(init) === Math.floor(addData['do_activate'] / 100) % 2;
        } else if (cate === 'do_activate_front') {
            return Number(init) === addData['do_activate'] % 2;
        } else if (cate === 'do_activate_offscreen') {
            return Number(init) === Math.floor(addData['do_activate'] / 1000) % 2;
        }
        return Number(init) === addData[cate];
    }

    handleAdd() {
        const newData = [...this.state.data];
        const addData = this.defaultData();
        addData.id = 'unique'; // 给新增的行默认id值
        this.setState({
            data: [addData, ...newData],
            temAdd: addData,
            isAddRow: true
        });
        this.cacheData = [addData, ...newData].map(item => ({...item}));
        this.validateTemp = [addData, ...newData].map(item => ({...item}));
    }

    handleAppNameChange(value) {
        const temAdd = this.state.temAdd;
        temAdd['app_name'] = value;
        this.setState({temAdd});
    }
    setAppName(text, record) {
        const {initSelectProduct, isAddRow} = this.state;
        if (record && record.isAddCurrent) {
            return <Select
                showSearch
                placeholder="请选择"
                optionFilterProp="children"
                style={{width: 170}}
                onChange={this.handleAppNameChange.bind(this)}
            >
                {
                    initSelectProduct.map((v, k) => {
                        return v.t === 0  ? <Option value={v.name + ''} key={v.name}>{v.value}</Option>
                            : <Option value={v.name + ''} key={v.name}>[测试]{v.value}</Option>;
                    })
                }
            </Select>;
        }
        let titleContext = <div><p>包名：dddd;</p><p>关联包名：dddd</p></div>;
        if (record.slave_pkgs && record.slave_pkgs.length > 0) {
            titleContext = (<div>
                <p>包名：{record.pkg}</p>
                <p>关联包名：</p>
                {
                    record.slave_pkgs.map((v, k) => {
                        return <p key={k}>{v}</p>;
                    })
                }
            </div>);
        } else {
            titleContext = <p>{record.pkg}</p>;
        }
        return <Popover content={titleContext}>
            <div>
                {/* <p>{text}</p> */}
                <p>
                    {
                        record.t === 0
                            ? `${text}`
                            : `[测试]${text}`
                    }
                </p>
                {
                    record.slave_pkgs && !!record.slave_pkgs.length
                    && <p className="blueword pointer"
                        onClick={() => {
                            this.props.push('/productline/'
                                + record.productline_id
                                + '/'
                                + record.product_id
                                + '/productDetail');
                        }}
                    >
                        <span className="float-left">共{record.slave_pkgs.length}个关联包名</span>
                        <img
                            className="jump-icon float-left"
                            src={require('../../resource/images/icon_btn_next_step.svg')}
                        />
                    </p>
                }
            </div>
        </Popover>;
    }
    getColumns() {
        const userPermi = this.props.nav.userList.result
            && userPermitions(this.props.nav.userList.result.list[0].permitions);
        let columns = [
            {
                title: '产品名',
                dataIndex: 'app_name',
                key: 'app_name',
                width: 200,
                fixed: 'left',
                render: (text, record) => {
                    return this.setAppName(text, record);
                }
            }, {
                title: '激活频次',
                children: [{
                    title: '执行激活（次/日/设备）',
                    dataIndex: 'master_activate_count',
                    key: 'master_activate_count',
                    width: 80,
                    render: (text, record) => {
                        return this.renderInputColumns(text, record, 'master_activate_count');
                    }
                }, {
                    title: '激活间隔',
                    dataIndex: 'activate_interval',
                    key: 'activate_interval',
                    width: 60,
                    render: (text, record) => {
                        const tempText = text / 60;
                        return this.renderInputColumns(tempText, record, 'activate_interval');
                    }
                }, {
                    title: '执行激活总数（次/日）',
                    dataIndex: 'activate_perform_total_count',
                    key: 'activate_perform_total_count',
                    width: 120,
                    render: (text, record) => {
                        return this.renderInputColumns(text, record, 'activate_perform_total_count');
                    }
                }, {
                    title: '启动延时（分）',
                    dataIndex: 'activate_delay_time',
                    key: 'activate_delay_time',
                    width: 80,
                    render: (text, record) => {
                        const tempText = text / 60;
                        return this.renderInputColumns(tempText, record, 'activate_delay_time');
                    }
                }]
            }, {
                title: '激活场景',
                children: [{
                    title: '亮屏激活',
                    dataIndex: 'do_activate',
                    key: 'do_activate_normal',
                    width: 90,
                    render: (item, record) => {
                        const text = Math.floor(item / 100) % 2;
                        return this.renderSelectColumns(text, record, 'do_activate_normal');
                    }
                }, {
                    title: '亮屏前台激活',
                    dataIndex: 'do_activate',
                    key: 'do_activate_front',
                    width: 90,
                    render: (item, record) => {
                        const text = item % 2;
                        return this.renderSelectColumns(text, record, 'do_activate_front');
                    }
                }, {
                    title: '亮屏前台激活概率（%）',
                    dataIndex: 'do_activate_pr',
                    key: 'do_activate_pr',
                    width: 80,
                    render: (text, record) => {
                        return this.renderInputColumns(text, record, 'do_activate_pr');
                    }
                }, {
                    title: '亮屏前台activity激活',
                    dataIndex: 'do_activity',
                    key: 'do_activity',
                    width: 90,
                    render: (item, record) => {
                        const text = item % 2;
                        return this.renderSelectColumns(text, record, 'do_activity');
                    }
                }, {
                    title: '前台转后台激活',
                    dataIndex: 'to_back_activate',
                    key: 'to_back_activate',
                    width: 90,
                    render: (item, record) => {
                        const text = item % 2;
                        return this.renderSelectColumns(text, record, 'to_back_activate');
                    }
                }, {
                    title: '前台转后台延时（秒）',
                    dataIndex: 'to_back_delay',
                    key: 'to_back_delay',
                    width: 90,
                    render: (text, record) => {
                        return this.renderInputColumns(text, record, 'to_back_delay');
                    }
                }, {
                    title: '灭屏前台激活',
                    dataIndex: 'do_activate',
                    key: 'do_activate_offscreen',
                    width: 90,
                    render: (item, record) => {
                        const text = Math.floor(item / 1000) % 2;
                        return this.renderSelectColumns(text, record, 'do_activate_offscreen');
                    }
                }, {
                    title: '后台转前台激活',
                    dataIndex: 'to_front_activate',
                    key: 'to_front_activate',
                    width: 90,
                    render: (item, record) => {
                        const text = item % 2;
                        return this.renderSelectColumns(text, record, 'to_front_activate');
                    }
                }, {
                    title: '后台转前台延时（秒）',
                    dataIndex: 'to_front_delay',
                    key: 'to_front_delay',
                    width: 100,
                    render: (text, record) => {
                        return this.renderInputColumns(text, record, 'to_front_delay');
                    }
                }]
            }, {
                title: '被激活频次',
                children: [{
                    title: '被激活（次/日/设备）',
                    dataIndex: 'app_activate_count',
                    key: 'app_activate_count',
                    width: 100,
                    render: (text, record) => {
                        return this.renderInputColumns(text, record, 'app_activate_count');
                    }
                }, {
                    title: '被激活间隔(分)',
                    dataIndex: 'activated_interval',
                    key: 'activated_interval',
                    width: 100,
                    render: (text, record) => {
                        const tempText = text / 60;
                        return this.renderInputColumns(tempText, record, 'activated_interval');
                    }
                }, {
                    title: '被激活优先级',
                    dataIndex: 'activate_priority',
                    key: 'activate_priority',
                    width: 100,
                    render: (text, record) => {
                        return this.renderInputColumns(text, record, 'activate_priority');
                    }
                }, {
                    title: '激活前强停（小时）',
                    dataIndex: 'pre_activate_stop_time',
                    key: 'pre_activate_stop_time',
                    width: 100,
                    render: (text, record) => {
                        // const tempText = parseFloat((text / 3600).toFixed(2));
                        const tempText = (text / 3600).toFixed(2);
                        return this.renderInputColumns(tempText, record, 'pre_activate_stop_time');
                    }
                }, {
                    title: '被激活总数（次/日）',
                    dataIndex: 'activate_total_count',
                    key: 'activate_total_count',
                    width: 100,
                    render: (text, record) => {
                        return this.renderInputColumns(text, record, 'activate_total_count');
                    }
                }, {
                    title: '可优先被激活上限（次/日/设备）',
                    dataIndex: 'do_limit',
                    key: 'do_limit',
                    width: 100,
                    render: (text, record) => {
                        return this.renderInputColumns(text, record, 'do_limit');
                    }
                }]
            }, {
                title: '通知',
                children: [{
                    title: '通知展示（次/日/设备）',
                    dataIndex: 'noti_show_count',
                    key: 'noti_show_count',
                    width: 100,
                    render: (text, record) => {
                        return this.renderInputColumns(text, record, 'noti_show_count');
                    }
                }, {
                    title: '通知展示间隔（分）',
                    dataIndex: 'noti_show_interval',
                    key: 'noti_show_interval',
                    // width: '5%',
                    render: (text, record) => {
                        return this.renderInputColumns(text, record, 'noti_show_interval');
                    }
                }]

            }];
        if (userPermi) {
            columns.push({
                title: '操作',
                dataIndex: 'option',
                key: 'option',
                width: 200,
                fixed: 'right',
                render: (text, record) => {
                    const editable = record.editable;
                    return (
                        <div className="editable-row-operations">
                            {
                                editable
                                    ? <span>
                                        <Popconfirm title="确认保存?" onConfirm={() => this.save(record.id)}>
                                            <a style={{marginRight: 10}}>保存</a>
                                        </Popconfirm>
                                        <Popconfirm title="确认取消？" onConfirm={() => this.cancel(record.id)}>
                                            <a>取消</a>
                                        </Popconfirm>
                                    </span>
                                    : <div>
                                        <a style={{marginRight: 10}} onClick={() => this.edit(record.id)}>编辑</a>
                                        <Popconfirm
                                            title="删除自定义配置后将恢复默认配置，是否要删除？"
                                            onConfirm={() => this.deleteItem(record.id)}
                                        >
                                            <a>删除</a>
                                        </Popconfirm>
                                    </div>
                            }

                        </div>
                    );
                }
            });
        }
        return columns;

    }
    render() {
        // const data = this.props.data;
        const {data, isAddRow} = this.state;
        const loading = this.props.loading;
        // const btnDisable = (!isAddRow && data.length > 1) ? false : true;
        const btnDisable = (loading || isAddRow) ? true : false;
        const userPermi = this.props.nav.userList.result
            && userPermitions(this.props.nav.userList.result.list[0].permitions);
        return (
            <div className="ruleControlTable">
                {
                    userPermi
                        && <div className="contrTable">
                            <Button
                                disabled={btnDisable}
                                style={{'marginBottom': '20px'}}
                                type="primary"
                                size="large"
                                className="editable-add-btn"
                                onClick={this.handleAdd.bind(this)}>
                                    新增自定义
                            </Button>
                        </div>
                }
                <Table
                    bordered
                    dataSource={data}
                    rowKey={record => record.id}
                    columns={this.getColumns()}
                    locale={loading ? {emptyText: '请稍等...'} : {emptyText: '暂无数据...'}}
                    size="middle"
                    scroll={{x: 2330, y: 600}}
                    pagination={false}
                />
            </div>

        );
    }
}