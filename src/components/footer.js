import React from 'react'
import {css} from '@emotion/core'
import theme from '../../config/theme'
import {bpMaxSM} from '../lib/breakpoints'
import SubscribeForm from './forms/subscribe'
import {Twitter, GitHub, RSS} from './social'
import Container from './container'

const Footer = ({subscribeForm = <SubscribeForm />, maxWidth}) => (
  <footer
    css={css`
      background: ${theme.colors.dark};
      color: white;
      margin-top: 70px;
    `}
  >
    <Container
      maxWidth={maxWidth}
      css={css`
        padding-top: 0;
        padding-bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        ${bpMaxSM} {
          padding-top: 0;
          flex-direction: column;
        }
      `}
    >
      {subscribeForm ? (
        <div css={{marginTop: -40}}>
          {subscribeForm}
          <br />
          <br />
        </div>
      ) : null}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          div,
          img {
            margin: 50px 0;
            ${bpMaxSM} {
              margin: 20px 0;
            }
          }
          ${bpMaxSM} {
            align-items: center;
          }
        `}
      >
        <div>
          <Twitter />
          <GitHub />
          <RSS />
        </div>
      </div>
    </Container>
  </footer>
)

export default Footer
