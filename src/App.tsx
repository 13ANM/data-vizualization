import { DataPoint } from './types/DataPoint'
import data from './data/data.json'
import Chart from './components/Chart/Chart'

function App() {
	const salesData: DataPoint[] = data

	return (
		<div className='p-4'>
			<Chart data={salesData} />
		</div>
	)
}

export default App
