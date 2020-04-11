import {darken, lighten} from 'polished'
import {fonts} from '../src/lib/typography'

const brand = {
  primary: '#fa8e01',
  secondary: '#eb7200',
  contrast: '#151515',
}

const colors = {
  primary_light: `${lighten(0.55, brand.primary)}`,
  gray: '#404040',
  black: '#000',
  white: '#fff',
  off_white: '#fafafa',
  body_color: '#404040',
  link_color: brand.primary,
  link_color_hover: `${darken(0.07, brand.primary)}`,
  green: '#17A974',
  get light() {
    return this.off_white
  },
  get dark() {
    return this.gray
  },
}

const theme = {
  colors,
  fonts,
  brand,
  breakpoints: {
    xs: '400px',
    s: '600px',
    m: '900px',
    l: '1200px',
  },
  container: {
    base: '100rem',
    text: '55rem',
  },
  spacer: {
    horizontal: '2rem',
    vertical: '3rem',
  },
  transition: {
    ease: 'all 100ms ease',
  },
}

export default theme
