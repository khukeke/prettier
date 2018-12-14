/**
 * @file crash问题定位
 * @author zhaomiaoyuan
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {push} from 'react-router-redux';
import PropTypes from 'prop-types';

import Select from '../dep/spui/components/Select';
import Cascader from '../dep/spui/components/Cascader';
import Button from '../dep/spui/components/Button';
import Search from '../dep/ui/components/Search/Search';
import Input from '../dep/spui/components/Input';
import Toast from '../dep/spui/components/Toast';
import Pagination from '../dep/spui/components/Pagination';
import Table from 'antd/lib/table';

import {conf} from '../../conf';
import {userPermitions} from '../../common';
import DateRange from './DateRange';
import {crashDataConf} from './DataConf';
import * as CrashActions from './Redux';

@connect(
    (state, ownProps) => {
        return {
            nav: state.nav.nav,
            getType: state.crash.getType,
            menulist: state.crash.menulist,
            parsing: state.crash.parsing
        };
    },
    dispatch => {
        return {
            CrashActions: bindActionCreators(CrashActions, dispatch),
            push: bindActionCreators(push, dispatch)
        };
    }
)
export default class Data extends Component {
    constructor(props) {
        super(props);
        this.typeN = this.props.type.name;
        this.typeV = this.props.type.value;
        this.state = {
            plats: {id: '-1', label: '所有平台'},
            apps: {id: '-1', label: '所有应用'},
            mstat: {id: '-1', label: '所有状态'},
            startDate: '',
            endDate: '',
            searchValue: '',
            inputValue: '',
            inputError: false,
            selectedRowKeys: [], // Check here to configure the default column
            loading: false,
            tableLoading: false,
            remarkEdit: false,
            cascaderV: '-1zjmbyt-2',
            order: '1',
            effect: '',
            page: {perPage: 20, current: 1, totalPage: 0}
        };
        this.sign = 'zjmbyt';
        this.permition = userPermitions(this.props.nav.userList.result.list[0].permitions);
    }
    static propTypes = {
        type: PropTypes.object
    };
    componentDidMount() {
        this.init();
    }
    send(param) {
        this.setState({tableLoading: true});
        this.props.CrashActions.parsing(param).then(data => {
            this.setState({tableLoading: false});
            if (data.retcode === 0) {
                const result = data.result;
                const page = this.state.page;
                this.setState({
                    startDate: result.start || '',
                    endDate: result.end || '',
                    page: {
                        perPage: result.limit || page.perPage,
                        current: result.page || page.current,
                        totalPage: result.total || result.total === 0 ? result.total : page.totalPage
                    }
                });
            }
        });
    }
    getAppData(data) {
        if (!data || (data && Object.keys(data).length === 0)) {
            return [{id: '-1', label: '所有应用'}];
        }
        let arr = [];
        for (let i in data) {
            arr.push({id: i, label: data[i]});
        }
        arr.unshift({id: '-1', label: '所有应用'});
        return arr;
    }
    getPlatsData(data) {
        if (!data) {
            return [{id: '-1', label: '所有平台'}];
        }
        let arr = [];
        data.map(item => {
            arr.push({id: item.id, label: item.name});
        });
        arr.unshift({id: '-1', label: '所有平台'});
        return arr;
    }
    onCascaderChange = value => {
        const cascaderV = value.value;
        this.setState({cascaderV});
        const {plats, apps, mstat, startDate, endDate, searchValue, order, effect, page} = this.state;
        const cascaderArr = cascaderV.split(this.sign);
        const param =
            '?type=' +
            this.typeV +
            '&plat=' +
            crashDataConf.setAllChoose(plats.id) +
            '&app=' +
            crashDataConf.setAllChoose(apps.id) +
            '&start=' +
            startDate +
            '&end=' +
            endDate +
            '&pname=' +
            crashDataConf.setAllChoose(cascaderArr[0]) +
            '&pversion=' +
            crashDataConf.setAllChoose(cascaderArr[1], '-2') +
            '&mstat=' +
            mstat.id +
            '&query=' +
            searchValue +
            '&order=' +
            order +
            '&effect=' +
            effect +
            '&pagenum=1' +
            '&pagesize=' +
            page.perPage;
        this.send(param);
    };
    start = () => {
        this.setState({loading: true});
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false
            });
        }, 1000);
    };

    onSelectChange = selectedRowKeys => {
        this.setState({selectedRowKeys});
    };
    init() {
        const {plats, cascaderV, apps, mstat, startDate, endDate, searchValue, order, effect, page} = this.state;
        const cascaderArr = cascaderV.split(this.sign);
        const param =
            '?type=' +
            this.typeV +
            '&plat=' +
            crashDataConf.setAllChoose(plats.id) +
            '&app=' +
            crashDataConf.setAllChoose(apps.id) +
            '&start=' +
            startDate +
            '&end=' +
            endDate +
            '&pname=' +
            crashDataConf.setAllChoose(cascaderArr[0]) +
            '&pversion=' +
            crashDataConf.setAllChoose(cascaderArr[1], '-2') +
            '&mstat=' +
            mstat.id +
            '&query=' +
            searchValue +
            '&order=' +
            order +
            '&effect=' +
            effect +
            '&pagenum=' +
            page.current +
            '&pagesize=' +
            page.perPage;
        this.send(param);
    }
    btnClick(flag) {
        const selectedRowKeys = this.state.selectedRowKeys.toString();
        let status = 'yes';
        let label = '已解决';
        if (flag === 'undone') {
            status = 'no';
            label = '未解决';
        }

        const param = {
            m_s: selectedRowKeys,
            m_1: status
        };
        this.props.CrashActions.mark(JSON.stringify(param)).then(data => {
            if (data.retcode === 0) {
                this.init();
                Toast.display({
                    type: 'success',
                    info: '成功标记为' + label,
                    delay: 3500
                });
            }
        });
    }
    remark(record) {
        const id = record.id;
        const m_2 = record.m_2 || '';
        const remarkEdit = this.state['remarkEdit' + id];
        const inputError = this.state.inputError;
        const btnProps1 = {
            label: '保存',
            value: 'HAHAHA',
            styleType: 'modal',
            className: 'margin-right-10 margin-left-20 z-index-3',
            onClick: e => {
                const inputValue = this.state.inputValue;
                if (inputValue === '') {
                    this.setState({
                        inputError: true
                    });
                    return null;
                }
                if (inputValue.length > 50) {
                    return null;
                }
                const param = {
                    m_s: id + '',
                    m_2: inputValue
                };
                this.props.CrashActions.mark(JSON.stringify(param)).then(data => {
                    if (data.retcode === 0) {
                        this.setState({
                            ['remarkEdit' + id]: false,
                            inputError: false
                        });
                        this.init();
                        this.props.callback({editDialog: false});
                    }
                });
            }
        };
        const btnProps2 = {
            label: '取消',
            value: 'HAHAHA',
            styleType: 'ghost',
            className: 'z-index-3',
            onClick: () => {
                this.setState({
                    ['remarkEdit' + id]: false,
                    inputError: false,
                    inputValue: m_2
                });
                this.props.callback({editDialog: false});
            }
        };
        const inputProps = {
            max: 50,
            countFlag: true,
            className: 'left z-index-3 ' + (inputError ? ' error' : ''),
            value: this.state.inputValue,
            getValue: ({value}) => {
                this.setState({
                    inputValue: value,
                    inputError: value === ''
                });
            }
        };
        return (
            <div className={'remark'}>
                <span className={'left remark-label' + (remarkEdit ? ' z-index-3' : '')}>备注：</span>
                {!remarkEdit && <span className="remark-content">{m_2}</span>}
                {!remarkEdit && this.permition && (
                    <a
                        style={{marginLeft: '10px'}}
                        onClick={() => {
                            this.setState({
                                ['remarkEdit' + id]: !remarkEdit,
                                inputValue: m_2
                            });
                            this.props.callback({editDialog: true});
                        }}
                    >
                        编辑
                    </a>
                )}
                {remarkEdit && <Input {...inputProps} />}
                {remarkEdit && <Button {...btnProps1} />}
                {remarkEdit && <Button {...btnProps2} />}
                {remarkEdit && inputError && <div className="icon-error z-index-3">备注不能为空</div>}
            </div>
        );
    }
    setSequence(data) {
        let v = '1';
        switch (data) {
            case 'descend':
                v = '1';
                break;
            case 'ascend':
                v = '-1';
                break;
        }
        return v;
    }
    onPageChange(page) {
        const {perPage, current} = page;
        const {plats, cascaderV, apps, mstat, startDate, endDate, searchValue, order, effect} = this.state;
        const cascaderArr = cascaderV.split(this.sign);
        const param =
            '?type=' +
            this.typeV +
            '&plat=' +
            crashDataConf.setAllChoose(plats.id) +
            '&app=' +
            crashDataConf.setAllChoose(apps.id) +
            '&start=' +
            startDate +
            '&end=' +
            endDate +
            '&pname=' +
            crashDataConf.setAllChoose(cascaderArr[0]) +
            '&pversion=' +
            crashDataConf.setAllChoose(cascaderArr[1], '-2') +
            '&mstat=' +
            mstat.id +
            '&query=' +
            searchValue +
            '&order=' +
            order +
            '&effect=' +
            effect +
            '&pagenum=' +
            current +
            '&pagesize=' +
            perPage;
        this.send(param);
    }
    table(result) {
        const columns = [
            {
                title: this.typeN + '堆栈详情',
                dataIndex: 's_5'
            },
            {
                title: '平台',
                dataIndex: 's_7'
            },
            {
                title: '插件版本',
                dataIndex: 's_2',
                render: (item, data, index) => {
                    return item + '/' + data.s_3;
                }
            },
            {
                title: '应用',
                dataIndex: 's_1'
            },
            {
                title: '首次发生时间',
                dataIndex: 'd_8'
            },
            {
                title: '末次发生时间',
                dataIndex: 'd_9'
            },
            {
                title: '发生次数',
                dataIndex: 'd_4',
                sorter: true
            },
            {
                title: '影响用户数',
                dataIndex: 'd_5',
                sorter: true
            },
            {
                title: '解决',
                dataIndex: 'm_1',
                render: (item, data) => {
                    return (
                        <div
                            className={item === 'yes' ? 'done-img' : 'undone-img'}
                            style={{
                                cursor: this.permition ? 'pointer' : 'auto'
                            }}
                            onClick={() => {
                                if (!this.permition) {
                                    return null;
                                }
                                const param = {
                                    m_s: data.id + '',
                                    m_1: item === 'yes' ? 'no' : 'yes'
                                };
                                this.props.CrashActions.mark(JSON.stringify(param)).then(data => {
                                    if (data.retcode === 0) {
                                        this.init();
                                    }
                                });
                            }}
                        />
                    );
                }
            }
        ];

        let data = result.list;
        if (data) {
            data = data.map(item => {
                item['key'] = item.id;
                return item;
            });
        }
        // data = [
        //     { id: 1, key: 3, m_2: 'www', m_1: 'yes', s_5: 'John Brown', s_7: 32, s_2: 'New York No. 1 Lake Park',
        //         s_6: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
        //     { id: 2, key: 4, m_2: 'ddd', m_1: 'no', s_5: 'Jim Green', s_7: 42, s_2: 'London No. 1 Lake Park', s_6: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
        //     { key: 5, s_5: 'Joe Black', m_2: 'rrr', m_1: 'yes', s_7: 32, s_2: 'Sidney No. 1 Lake Park', s_6: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
        // ];
        const {loading, selectedRowKeys, page, tableLoading} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
                disabled: !this.permition
            })
        };
        const hasSelected = selectedRowKeys.length > 0;
        const btnProps1 = {
            label: '标记为已解决',
            styleType: 'modal',
            value: 'done',
            className: 'done' + (hasSelected ? ' green' : ''),
            disabled: !hasSelected,
            onClick: this.btnClick.bind(this, 'done')
        };
        const btnProps2 = {
            label: '标记为未解决',
            styleType: 'modal',
            value: 'undone',
            className: 'undone' + (hasSelected ? ' orange' : ''),
            disabled: !hasSelected,
            onClick: this.btnClick.bind(this, 'undone')
        };
        let pageConfigs = {
            perFlag: true,
            skipFlag: false,
            current: page.current,
            perPage: page.perPage,
            totalItem: page.totalPage,
            onChange: this.onPageChange.bind(this)
        };
        return (
            <div>
                <div style={{marginBottom: 16}}>
                    <Button {...btnProps1} />
                    <Button {...btnProps2} />
                    <span style={{marginLeft: 15}}>{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
                </div>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    locale={{emptyText: tableLoading ? '加载中…' : '暂无数据'}}
                    expandedRowRender={record => (
                        <div>
                            {this.handleCrashMsg(record.s_6)}
                            {this.remark(record)}
                        </div>
                    )}
                    onChange={(pagination, filters, sorter) => {
                        let {
                            plats,
                            cascaderV,
                            apps,
                            mstat,
                            startDate,
                            endDate,
                            searchValue,
                            order,
                            effect,
                            page
                        } = this.state;
                        if (sorter.field === 'd_4') {
                            order = this.setSequence(sorter.order);
                            effect = '';
                        } else if (sorter.field === 'd_5') {
                            order = '';
                            effect = this.setSequence(sorter.order);
                        }

                        this.setState({
                            order,
                            effect
                        });
                        const cascaderArr = cascaderV.split(this.sign);
                        const param =
                            '?type=' +
                            this.typeV +
                            '&plat=' +
                            crashDataConf.setAllChoose(plats.id) +
                            '&app=' +
                            crashDataConf.setAllChoose(apps.id) +
                            '&start=' +
                            startDate +
                            '&end=' +
                            endDate +
                            '&pname=' +
                            crashDataConf.setAllChoose(cascaderArr[0]) +
                            '&pversion=' +
                            crashDataConf.setAllChoose(cascaderArr[1], '-2') +
                            '&mstat=' +
                            mstat.id +
                            '&query=' +
                            searchValue +
                            '&order=' +
                            order +
                            '&effect=' +
                            effect +
                            '&pagenum=' +
                            page.current +
                            '&pagesize=' +
                            page.perPage;
                        this.send(param);
                    }}
                />
                {page.totalPage !== 0 && <Pagination {...pageConfigs} />}
            </div>
        );
    }
    getX2vData(data) {
        let optionData = [];
        for (let key in data) {
            const value = data[key];
            let children = value.map(item => {
                return {value: key + this.sign + item, name: item};
            });
            children.unshift({value: key + this.sign + '-2', name: '所有版本'});
            const obj = {
                value: key,
                name: key,
                children: children
            };
            optionData.push(obj);
        }
        // 全部插件和版本
        const unshiftObj = {
            value: '-1',
            name: '所有插件',
            children: [{value: '-1' + this.sign + '-2', name: '所有版本'}]
        };
        optionData.unshift(unshiftObj);
        return optionData;
    }

    onSearchChange(e) {
        this.setState({
            searchValue: e.value
        });
    }
    onSearchClick() {
        const {perPage, searchValue} = this.state;
        this.searchSend(searchValue);
    }
    onPressEnter(e) {
        this.searchSend(e.target.value);
    }
    searchSend(searchValue) {
        const {plats, apps, mstat, cascaderV, startDate, endDate, order, effect, page} = this.state;
        const cascaderArr = cascaderV.split(this.sign);
        const param =
            '?type=' +
            this.typeV +
            '&plat=' +
            crashDataConf.setAllChoose(plats.id) +
            '&app=' +
            crashDataConf.setAllChoose(apps.id) +
            '&start=' +
            startDate +
            '&end=' +
            endDate +
            '&pname=' +
            crashDataConf.setAllChoose(cascaderArr[0]) +
            '&pversion=' +
            crashDataConf.setAllChoose(cascaderArr[1], '-2') +
            '&mstat=' +
            mstat.id +
            '&query=' +
            searchValue +
            '&order=' +
            order +
            '&effect=' +
            effect +
            '&pagenum=1' +
            '&pagesize=' +
            page.perPage;
        this.send(param);
    }
    handleCrashMsg(value) {
        const arr = value.split(';;');
        if (arr.length <= 0) {
            return;
        }
        return (
            <div>
                {arr.map((v, k) => {
                    return (
                        <p key={k} style={{margin: 0}}>
                            {v}
                        </p>
                    );
                })}
            </div>
        );
    }
    render() {
        const {startDate, endDate} = this.state;
        const data = this.props.menulist;
        const parsing = this.props.parsing;
        // const x2v = {
        //     "x24":[
        //         "4.5.1",
        //         "3.7.1"
        //     ],
        //     "x0":[
        //         "4.5.14.5.14.5.14.5.14.5.14.5.14.5.1",
        //         "3.7.1.1"
        //     ]
        // };
        const x2v = data.x2v;

        const cascaderProp1 = {
            name: 'cascader1',
            className: 'dtype left',
            optionData: this.getX2vData(x2v),
            width: 267,
            placeHolder: '请选择',
            value: this.state.cascaderV,
            dropdownItemWidth: 133.999,
            getValue: this.onCascaderChange
        };
        return (
            <div className="">
                <p className={'title'}>{this.typeN + '问题定位'}</p>
                <div className={'container'} style={{padding: '20px'}}>
                    <div className={'remove-float'}>
                        <Select
                            showSearch
                            noWarning
                            cancelIcon={false}
                            name={'plats'}
                            className={'dtype left'}
                            optionData={this.getPlatsData(data.plats)}
                            value={this.state.plats}
                            width={'172px'}
                            getValue={({name, value}) => {
                                this.setState({
                                    plats: value
                                });
                                const {
                                    apps,
                                    startDate,
                                    endDate,
                                    cascaderV,
                                    mstat,
                                    searchValue,
                                    order,
                                    effect,
                                    page
                                } = this.state;
                                const cascaderArr = cascaderV.split(this.sign);
                                const param =
                                    '?type=' +
                                    this.typeV +
                                    '&plat=' +
                                    crashDataConf.setAllChoose(value.id) +
                                    '&app=' +
                                    crashDataConf.setAllChoose(apps.id) +
                                    '&start=' +
                                    startDate +
                                    '&end=' +
                                    endDate +
                                    '&pname=' +
                                    crashDataConf.setAllChoose(cascaderArr[0]) +
                                    '&pversion=' +
                                    crashDataConf.setAllChoose(cascaderArr[1], '-2') +
                                    '&mstat=' +
                                    mstat.id +
                                    '&query=' +
                                    searchValue +
                                    '&order=' +
                                    order +
                                    '&effect=' +
                                    effect +
                                    '&pagenum=1' +
                                    '&pagesize=' +
                                    page.perPage;
                                this.send(param);
                            }}
                        />
                        <Cascader {...cascaderProp1} />
                        <Select
                            showSearch
                            noWarning
                            cancelIcon={false}
                            name={'apps'}
                            className={'dtype left'}
                            optionData={this.getAppData(data.apps)}
                            value={this.state.apps}
                            width={'172px'}
                            getValue={({name, value}) => {
                                this.setState({
                                    apps: value
                                });

                                const {
                                    plats,
                                    cascaderV,
                                    mstat,
                                    startDate,
                                    endDate,
                                    searchValue,
                                    order,
                                    effect,
                                    page
                                } = this.state;
                                const cascaderArr = cascaderV.split(this.sign);
                                const param =
                                    '?type=' +
                                    this.typeV +
                                    '&plat=' +
                                    crashDataConf.setAllChoose(plats.id) +
                                    '&app=' +
                                    crashDataConf.setAllChoose(value.id) +
                                    '&start=' +
                                    startDate +
                                    '&end=' +
                                    endDate +
                                    '&pname=' +
                                    crashDataConf.setAllChoose(cascaderArr[0]) +
                                    '&pversion=' +
                                    crashDataConf.setAllChoose(cascaderArr[1], '-2') +
                                    '&mstat=' +
                                    mstat.id +
                                    '&query=' +
                                    searchValue +
                                    '&order=' +
                                    order +
                                    '&effect=' +
                                    effect +
                                    '&pagenum=1' +
                                    '&pagesize=' +
                                    page.perPage;
                                this.send(param);
                            }}
                        />
                        <Select
                            noWarning
                            cancelIcon={false}
                            name={'mstat'}
                            className={'dtype left'}
                            optionData={crashDataConf.mstat}
                            value={this.state.mstat}
                            width={'172px'}
                            getValue={({name, value}) => {
                                this.setState({
                                    mstat: value
                                });

                                const {
                                    plats,
                                    cascaderV,
                                    apps,
                                    startDate,
                                    endDate,
                                    searchValue,
                                    order,
                                    effect,
                                    page
                                } = this.state;
                                const cascaderArr = cascaderV.split(this.sign);
                                const param =
                                    '?type=' +
                                    this.typeV +
                                    '&plat=' +
                                    crashDataConf.setAllChoose(plats.id) +
                                    '&app=' +
                                    crashDataConf.setAllChoose(apps.id) +
                                    '&start=' +
                                    startDate +
                                    '&end=' +
                                    endDate +
                                    '&pname=' +
                                    crashDataConf.setAllChoose(cascaderArr[0]) +
                                    '&pversion=' +
                                    crashDataConf.setAllChoose(cascaderArr[1], '-2') +
                                    '&mstat=' +
                                    value.id +
                                    '&query=' +
                                    searchValue +
                                    '&order=' +
                                    order +
                                    '&effect=' +
                                    effect +
                                    '&pagenum=1' +
                                    '&pagesize=' +
                                    page.perPage;
                                this.send(param);
                            }}
                        />
                        {startDate !== '' && endDate !== '' && (
                            <DateRange
                                className={'dtype left'}
                                startDate={parsing.start || ''}
                                endDate={parsing.end || ''}
                                callback={e => {
                                    const startDate = e.startDate || startDate;
                                    const endDate = e.endDate || endDate;
                                    const {
                                        plats,
                                        cascaderV,
                                        apps,
                                        mstat,
                                        searchValue,
                                        order,
                                        effect,
                                        page
                                    } = this.state;
                                    const cascaderArr = cascaderV.split(this.sign);
                                    const param =
                                        '?type=' +
                                        this.typeV +
                                        '&plat=' +
                                        crashDataConf.setAllChoose(plats.id) +
                                        '&app=' +
                                        crashDataConf.setAllChoose(apps.id) +
                                        '&start=' +
                                        startDate +
                                        '&end=' +
                                        endDate +
                                        '&pname=' +
                                        crashDataConf.setAllChoose(cascaderArr[0]) +
                                        '&pversion=' +
                                        crashDataConf.setAllChoose(cascaderArr[1], '-2') +
                                        '&mstat=' +
                                        mstat.id +
                                        '&query=' +
                                        searchValue +
                                        '&order=' +
                                        order +
                                        '&effect=' +
                                        effect +
                                        '&pagenum=1' +
                                        '&pagesize=' +
                                        page.perPage;
                                    this.send(param);
                                }}
                            />
                        )}
                        <Search
                            width={'200px'}
                            cancelIcon={false}
                            placeHolder={'请输入搜索内容'}
                            value={this.state.searchValue}
                            className={'search-style left remark-search'}
                            getValue={this.onSearchChange.bind(this)}
                            onPressEnter={this.onPressEnter.bind(this)}
                            iconClick={this.onSearchClick.bind(this)}
                        />
                        {this.permition && (
                            <a href={conf.ipCrash} className={'left crash-download'}>
                                <img src={require('../../resource/icon/crash-download.svg')} />
                            </a>
                        )}
                    </div>
                    {this.table(parsing)}
                </div>
            </div>
        );
    }
}
