import * as d3 from 'd3';


export function createNode(data) {
	return data.map( d => ({
		edu: d.education_level,
		race: d.race,
		sex: d.sex,
		over_num: +d.over_50k,
	}))
}

export function singleStat(data,param = 0){
	let dom = d3.nest()
		.key((d) => {
			switch(param){
				case 0:
					return d.edu;
					break;
				case 1:
					return d.race;
					break;
				case 2:
					return d.sex;
					break;
			}
		})
		.key((d) => { return d.over_num; })
		.rollup((v) => { return v.length; })
		.entries(data);


		let flatten = [];
		dom.forEach( (cat) => {
			let group = {
				category: cat.key,
				total: 0
			}
			cat.values.forEach((v)=>{
				group[v.key] = v.value;
				group.total +=v.value;
			})
			flatten.push(group);
		})

		flatten.forEach((d) => {
			d[0] = 1 - d[0]/d.total,
			d[1] = 1 - d[1]/d.total
		})

		return flatten;

}

export let fillColor = d3.scaleOrdinal().range(['#d84b2a', '#beccae'])