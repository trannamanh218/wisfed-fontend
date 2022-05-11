import { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { Accordion } from 'react-bootstrap';
import ReadBook from 'shared/read-book';
import './read-book-tab.scss';
import { getListBooksReadYear } from 'reducers/redux-utils/chart';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const ReadBookTab = () => {
	const [booksRead, setBooksRead] = useState([]);
	const { userId } = useParams();
	const dispatch = useDispatch();

	const fetchData = async () => {
		const params = {
			type: 'read',
			userId: userId,
		};
		try {
			const data = await dispatch(getListBooksReadYear(params)).unwrap();
			let n = 0;
			const dob = new Date();
			const year = dob.getFullYear();
			const newData = data.rows.map(item => {
				const dob = new Date(item.updatedAt);
				const year = dob.getFullYear();
				return { ...item, year };
			});
			const yearMin = newData.reduce(function (accumulator, element) {
				return accumulator < element ? accumulator : element;
			});
			const newYearData = newData.filter(item => item.year === yearMin.year);
			setBooksRead([{ year: yearMin.year, data: newYearData }]);
			while (yearMin.year + n !== year) {
				n = n + 1;
				const newYearData = newData.filter(item => item.year === yearMin.year + n);
				const data = { data: newYearData, year: yearMin.year + n };
				setBooksRead(prev => [...prev, data]);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className='read-book-tab'>
			{booksRead.map((item, index) => (
				<Accordion key={index} defaultActiveKey='0'>
					<Accordion.Item eventKey={index}>
						<Accordion.Header>
							<span className='read-book-tab__year'>Năm {item.year}</span>
							<h4 className='read-book-tab__quantity'>{item.data.length} cuốn</h4>
						</Accordion.Header>
						{item.data.map(items => (
							<Accordion.Body key={items.id}>
								<ReadBook items={items} />
							</Accordion.Body>
						))}
					</Accordion.Item>
				</Accordion>
			))}
		</div>
	);
};

ReadBookTab.propTypes = {};

export default ReadBookTab;
