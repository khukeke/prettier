import React, {Component} from 'react';
import '../style/index.css';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            flag: true,
            arr: [
                {name: 'jack', age: 11},
                {name: 'tom', age: 23},
                {name: 'susie', age: 21}
            ]
        };
    }
    componentDidMount() {
        this.setCount();
    }
    setCount() {
        const {count, arr} = this.state;
        switch (count) {
            case 0:
                console.log('count');
                break;
            case 1:
                console.log('1');
                break;
            default:
                console.log('default');
        }
        var a = arr.length;
        a++;
        this.state.arr.map((v, k) => {
            if (v.name === 'jack') {
                console.log(k);
                console.log(v.age);
            }
        });
    }
    render() {
        return (
            <div className="showRed">
                <button type="button">Hello</button>
            </div>
        );
    }
}
export default Table;
