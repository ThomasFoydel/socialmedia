import React, { useState } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { pushPost } from '../../redux/posts/postActions';

import loadingdots from '../../imgs/loadingdots.gif';

import './PostForm.scss';

function PostForm({
  userId,
  userName,
  token,
  pushToReduxPosts,
  setPostFormOpen
}) {
  const [titleValue, setTitleValue] = useState('');
  const [postValue, setPostValue] = useState('');
  const [tagsValue, setTagsValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitButtonPressed, setSubmitButtonPressed] = useState(false);

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
    if (postValue) {
      setSubmitButtonPressed(true);

      if (selectedFile !== null) {
        setSubmitButtonPressed(true);
        const fd = new FormData();
        fd.append('contentImage', selectedFile, selectedFile.name);

        fd.append('authorId', userId);
        fd.append('authorName', userName);
        fd.append('title', titleValue);
        fd.append('content', postValue);
        fd.append('hasImage', true);
        fd.append('tags', tagsValue);

        const createdPost = await Axios.post(
          'http://localhost:8000/post/createpost',
          fd,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            }
          }
        );

        // SEND POST TO REDUX
        pushToReduxPosts(createdPost.data);

        // RESET COMPONENT STATE INPUT VALUES
        setPostValue('');
        setTitleValue('');
        setSelectedFile(null);
        setPostFormOpen(false);
      } else if (selectedFile === null) {
        const createdPost = await Axios.post(
          'http://localhost:8000/post/createpost',
          {
            title: titleValue,
            content: postValue,
            authorName: userName,
            hasImage: false,
            tags: tagsValue
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            }
          }
        );

        // SEND POST TO REDUX
        pushToReduxPosts(createdPost.data);

        // RESET COMPONENT STATE INPUT VALUES

        setPostValue('');
        setTitleValue('');
        setSelectedFile(null);
        setPostFormOpen(false);
      }
    } else {
      setPostFormOpen(false);
    }
  };
  return (
    <div className='postformoutercontainer'>
      <form className='postform' onSubmit={submitToBackEnd}>
        <div className='postforminsidecontainer'>
          <i
            className='fa fa-times fa-2x closepostformbutton'
            aria-hidden='true'
            onClick={() => setPostFormOpen(false)}
          ></i>

          <input
            name='title'
            type='text'
            className='postforminput postformtitle '
            value={titleValue}
            onChange={handleChange}
            placeholder='title...'
          />

          <textarea
            name='post'
            type='text'
            className='postforminput postformpost'
            value={postValue}
            onChange={handleChange}
            placeholder='post...'
          />

          <input
            name='tags'
            type='text'
            className='postforminput postformtags '
            value={tagsValue}
            onChange={handleChange}
            placeholder='tags...'
          />
          <div className='postformbuttons'>
            <input
              className='postformfileinput'
              onChange={fileSelectedHandler}
              type='file'
              name='file'
              id='file'
            />
            <label
              className={`postformfileinputlabel postformselectedfile${selectedFile &&
                'true'}`}
              htmlFor='file'
            >
              {selectedFile ? (
                <i
                  className='fa fa-check postformfileinputlabelcheck'
                  aria-hidden='true'
                ></i>
              ) : (
                <>select image</>
              )}
            </label>
            {submitButtonPressed ? (
              <img
                alt='loading dots'
                className='loadingdots'
                src={loadingdots}
              />
            ) : (
              <input
                type='submit'
                className='postformsubmitbutton'
                value='Submit'
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = state => ({
  userId: state.auth.userId,
  userName: state.currentUser.userName,
  token: state.auth.token
});

const mapDispatchToProps = dispatch => ({
  pushToReduxPosts: post => dispatch(pushPost(post))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostForm);
