import { useFetchStatsReadingBooks } from 'api/library.hook';
import React from 'react';
import BookSlider from 'shared/book-slider';
import DualColumn from 'shared/dual-column';
import ReadChallenge from 'shared/read-challenge';
import ReadingBook from 'shared/reading-book';
import './sidebar-profile.scss';

const SidebarProfile = () => {
	const bookList = new Array(10).fill({ source: '/images/book1.jpg', name: 'Design pattern' });
	const { readingData } = useFetchStatsReadingBooks();

	return (
		<div className='sidebar-profile'>
			<ReadingBook bookData={{}} />
			<BookSlider className='book-reference__slider' title='Sách của Phương Anh' list={bookList} />
			<ReadChallenge />
			<div className='sidebar-profile__personal__category'>
				<h4>Danh mục cá nhân</h4>
				<DualColumn list={readingData} />
			</div>
		</div>
	);
};

SidebarProfile.propTypes = {};

export default SidebarProfile;
