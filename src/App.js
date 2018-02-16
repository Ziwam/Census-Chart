import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import { createNode } from './utils';
import Chart from './Comp/Chart';

export default class App extends Component {
	state = {
		data: [],
		singleCategory: 1
	}

	componentDidMount() {
		d3.csv("census.csv", (data) => {
			this.setState({
				data: createNode(data)
			})
		})
	}

	render() {
		return (
			<div>
				<Chart
						data={this.state.data}
						category={this.state.singleCategory}/>
			</div>
		);
	}
}

