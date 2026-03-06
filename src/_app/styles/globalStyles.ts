'use client'

import { createGlobalStyle } from 'styled-components';
import {BREAKPOINTS, COLORS} from '@/app-proj/styles/variables';
import { H1Style, H2Style, H3Style, H4Style, P1Style } from '@/app-proj/styles/textTags';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
    font-weight: normal;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    //border: 1px pink solid;
    //outline: 1px pink solid;

    ::selection {
      color: black;
      background-color: rgba(255, 255, 255, 0.5);
    }
  }

  html {
    scroll-behavior: smooth;
    scroll-snap-type: y mandatory;
    scroll-padding: 0;
  }

  body {
    width: 100%;
    overflow-x: hidden;
    max-width: 100vw;
    background-color: ${COLORS.BG};
    color: inherit;
  }

  main {
    width: 100%;
    max-width: 1000px;
    margin: 80px auto;
		@media (${BREAKPOINTS.laptop}) {
			margin: 20px auto;
		}
  }

  p,
  a,
  br,
  span,
  img,
  div,
  ul,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  input,
  textarea {
    color: inherit;
    border: none;
  }

	h1 {
		${H1Style};
	}

	h2 {
		${H2Style};
	}

	h3 {
		${H3Style};
	}

	h4, h5, h6 {
		${H4Style};
	}

	p {
		${P1Style};
	}

  button {
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    outline: none;
    border: none;
    background: transparent;
    color: inherit;

    &:focus {

    }

    &:disabled {

    }
  }

  a {
    text-decoration: none;
    color: ${COLORS.grey};
		line-height: inherit;
    font-weight: inherit;
		font-size: inherit;
		-webkit-tap-highlight-color: rgba(0,0,0,0);
    transition: color 0.3s ease;
    &:hover {
      color: ${COLORS.white};
    }
    &::after {
      content: '↗';
    }
  }

	b {
		font-weight: 600 ;
	}
	
  ul, li {
    
    padding: 0;
    margin: 0;
  }

`;


