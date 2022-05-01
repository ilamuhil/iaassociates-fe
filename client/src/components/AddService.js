import { useState, useContext, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import {
	EditorState,
	convertToRaw,
	ContentState,
	convertFromHTML,
} from 'draft-js';
import './../styles/css/editor.css';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button, SvgIcon, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import draftToHtml from 'draftjs-to-html';
import { ReactComponent as DisketteSaveSvgrepoComIcon } from './../img/diskette-save-svgrepo-com.svg';
import AuthContext from '../context/AuthProvider';
import axios from "./../api/axios";
function AddService({ edit }) {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const ctx = useContext(AuthContext);
	const [description, setDescription] = useState('');
	const axiosPvt = ctx.useAxiosPrivate();
	const navigate = useNavigate();
	const [highlights1, setHighlights1] = useState('');
	const [highlights2, setHighlights2] = useState('');
	const [highlights3, setHighlights3] = useState('');
	const [highlights4, setHighlights4] = useState('');
	const [title, setTitle] = useState('');
	const [sac, satSAC] = useState('');
	const [file, setFile] = useState('');
	const { id } = useParams();
	useEffect(() => {
		const controller = new AbortController();
		if (edit) {
			axios
				.get(`/services/get-services/id/${id}`, {
					params: { description:true },
					signal: controller.signal,
				})
				.then(res => {
					let { title, description, highlights, SAC: sac } = res.data;
					setTitle(title);
					highlights = JSON.parse(highlights);
					setHighlights1(highlights[0]);
					setHighlights2(highlights[1]);
					setHighlights3(highlights[2]);
					setHighlights4(highlights[3]);
					satSAC(sac);
					setDescription(description);
					const blocksFromHTML = convertFromHTML(description);
					setEditorState(
						EditorState.createWithContent(
							ContentState.createFromBlockArray(
								blocksFromHTML.contentBlocks,
								blocksFromHTML.entityMap
							)
						)
					);
				})
				.catch(e => {
					console.error(e);
					toast.error('Could not gather service data');
				});
		}

		return () => {
			if (edit) {
				controller.abort();
			}
		};
	}, [ edit, id]);
	const updateService = () => {
		let toastid = toast.loading('Adding service to database');
		// if (file[0].type === 'image/jpeg' || file[0].type === 'image/png') {
		// 	const formdata = new FormData();
		// 	formdata.append(`image`, file[0]);
		// 	console.log(formdata);
		// 	axios
		// 		.post('https://api.imgur.com/3/image', formdata, {
		// 			headers: {
		// 				Authorization: `Client-ID ef941db893a655c`,
		// 				'Content-type': 'multipart/form-data',
		// 			},
		// 		})
		// 		.then(res => {
		// 			console.log(res.data);
		// 		})
		// 		.catch(e => console.error(e));
		// }
		axiosPvt
			.put(`/services/${id}`, {
				title,
				sac,
				highlights: [highlights1, highlights2, highlights3, highlights4],
				description,
			})
			.then(res => {
				toast.update(toastid, {
					isLoading: false,
					type: 'success',
					render: 'Changes saved successfully',
					autoClose: 1500,
				});
			})
			.catch(e => {
				if (e?.response) {
					if (e.response.status === 403) {
						navigate('/unauthorized');
					} else if (e.response.status === 401) {
						window.location.replace('/login');
						toast.update(toastid, {
							isLoading: false,
							type: 'error',
							render: e.response.data,
							autoClose: 2000,
						});
					} else {
						toast.update(toastid, {
							isLoading: false,
							type: 'error',
							render: 'Unknown error occurred. Please try again later',
							autoClose: 2000,
						});
					}
				} else {
					toast.update(toastid, {
						isLoading: false,
						type: 'error',
						render: 'Server Unavailable',
						autoClose: 2000,
					});
				}
			});
	};
	const addService = () => {
		let toastid = toast.loading('Adding service to database');
		axiosPvt
			.post('/services', {
				title,
				sac,
				highlights: [highlights1, highlights2, highlights3, highlights4],
				description,
			})
			.then(res => {
				toast.update(toastid, {
					isLoading: false,
					type: 'success',
					render: 'Changes saved successfully',
					autoClose: 1500,
				});
			})
			.catch(e => {
				if (e?.response) {
					if (e.response.status === 403) {
						navigate('/unauthorized');
					} else if (e.response.status === 401) {
						window.location.replace('/login');
					} else {
						toast.update(toastid, {
							isLoading: false,
							type: 'error',
							render: 'unknown error occurred. Please try again later',
							autoClose: 2000,
						});
					}
				}
			});
	};

	return (
		<>
			<div
				className='shadow rounded p-4 d-flex flex-column'
				style={{
					backgroundImage: 'linear-gradient(315deg, #e7eff9 0%, #cfd6e6 74%)',
				}}>
				<div className='row gy-3'>
					<div className='col-12'>
						<h1 className='text-center'>Create New Service</h1>
					</div>
					<div className='col-12'>
						<h4>Service Title</h4>
					</div>
					<div className='col-lg-4 col-md-8'>
						<TextField
							label='Service Title'
							variant='standard'
							fullWidth
							onChange={e => {
								setTitle(e.target.value);
							}}
						/>
					</div>
					<div className='col-12'>
						<h4>Service sac Code</h4>
						<small className='text-muted'>For Invoice purposes</small>
					</div>
					<div className='col-lg-4 col-md-8'>
						<TextField
							label='Service Sac Code'
							variant='standard'
							fullWidth
							onChange={e => {
								satSAC(e.target.value);
							}}
						/>
					</div>
					<div className='col-12'>
						<h5>Service Highlights</h5>
						<small className='text-muted'>
							This will be visible on the service overview page
						</small>
					</div>
					<div className='col-md-6 col-lg-3'>
						<TextField
							label='Highlight 1'
							variant='standard'
							fullWidth
							onChange={e => {
								setHighlights1(e.target.value);
							}}
						/>
					</div>
					<div className='col-md-6 col-lg-3'>
						<TextField
							label='Highlight 2'
							variant='standard'
							fullWidth
							onChange={e => {
								setHighlights2(e.target.value);
							}}
						/>
					</div>
					<div className='col-md-6 col-lg-3'>
						<TextField
							label='Highlight 3'
							variant='standard'
							fullWidth
							onChange={e => {
								setHighlights3(e.target.value);
							}}
						/>
					</div>
					<div className='col-md-6 col-lg-3'>
						<TextField
							label='Highlight 4'
							variant='standard'
							fullWidth
							onChange={e => {
								setHighlights4(e.target.value);
							}}
						/>
					</div>
					<div className='col-12'>
						<h5>Service Description</h5>
						<small className='text-muted'>
							This is blog content for services
						</small>
					</div>
					<Editor
						wrapperClassName='editorWrapper'
						editorClassName='editorStyles scroll bg-light'
						toolbarClassName='toolbarStyles bg-light'
						editorState={editorState}
						onEditorStateChange={editorState => {
							setEditorState(editorState);
							setDescription(
								draftToHtml(convertToRaw(editorState.getCurrentContent()))
							);
						}}
					/>
					<div className='col-12'>
						<Button
							variant='contained'
							onClick={() => {
								if (edit) {
									updateService();
								} else {
									addService();
								}
							}}
							color={edit ? 'warning' : 'success'}
							endIcon={
								<SvgIcon>
									<DisketteSaveSvgrepoComIcon />
								</SvgIcon>
							}>
							Save changes
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}

export default AddService;
