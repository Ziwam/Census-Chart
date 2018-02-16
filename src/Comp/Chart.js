import React, { Component } from 'react';
import Single from './Single';

export default class Chart extends Component {
	constructor(props) {
		super(props)
		this.width = 900;
		this.height = 450;
	}

	render() {
		return (
			<svg className="Chart" width={this.width} height={this.height}>
				<Single
						data={this.props.data}
						category={this.props.category}
						width={this.width}
						height={this.height}/>
    	</svg>
		);
	}
}