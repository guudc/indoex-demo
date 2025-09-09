import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Pagination from 'rc-pagination'
import './users.css'
import { isAuthenticated } from './../../helper/auth'
import { getAirdrops } from './../../functions/admin'
import Loader from 'src/components/Loader'

interface TableProps {
	width: string
	height: string
}

const Table = styled.table<TableProps>`
	width: ${(props) => props.width};
	height: ${(props) => props.height};
	border-collapse: collapse;
`

const Bottom = styled.div`
	align-items: center;
	border: none;
	padding: 10px;
	outline: none;
	display: flex;
	align-items: center;
	text-transform: uppercase;
	font-size: 1rem;
	color: #fff;
	background-color: #7eb946;
	border-radius: 4px;
`
const Bottom2 = styled.div`
	align-items: center;
	border: none;
	padding: 10px;
	outline: none;
	display: flex;
	align-items: center;
	text-transform: uppercase;
	font-size: 1rem;
	color: #fff;
	background-color: red;
	border-radius: 4px;
`

interface TableRowProps {
	background: string
}

const TableRow = styled.tr<TableRowProps>`
	background-color: ${(props) => props.background};
`

interface TableHeaderProps {
	fontWeight: string
}

const TableHeader = styled.th<TableHeaderProps>`
	font-weight: ${(props) => props.fontWeight};
	padding: 10px;
	border-bottom: 1px solid black;
`

interface TableDataProps {
	textAlign: string
}

const TableData = styled.td<TableDataProps>`
	text-align: ${(props) => props.textAlign};
	padding: 10px;
	border-bottom: 1px solid black;
`

const Airdrops: React.FC = () => {
	const [state, setState] = useState({
		airdrops: []
	} as any)
	const [perPage, setPerPage] = useState(50)
	const [size, setSize] = useState(perPage)
	const [current, setCurrent] = useState(1)
	const [key, setKey] = useState(1)
	const [loading, setLoading] = useState(false)
	const { token } = isAuthenticated()

	const fatchAirdrops = async () => {
		setLoading(true)
		getAirdrops(token).then((data) => {
			console.log(data)
			if (data) {
				setState({ ...state, airdrops: [...data.airdrops] })
				setLoading(false)
			}
		})
	}
	const { airdrops } = state
	const hasAirdrops = airdrops.length > 0

	useEffect(() => {
		fatchAirdrops()
	}, [])

	const PerPageChange = (value) => {
		setSize(value)
		const newPerPage = Math.ceil(airdrops.length / value)
		if (current > newPerPage) {
			setCurrent(newPerPage)
		}
	}

	const getData = (current, pageSize) => {
		// Normally you should get the data from the server
		return airdrops.slice((current - 1) * pageSize, current * pageSize)
	}

	const PaginationChange = (page, pageSize) => {
		setCurrent(page)
		setSize(pageSize)
	}

	const PrevNextArrow = (current, type, originalElement) => {
		if (type === 'prev') {
			return (
				<button>
					<i className="fa fa-angle-double-left"></i>
				</button>
			)
		}
		if (type === 'next') {
			return (
				<button>
					<i className="fa fa-angle-double-right"></i>
				</button>
			)
		}
		return originalElement
	}

	return (
		<>
			{loading ? (
				<>
					<h2>Loading airdrops...Please wait</h2>
					<Loader />
				</>
			) : (
				<>
					{hasAirdrops ? (
						<div className="container-fluid airdrops airdrops mt-5 mb-5">
							<div className="row justify-content-center">
								<div className="col-md-10">
									<div className="card">
										<div className="card-body p-0">
											<div className="table-filter-info">
												<Pagination
													className="pagination-data"
													showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
													onChange={PaginationChange}
													total={airdrops.length}
													current={current}
													pageSize={size}
													showSizeChanger={false}
													itemRender={PrevNextArrow}
													onShowSizeChange={PerPageChange}
												/>
											</div>
											<div className="table-responsive">
												<table className="table table-text-small mb-0">
													<thead className="thead-primary table-sorting">
														<tr>
															<th>ID</th>
															<th>Name</th>
															<th>Catrgeory</th>
															<th>Logo</th>
															<th>URL</th>
															<th>TVL</th>
															<th>Chains</th>
															<th>Owner</th>
															{/* <th>Delete</th> */}
														</tr>
													</thead>
													<tbody>
														{getData(current, size).map((data, index) => {
															return (
																<tr key={index}>
																	{console.log(data)}
																	<td>{data._id}</td>
																	<td>{data.name}</td>
																	<td>{data.category}</td>
																	<td>
																		<img
																			src={data.logo}
																			style={{ width: '50px', height: '50px', borderRadius: '50%' }}
																			alt="Logo"
																		/>
																	</td>
																	<td>{data.url}</td>
																	<td>{data.tvl}</td>
																	<td>{data.chains[0]}</td>
																	<td>{data.owner}</td>
																	{/* <td>
																<Bottom2>Delete</Bottom2>
															</td> */}
																</tr>
															)
														})}
													</tbody>
												</table>
											</div>
											<div className="table-filter-info">
												<Pagination
													className="pagination-data"
													showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
													onChange={PaginationChange}
													total={airdrops.length}
													current={current}
													pageSize={size}
													showSizeChanger={false}
													itemRender={PrevNextArrow}
													onShowSizeChange={PerPageChange}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : (
						<h4>No Airdrop</h4>
					)}
				</>
			)}
		</>
	)
}

export default Airdrops
