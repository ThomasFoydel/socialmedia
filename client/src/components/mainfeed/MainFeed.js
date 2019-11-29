import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { connect } from 'react-redux';
import FeedPost from '../feedpost/FeedPost';
import PostForm from '../postform/PostForm';
import { useSpring, animated, config } from 'react-spring';

import { setPosts } from '../../redux/posts/postActions';

import './MainFeed.scss';

const MainFeed = ({ setReduxPosts, reduxPosts, token, isLoggedIn }) => {
  const [postFormOpen, setPostFormOpen] = useState(false);
  const [count, setCount] = useState(5);
  const [start, setStart] = useState(1);
  const [morePostsExist, setMorePostsExist] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      const fetchedPosts = await Axios.get(
        `/post/scrollposts?count=${count}&start=${start}`,

        {
          headers: { 'x-auth-token': token }
        }
      );
      return fetchedPosts;
    };

    getPosts().then(result => {
      // console.log('rezz: ', result);
      setReduxPosts([...result.data]);
    });
  }, [setReduxPosts, token]);

  const fetchMorePosts = () => {
    const updateStartPromise = new Promise((resolve, reject) => {
      setStart(start + 1);
      resolve(start + 1);
    });

    updateStartPromise.then(result => {
      Axios.get(`/post/scrollposts?count=${count}&start=${result}`).then(
        result => {
          if (result.data.length !== count) {
            setMorePostsExist(false);
          }
          setReduxPosts(reduxPosts.concat(result.data));
          console.log('fetch more posts. result: ', result);
        }
      );
    });
  };

  const animationProps = useSpring({
    opacity: postFormOpen ? 1 : 0,
    maxHeight: postFormOpen ? '45rem' : '0.1rem',
    display: postFormOpen ? 'inherit' : 'none',
    config: { mass: 1, tension: 300, friction: 38 }
  });

  const reverseAnimationProps = useSpring({
    opacity: postFormOpen ? 0 : 1,
    config: { mass: 1, tension: 300, friction: 38 }
  });

  return (
    <>
      <div className='mainfeedcontainer'>
        {reduxPosts.length > 0 && (
          <InfiniteScroll
            dataLength={reduxPosts.length}
            next={fetchMorePosts}
            hasMore={morePostsExist}
            loader={
              <h3 className='mainfeedscrollloading'>loading more posts...</h3>
            }
          >
            {reduxPosts.map(post => {
              return (
                <FeedPost
                  key={post._id}
                  post={post}
                  isLoggedIn={isLoggedIn}
                ></FeedPost>
              );
            })}
          </InfiniteScroll>
        )}
      </div>
      {isLoggedIn && (
        <>
          <animated.div style={animationProps}>
            <PostForm setPostFormOpen={setPostFormOpen} />
          </animated.div>
          <animated.div style={reverseAnimationProps}>
            <button
              className='postformopenbutton'
              onClick={() => setPostFormOpen(true)}
            >
              new post
            </button>
          </animated.div>
        </>
      )}
    </>
  );
};

const mapStateToProps = state => {
  return {
    reduxPosts: state.posts.posts,
    token: state.auth.token
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setReduxPosts: posts => dispatch(setPosts(posts))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainFeed);

// import React, { useState, useEffect } from 'react';
// import { useTransition, animated, config } from 'react-spring';
// import Axios from 'axios';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { connect } from 'react-redux';
// import FeedPost from '../feedpost/FeedPost';
// import PostForm from '../postform/PostForm';

// import { setPosts } from '../../redux/posts/postActions';

// import './MainFeed.scss';

// const MainFeed = ({ setReduxPosts, reduxPosts, token, isLoggedIn }) => {
//   const [postFormOpen, setPostFormOpen] = useState(false);
//   const [count, setCount] = useState(5);
//   const [start, setStart] = useState(1);

//   useEffect(() => {
//     const getPosts = async () => {
//       const fetchedPosts = await Axios.get(
//         `/post/scrollposts?count=${count}&start=${start}`,

//         {
//           headers: { 'x-auth-token': token }
//         }
//       );
//       return fetchedPosts;
//     };

//     getPosts().then(result => {
//       setReduxPosts([...result.data]);
//     });
//   }, [setReduxPosts, token, count, start]);

//   const fetchMorePosts = () => {
//     const updateStartPromise = new Promise((resolve, reject) => {
//       setStart(start + 1);
//       resolve(start + 1);
//     });

//     updateStartPromise.then(result => {
//       Axios.get(`/post/scrollposts?count=${count}&start=${result}`).then(
//         result => {
//           console.log('axios call to scroll post result: ', result);
//           console.log('reduxPosts: ', reduxPosts);
//           // setReduxPosts(reduxPosts.concat(result.data));
//         }
//       );
//     });
//   };

//   const transition = useTransition(reduxPosts, post => post._id, {
//     from: { opacity: 0, marginTop: -100, marginRight: 0 },
//     enter: { opacity: 1, marginTop: 0, marginRight: 0 },
//     leave: { opacity: 0, marginRight: -600 },
//     config: config.gentle
//   });

//   return (
//     <>
//       <div className='mainfeedcontainer'>
//         {reduxPosts.length > 0 && (
//           <InfiniteScroll
//             dataLength={reduxPosts.length}
//             next={fetchMorePosts}
//             hasMore={true}
//             loader={
//               <h3 className='mainfeedscrollloading'>loading more posts...</h3>
//             }
//           >
//             {transition.map(({ item, key, props }) => {
//               if (item.title) {
//                 return (
//                   <animated.div
//                     key={key}
//                     style={props}
//                     className='animatedstatus'
//                   >
//                     <FeedPost key={item._id} post={item}></FeedPost>
//                   </animated.div>
//                 );
//               } else return null;
//             })}
//           </InfiniteScroll>
//         )}
//       </div>
//       {isLoggedIn && (
//         <>
//           {postFormOpen ? (
//             <PostForm setPostFormOpen={setPostFormOpen} />
//           ) : (
//             <button
//               className='postformopenbutton'
//               onClick={() => setPostFormOpen(true)}
//             >
//               new post
//             </button>
//           )}
//         </>
//       )}
//     </>
//   );
// };

// const mapStateToProps = state => {
//   return {
//     reduxPosts: state.posts.posts,
//     token: state.auth.token
//   };
// };
// const mapDispatchToProps = dispatch => {
//   return {
//     setReduxPosts: posts => dispatch(setPosts(posts))
//   };
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(MainFeed);
