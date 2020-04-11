import React from 'react'
import Link from './link'
import {css} from '@emotion/core'
import styled from '@emotion/styled'
import theme from '../../config/theme'
import {fonts} from '../lib/typography'
import logo from '../images/logo.png'
import MobileNav from './mobile-nav'
import Container from './container'
import {bpMaxSM} from '../lib/breakpoints'
import {lighten} from 'polished'

function HeaderLink({activeClassName = 'active', ...props}) {
  return (
    <Link
      activeClassName={activeClassName}
      partiallyActive={true}
      css={{
        textDecoration: 'none',
        color: theme.colors.light,
        '&:hover,&:focus': {
          background: lighten(0.4, theme.brand.primary),
        },
        '&.active': {
          background: theme.brand.primary,
        },
      }}
      {...props}
    />
  )
}

const NavLink = styled(HeaderLink)({
  padding: '8px 10px',
  borderRadius: '3px',
  background: 'transparent',
  '& + &': {marginLeft: 10},
  [bpMaxSM]: {
    display: 'none',
  },
})

function Header({
  dark,
  bgColor = 'none',
  siteTitle,
  headerLink = '/',
  fixed = false,
  headerImage = true,
  maxWidth = 720,
}) {
  return (
    <header
      css={css`
        width: 100%;
        flex-shrink: 0;
        background: none;
        padding: 30px 0 0 0;
        ${bpMaxSM} {
          padding: 35px 0 0 0;
        }
        background: ${dark ? '#090909' : `${bgColor}` || 'none'};
        z-index: 10;
        position: ${fixed ? 'fixed' : 'absolute'};
        top: 0;
        font-family: ${fonts.light};
      `}
    >
      <Container maxWidth={maxWidth} noVerticalPadding>
        <nav
          css={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <HeaderLink
            to={headerLink}
            aria-label="go to homepage"
            activeClassName="none"
            css={{
              position: 'relative',
              fontFamily: fonts.regular,
              display: 'flex',
              alignItems: 'center',
              img: {
                marginBottom: 0,
                maxWidth: '50px',
                position: 'absolute',
                borderRadius: '100%',
                background: '#f1f1f1',
              },
              ':hover, :focus': {
                background: 'transparent',
              },
              span: {
                transform: headerImage && 'translateX(60px)',
              },
            }}
          >
            {headerImage && <img src={logo} alt="MrMadHat Logo" />}{' '}
            <span>{siteTitle}</span>
          </HeaderLink>
          <div
            css={css`
              font-size: 16px;
              line-height: 1.25;
              display: flex;
              align-items: center;
              .mobile-nav {
                display: none;
                visibility: hidden;
                ${bpMaxSM} {
                  display: block;
                  visibility: visible;
                }
              }
            `}
          >
            <MobileNav />
            <NavLink to="/articles/" aria-label="View articles page">
              Articles
            </NavLink>
            <NavLink to="/about/" aria-label="View about page">
              About
            </NavLink>
          </div>
        </nav>
      </Container>
    </header>
  )
}

export default Header
