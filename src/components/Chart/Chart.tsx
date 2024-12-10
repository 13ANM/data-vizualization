import { useRef, useEffect, useState, FC } from 'react'
import * as d3 from 'd3'
import { DataPoint } from '../../types/DataPoint'

interface ChartProps {
	data: DataPoint[]
}

const Chart: FC<ChartProps> = ({ data }) => {
	const svgRef = useRef<SVGSVGElement | null>(null)

	const [hoveredData, setHoveredData] = useState<DataPoint | null>(null)
	const [tooltipPosition, setTooltipPosition] = useState<{
		x: number
		y: number
	}>({ x: 0, y: 0 })

	useEffect(() => {
		if (!svgRef.current) return

		const width = 500
		const height = 300
		const margin = { top: 20, right: 20, bottom: 30, left: 40 }

		d3.select(svgRef.current).selectAll('*').remove()

		const svg = d3
			.select(svgRef.current)
			.attr('width', width)
			.attr('height', height)

		const x = d3
			.scaleBand()
			.domain(data.map((d) => d.month))
			.range([margin.left, width - margin.right])
			.padding(0.1)

		const y = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.sales) ?? 0])
			.nice()
			.range([height - margin.bottom, margin.top])

		// X Axis
		svg
			.append('g')
			.attr('transform', `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(x))

		// Y Axis
		svg
			.append('g')
			.attr('transform', `translate(${margin.left},0)`)
			.call(d3.axisLeft(y))

		const bars = svg
			.append('g')
			.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')
			.attr('x', (d) => x(d.month)!)
			.attr('y', y(0))
			.attr('width', x.bandwidth())
			.attr('height', 0)
			.attr('fill', '#3b82f6')

		bars
			.transition()
			.duration(750)
			.attr('y', (d) => y(d.sales))
			.attr('height', (d) => height - margin.bottom - y(d.sales))

		bars
			.on('mouseover', function (event, d) {
				d3.select(this).attr('fill', '#1d4ed8')
				const [mouseX, mouseY] = d3.pointer(event)
				setHoveredData(d)
				setTooltipPosition({ x: mouseX, y: mouseY })
			})
			.on('mousemove', function (event) {
				const [mouseX, mouseY] = d3.pointer(event)
				setTooltipPosition({ x: mouseX, y: mouseY })
			})
			.on('mouseout', function () {
				d3.select(this).attr('fill', '#3b82f6')
				setHoveredData(null)
			})
	}, [data])

	return (
		<div className='relative'>
			<svg ref={svgRef}></svg>
			{hoveredData && (
				<div
					className='absolute bg-white shadow-lg border border-gray-300 rounded px-2 py-1 text-sm pointer-events-none'
					style={{
						top: tooltipPosition.y - 40,
						left: tooltipPosition.x + 10,
					}}
				>
					<div className='font-bold'>{hoveredData.month}</div>
					<div>Sales: {hoveredData.sales}</div>
				</div>
			)}
		</div>
	)
}

export default Chart
