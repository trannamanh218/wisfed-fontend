import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import './editor.scss';

const Editor = props => {
	const editorRef = useRef(null);

	useEffect(() => {
		document.addEventListener('DOMContentLoaded', function () {
			const editor = editorRef.current;
			const placeholder = editor.getAttribute('data-placeholder');

			// Set the placeholder as initial content if it's empty
			editor.innerHTML === '' && (editor.innerHTML = placeholder);

			editor.addEventListener('focus', function (e) {
				const value = e.target.innerHTML;
				value === placeholder && (e.target.innerHTML = '');
			});

			editor.addEventListener('blur', function (e) {
				const value = e.target.innerHTML;
				value === '' && (e.target.innerHTML = placeholder);
			});
		});
	}, []);

	return (
		<div
			ref={editorRef}
			className='editor'
			id='editor'
			data-placeholder='Nội dung quote của bạn'
			contentEditable='true'
			suppressContentEditableWarning='true'
		></div>
	);
};

Editor.propTypes = {};

export default Editor;
