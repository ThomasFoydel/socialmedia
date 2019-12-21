import React from 'react';
import Comment from './comment/Comment';
import { useTransition, animated, config } from 'react-spring';

const FeedPostCommentSection = ({
  commentsArray,
  _id,
  setCommentsArray,
  isLoggedIn
}) => {
  const transition = useTransition(commentsArray, comment => comment, {
    from: { opacity: 0, marginTop: -100 },
    enter: { opacity: 1, marginTop: 0 },
    leave: { opacity: 0, marginTop: -204 },
    config: config.wobbly
  });
  return (
    <>
      {commentsArray && (
        <>
          {transition.map(({ item, key, props }) => {
            return (
              <animated.div key={key} style={props} className='animatedcomment'>
                <Comment
                  comment={item}
                  commentsArray={commentsArray}
                  setCommentsArray={setCommentsArray}
                  postId={_id}
                  isLoggedIn={isLoggedIn}
                />
              </animated.div>
            );
          })}
        </>
      )}
    </>
  );
};

export default FeedPostCommentSection;
