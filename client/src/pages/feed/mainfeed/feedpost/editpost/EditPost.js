import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import { connect } from 'react-redux';

import DeleteButton from '../../../../../components/deletebutton/DeleteButton';

import './EditPost.scss';

function EditPost({
  userName,
  userId,
  token,
  postId,
  setEditPostOpen,
  setCurrentPost,
  currentPost
}) {
  const { content, title, tags } = currentPost;
  const [titleValue, setTitleValue] = useState(title);
  const [postValue, setPostValue] = useState(content);
  const [updateStatusSuccess, setUpdateStatusSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [tagsValue, setTagsValue] = useState(tags);

  useEffect(() => {
    const getPost = async () => {
      const fetchedPost = await Axios.get(`/post/post/${postId}`, {
        headers: { 'x-auth-token': token }
      });
      setTitleValue(fetchedPost.data.title);
      setPostValue(fetchedPost.data.content);
      setTagsValue(fetchedPost.data.tags);
    };
    getPost();
  }, [postId, token]);

  const handleChange = e => {
    const { value } = e.target;
    switch (e.target.name) {
      case 'title':
        setTitleValue(value);
        break;
      case 'post':
        setPostValue(value);
        break;
      case 'tags':
        setTagsValue(value);
        break;
      default:
        break;
    }
  };

  const fileSelectedHandler = event => {
    setSelectedFile(event.target.files[0]);
  };

  const submitToBackEnd = async e => {
    e.preventDefault();
    if (selectedFile === null) {
      Axios.post(
        `/post/editpost/${postId}`,
        {
          authorId: userId,
          authorName: userName,
          newTitle: titleValue,
          newContent: postValue,
          newTags: tagsValue
        },
        {
          headers: { 'Content-Type': 'application/json', 'x-auth-token': token }
        }
      )
        .then(result => {
          if (result.request.status === 201) {
            setUpdateStatusSuccess(true);
            setCurrentPost(result.data);
          }
        })
        .catch(err => console.log(err));
      setPostValue('');
      setTitleValue('');
      setSelectedFile(null);
    } else {
      const fd = new FormData();
      fd.append('contentImage', selectedFile, selectedFile.name);
      fd.append('authorId', userId);
      fd.append('authorName', userName);
      fd.append('newTitle', titleValue);
      fd.append('newContent', postValue);
      fd.append('tags', tagsValue);

      e.preventDefault();
      Axios.post(`/post/editpostwithimage/${postId}`, fd, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      })
        .then(result => {
          if (result.request.status === 201) {
            setUpdateStatusSuccess(true);
          }
        })
        .catch(err => console.log(err));

      setPostValue('');
      setTitleValue('');
      setSelectedFile(null);
    }
  };
  return updateStatusSuccess ? (
    <Redirect to='/feed' />
  ) : (
    <div className='editpostformoutsidecontainer'>
      <div className='editpostform'>
        <div className='editpostforminsidecontainer'>
          <i
            className='fa fa-2x fa-times editpostformclosebutton'
            aria-hidden='true'
            onClick={() => setEditPostOpen(false)}
          ></i>

          <form onSubmit={submitToBackEnd}>
            <label type='text' name='title'>
              <input
                name='title'
                type='text'
                className='editpostforminput editpostformtitle '
                value={titleValue}
                onChange={handleChange}
              />
            </label>
            <label type='text' name='post'>
              <textarea
                name='post'
                type='text'
                className='editpostforminput editpostformpost'
                value={postValue}
                onChange={handleChange}
              />
            </label>
            <label type='text' name='tags'>
              <input
                name='tags'
                type='text'
                className='editpostforminput editpostformtags '
                value={tagsValue || ['']}
                placeholder='tags...'
                onChange={handleChange}
              />
            </label>
            <div className='flex'>
              <input
                className='editpostfileinput'
                onChange={fileSelectedHandler}
                type='file'
                name='file'
                id='file'
              />
              <label
                className={`editpostfileinputlabel editpostformbuttons selectedfile${selectedFile &&
                  'true'}`}
                htmlFor='file'
              >
                {selectedFile ? (
                  <i
                    className='fa fa-check editpostfileinputlabelcheck'
                    aria-hidden='true'
                  ></i>
                ) : (
                  <>new pic</>
                )}
              </label>
              <input
                type='submit'
                className='submitbutton editpostformbuttons'
                value='submit'
              />
              {openDelete ? (
                <>
                  <div
                    className='editpostcanceldelete'
                    onClick={() => setOpenDelete(false)}
                  >
                    cancel
                  </div>
                  <DeleteButton postId={postId} />
                </>
              ) : (
                <div
                  className='editpostopendeletebutton'
                  onClick={() => setOpenDelete(true)}
                >
                  <i className='fa fa-trash' aria-hidden='true'></i>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = state => ({
  userId: state.auth.userId,
  token: state.auth.token,
  userName: state.currentUser.userName
});

export default connect(mapStateToProps)(EditPost);
