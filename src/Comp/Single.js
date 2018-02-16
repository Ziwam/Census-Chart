import React, {Component} from 'react';
import * as d3 from 'd3';
import {fillColor, singleStat} from '../utils';


export default class Single extends Component {
	state = {
		group: null
	}

	componentWillReceiveProps(nextProps) {
		if((nextProps.data !== this.props.data)||(nextProps.category !== this.props.category)){
			this.createDataSet(nextProps.data,nextProps.category)
		}
	}

	shouldComponentUpdate() {
		return false;
	}

	createDataSet = (data,num) =>{
		data = singleStat(data,num);

		let column = [];

		data.sort((a,b) => {
				if (a[1] < b[1])
			  	return -1;
				if (a[1] > b[1])
			 		return 1;
				return 0;
			})

		data.map(function(d) {
			if(!(column.includes(d.category)))column.push(d.category);
		})

		let dataStack = d3.stack().keys([0,1])(data);
		if(num !== this.props.category){
			this.redrawStats(dataStack,column);
		}else{
			this.renderSingleStats(dataStack,column);
		}
			
	}

	onRef = (ref) => {
		this.setState({group: d3.select(ref) });
	}

	redrawStats = (data,column) => {
		var margin = {top: 40, right: 150, bottom: 40, left: 150},
    width = this.props.width - margin.left - margin.right,
    height = this.props.height - margin.top - margin.bottom,
    group = this.state.group.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var x = d3.scaleLinear()
      .range([0, width]);

    var y = d3.scaleBand()
      .rangeRound([0, height])
      .paddingInner(0.09);

    x.domain([0, 1])
    y.domain(column);

    var yAxis = d3.axisLeft(y);

    var xAxis = d3.axisBottom(x)
    	.tickPadding([5])
    	.tickSizeInner(-height)
    	.tickSizeOuter(0)
    	.tickFormat(d => d*100+"%");

		fillColor.domain([0,1]);

		group.selectAll("g")
			.remove()
			.exit();

		group.selectAll("g")
			.data(data)
			.enter()
			.append("g")
      .selectAll("rect")
      .data(d => d)
      .enter().append("rect")
      .attr("fill", (d) => {
      	let num = d[0] > 0? 0:1;
      	return fillColor(num)
     	})
      .attr("x", function(d) {
        return x(d[0]);
      })
      .attr("y", function(d) {
        return y(d.data.category);
      })
      .attr("height", function(d) {
        return y.bandwidth();
      })
      .transition()
      .duration(750)
      .delay(function(d, i){
      	let num = d[0] > 0? 1:0
        return num * 750
  		})
      .attr("width", function(d) {
        return x(d[1]) - x(d[0]);
      });

	}

	renderSingleStats = (data,column) => {

		var margin = {top: 40, right: 150, bottom: 40, left: 150},
    width = this.props.width - margin.left - margin.right,
    height = this.props.height - margin.top - margin.bottom,
    group = this.state.group.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var x = d3.scaleLinear()
      .range([0, width]);

    var y = d3.scaleBand()
      .rangeRound([0, height])
      .paddingInner(0.09);

    x.domain([0, 1])
    y.domain(column);

    var yAxis = d3.axisLeft(y);

    var xAxis = d3.axisBottom(x)
    	.tickPadding([5])
    	.tickSizeInner(-height)
    	.tickSizeOuter(0)
    	.tickFormat(d => d*100+"%");

		fillColor.domain([0,1]);

		group.selectAll("g")
			.data(() => {console.log(data); return data;})
			.enter()
			.append("g")
      .selectAll("rect")
      .data(d => {console.log(d); return d;})
      .enter().append("rect")
      .attr("fill", (d) => {
      	let num = d[0] > 0? 0:1;
      	return fillColor(num)
     	})
      .attr("x", function(d) {
        return x(d[0]);
      })
      .attr("y", function(d) {
        return y(d.data.category);
      })
      .attr("height", function(d) {
        return y.bandwidth();
      })
      .transition()
      .duration(750)
      .delay(function(d, i){
      	let num = d[0] > 0? 1:0
        return num * 750
  		})
      .attr("width", function(d) {
        return x(d[1]) - x(d[0]);
      });

    group.append("g")
			.attr("transform", "translate(0,0)")
			.call(yAxis);

    group.append("g")
			.attr("transform", "translate(0,"+height+")")
			.call(xAxis);

		var legend = group.append("g")
			.attr("class","legend")
			.attr("transform", "translate("+(width+60)+",0)")
			.attr("height", 100)
			.attr("width",100);

		legend.selectAll("g").data(data)
			  .enter()
			  .append("g")
			  .each(function(d,i){
			  	var g = d3.select(this);
			  	g.append("rect")
			  		.attr("transform", "translate(5,"+(i*25 + 16)+")")
			  		.attr("width", 20)
			  		.attr("height",12)
			  		.style("fill",fillColor(d.key));

			  	g.append("text")
			  		.attr("transform", "translate(0,"+(i*25 + 20)+")")
						.attr("height",30)
						.attr("width",100)
						.attr("font-size",10)
						.attr("font-family","sans-serif")
						.attr("text-anchor","end")
						.attr("alignment-baseline","hanging")
						.style("fill","#000")
						.text(d.key == 0? "False":"True");
			  });

		group.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left/2)
      .attr("x",0 - (height / 2))
      .style("text-anchor", "middle")
      .text("Value");

		group.append("text")
      .attr("transform", "translate("+(width/2)+","+(height + margin.top)+")")
      .style("text-anchor", "middle")
      .text("count");
	}

	render() {
		return (
			<g ref={this.onRef} className="single"/>
		);
	}
}