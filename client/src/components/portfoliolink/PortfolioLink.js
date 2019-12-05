import React, { useState } from 'react';
import { useSpring, animated, config } from 'react-spring';

import './PortfolioLink.scss';

const PortfolioLink = () => {
  const [displayLink, setDisplayLink] = useState(true);

  const toggleDisplay = () => {
    setDisplayLink(!displayLink);
  };

  const animationProps = useSpring({
    position: 'absolute',
    opacity: displayLink ? 1 : 0,
    right: displayLink ? 0 : -300,
    config: config.wobbly
  });

  const reverseAnimationProps = useSpring({
    top: '6rem',
    position: 'absolute',
    right: displayLink ? -300 : 0,
    opacity: displayLink ? 0 : 1,
    config: config.wobbly
  });
  return (
    <>
      <animated.div style={animationProps}>
        <div className='app-portfoliolink'>
          <div className='app-closeportfoliolink'>
            <i
              className='fa fa-times'
              aria-hidden='true'
              onClick={toggleDisplay}
            ></i>
          </div>
          <b>MERN Social Media</b> - Thomas Foydel 2019{' '}
          <a
            href='https://thomasfoydel.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <b> back to my portfolio</b>
          </a>
        </div>
      </animated.div>
      <animated.div style={reverseAnimationProps}>
        <div className='app-openportfoliolink' onClick={toggleDisplay}>
          open portfolio link
        </div>
      </animated.div>
    </>
  );
};

export default PortfolioLink;
