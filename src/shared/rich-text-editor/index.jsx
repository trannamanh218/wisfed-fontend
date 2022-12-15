import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import './rich-text-editor.scss';
import '@draft-js-plugins/linkify/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import createMentionPlugin from '@draft-js-plugins/mention';
import '@draft-js-plugins/mention/lib/plugin.css';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { stateToHTML } from 'draft-js-export-html';
import { getFriendList } from 'reducers/redux-utils/user';
import { useDispatch, useSelector } from 'react-redux';
import defaultAvatar from 'assets/icons/defaultLogoAvatar.svg';
import { NotificationError } from 'helpers/Error';
import { hashtagRegex, urlRegex } from 'constants';

const generatePlugins = () => {
	const mentionPlugin = createMentionPlugin();
	const plugins = [mentionPlugin];
	const MentionSuggestions = mentionPlugin.MentionSuggestions;
	return {
		plugins,
		MentionSuggestions,
	};
};

function RichTextEditor({
	content,
	setContent,
	setUrlAdded,
	hasMentionsUser,
	placeholder,
	handleKeyBind,
	handleKeyPress,
	className,
	createCmt,
	mentionUsersArr,
	setMentionUsersArr,
	hasUrl,
	commentLv1Id,
	replyingCommentId,
	clickReply,
}) {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [open, setOpen] = useState(false);
	const [suggestions, setSuggestions] = useState([]);
	const [{ plugins, MentionSuggestions }] = useState(() => {
		const { plugins, MentionSuggestions } = generatePlugins();
		return {
			plugins,
			MentionSuggestions,
		};
	});

	const editor = useRef(null);

	const userInfo = useSelector(state => state.auth.userInfo);

	const dispatch = useDispatch();

	useEffect(() => {
		if (replyingCommentId === commentLv1Id) {
			reply();
			setTimeout(() => {
				editor.current.focus();
			}, 200);
		}
	}, [clickReply]);

	// refresh editor
	useEffect(() => {
		if (content && hasMentionsUser) {
			setEditorState(EditorState.createEmpty());
			setTimeout(() => {
				// console.log('22');
				editor.current.focus();
				// const data = {
				// 	'blocks': [
				// 		{
				// 			'text': 'run 111',
				// 			'type': 'unstyled',
				// 			'depth': 0,
				// 			'inlineStyleRanges': [],
				// 			'entityRanges': [],
				// 			'data': {},
				// 		},
				// 	],
				// 	'entityMap': {},
				// };

				// const contentState = convertFromRaw(data);
				// setEditorState(EditorState.createWithContent(contentState));
			}, 200);
		}
	}, [createCmt]);

	useEffect(() => {
		const textValue = editorState.getCurrentContent().getPlainText().trim();
		const urlDetected = textValue.match(urlRegex);

		if (urlDetected) {
			detectUrl(urlDetected);
		} else {
			if (hasUrl === false) {
				detectUrl('');
			}
		}
		if (textValue.length) {
			const html = convertContentToHTML();
			setContent(html);
		} else {
			setContent('');
		}

		// tags mention user khi nhan @
		const editorStateRaws = convertToRaw(editorState.getCurrentContent());
		const entytiMap = editorStateRaws.entityMap;
		const newArr = Object.keys(entytiMap).map(key => entytiMap[key].data.mention);
		setMentionUsersArr(newArr);
	}, [editorState]);

	// decorator hashtags draft-js
	const hashtagStrategy = (contentBlock, callback) => {
		if (commentLv1Id === undefined) {
			findWithHashtagRegex(hashtagRegex, contentBlock, callback);
		}
	};

	const findWithHashtagRegex = (regex, contentBlock, callback) => {
		const text = contentBlock.getText();
		let matchArr, start;
		while ((matchArr = regex.exec(text)) !== null) {
			start = matchArr.index;
			callback(start, start + matchArr[0].length);
		}
	};

	const HashtagSpan = ({ offsetKey, children }) => {
		return (
			<span
				style={{
					color: '#5e93c5',
				}}
				data-offset-key={offsetKey}
			>
				{children}
			</span>
		);
	};
	//------------------------------------------------------------------

	// decorator url draft-js
	const urlStrategy = (contentBlock, callback) => {
		findWithUrlRegex(urlRegex, contentBlock, callback);
	};

	const findWithUrlRegex = (regex, contentBlock, callback) => {
		const text = contentBlock.getText();
		let matchArr, start;
		while ((matchArr = regex.exec(text)) !== null) {
			start = matchArr.index;
			callback(start, start + matchArr[0].length);
		}
	};

	const UrlSpan = ({ offsetKey, children }) => {
		return (
			<span
				style={{
					color: '#0576f0',
				}}
				data-offset-key={offsetKey}
			>
				{children}
			</span>
		);
	};
	//-----------------------------------------------------------------

	const customDecorators = [
		{
			strategy: hashtagStrategy,
			component: HashtagSpan,
		},
		{
			strategy: urlStrategy,
			component: UrlSpan,
		},
	];

	const convertContentToHTML = () => {
		const contentState = editorState.getCurrentContent();
		const options = {
			entityStyleFn: entity => {
				const entityType = entity.get('type').toLowerCase();
				if (entityType === 'mention') {
					const data = entity.getData();
					return {
						element: 'a',
						attributes: {
							'class': 'mention-class',
							'data-user-id': data.mention.id,
						},
						style: {
							color: '#222',
							fontWeight: 700,
						},
					};
				}
			},
		};
		return stateToHTML(contentState, options);
	};

	const onChange = data => {
		setEditorState(data);
	};

	const detectUrl = useCallback(
		_.debounce(urlDetected => {
			if (urlDetected && urlDetected.length) {
				setUrlAdded(urlDetected[urlDetected.length - 1]);
			} else {
				setUrlAdded('');
			}
		}, 200),
		[]
	);

	const onOpenChange = useCallback(_open => {
		setOpen(_open);
	}, []);

	const onSearchChange = useCallback(
		({ value }) => {
			debounceSuggestionMentions(value);
		},
		[userInfo]
	);

	const debounceSuggestionMentions = useCallback(
		_.debounce(value => {
			fetchSuggestionMentions(value);
		}, 700),
		[userInfo]
	);

	const fetchSuggestionMentions = async value => {
		try {
			const params = {
				start: 0,
				limit: 5,
				filter: JSON.stringify([{ operator: 'search', value: value, property: 'firstName,lastName' }]),
			};
			const suggestionsResponse = await dispatch(getFriendList({ userId: userInfo.id, query: params })).unwrap();
			const suggestionData = [];
			suggestionsResponse.rows.forEach(item => {
				const mentionData = {
					name: item.fullName || item.firstName + item.lastName,
					avatar: item.avatarImage || defaultAvatar,
					id: item.id,
				};
				suggestionData.push(mentionData);
			});
			setSuggestions(suggestionData);
		} catch (err) {
			NotificationError(err);
		}
	};

	const reply = () => {
		let data = {};
		if (mentionUsersArr.length) {
			data = {
				'blocks': [
					{
						'text': `${mentionUsersArr[0].name} `,
						'type': 'unstyled',
						'depth': 0,
						'inlineStyleRanges': [],
						'entityRanges': [
							{
								'offset': 0,
								'length': mentionUsersArr[0].name.length,
								'key': 0,
							},
						],
						'data': {},
					},
				],
				'entityMap': {
					0: {
						'type': 'mention',
						'mutability': 'SEGMENTED',
						'data': {
							'mention': {
								'name': `${mentionUsersArr[0].name}`,
								'avatar': `${mentionUsersArr[0].avatar}`,
								'id': `${mentionUsersArr[0].id}`,
							},
						},
					},
				},
			};
		} else {
			data = {
				'blocks': [
					{
						'text': '',
						'type': 'unstyled',
						'depth': 0,
						'inlineStyleRanges': [],
						'entityRanges': [],
						'data': {},
					},
				],
				'entityMap': {},
			};
		}
		const contentState = convertFromRaw(data);
		setEditorState(EditorState.createWithContent(contentState));
	};

	const keyDown = e => {
		if (e.keyCode === 33 || e.keyCode === 34) {
			e.preventDefault();
		}
	};

	return (
		<>
			<div className={className ? `rich-text-editor ${className}` : 'rich-text-editor'} onKeyDown={keyDown}>
				<Editor
					editorState={editorState}
					onChange={onChange}
					plugins={plugins}
					ref={editor}
					placeholder={placeholder}
					keyBindingFn={handleKeyBind}
					handleKeyCommand={handleKeyPress}
					decorators={customDecorators}
					stripPastedStyles={true}
				/>
				{hasMentionsUser && (
					<MentionSuggestions
						open={open}
						onOpenChange={onOpenChange}
						suggestions={suggestions}
						onSearchChange={onSearchChange}
					/>
				)}
			</div>
		</>
	);
}

RichTextEditor.defaultProps = {
	content: '',
	setContent: () => {},
	setUrlAdded: () => {},
	hasMentionsUser: false,
	placeholder: '',
	handleKeyBind: () => {},
	handleKeyPress: () => {},
	className: '',
	clickReply: false,
	createCmt: false,
	mentionUsersArr: [],
	setMentionUsersArr: () => {},
	commentLv1Id: undefined,
	replyingCommentId: -1,
};

RichTextEditor.propTypes = {
	content: PropTypes.string,
	setContent: PropTypes.func,
	setUrlAdded: PropTypes.func,
	hasMentionsUser: PropTypes.bool,
	placeholder: PropTypes.string,
	handleKeyBind: PropTypes.func,
	handleKeyPress: PropTypes.func,
	className: PropTypes.string,
	clickReply: PropTypes.bool,
	commentLv1Id: PropTypes.number,
	replyingCommentId: PropTypes.number,
	createCmt: PropTypes.bool,
	mentionUsersArr: PropTypes.array,
	setMentionUsersArr: PropTypes.func,
	hasUrl: PropTypes.bool,
	offsetKey: PropTypes.any,
	children: PropTypes.any,
};

export default memo(RichTextEditor);
