import React, { ReactElement, CSSProperties, MouseEvent, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

import clsx from './styles.module.css'
import logo from './assets/logo.png'
import footerLogo from './assets/footer-logo.png'

// interfaces
type LogoProps = {}

type FooterProps = {
  links: Array<IFooterLink>
  socialLinks: Array<IFooterSocialLink>
}

type ButtonProps = {
  style: CSSProperties
  radius: boolean
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  text: string
}

export interface IFooterLink {
  path: string
  title: string
}

export interface IFooterSocialLink {
  path: string
  component: ReactNode
}

export interface ICard {
  bgColor: string
  image: string
  value: string
  title: string
  shadow: string
}

export const Logo: React.FC<LogoProps> = (): ReactElement => <img src={logo} alt="Logo" className={clsx.logo} />

export const Button: React.FC<ButtonProps> = ({ style, onClick, text, radius }): ReactElement => {
  let buttonStyle = {
    borderRadius: radius ? 4 : 'none',
  }
  return (
    <button style={{ ...style, ...buttonStyle }} onClick={onClick}>
      {text}
    </button>
  )
}

export const Card: React.FC<ICard> = ({ bgColor, image, value, title, shadow }): ReactElement => {
  const imagebgStyle: CSSProperties = {
    backgroundColor: bgColor,
    boxShadow: shadow,
  }
  return (
    <div className={clsx.card}>
      <div className={clsx.card_image} style={imagebgStyle}>
        <img src={image} alt="Image" />
      </div>
      <div className={clsx.card_bottom}>
        <h5>{value}</h5>
        <p>{title}</p>
      </div>
    </div>
  )
}

export const Footer: React.FC<FooterProps> = ({ links, socialLinks }): ReactElement => (
  <div className={clsx.footer}>
    <div className={clsx.footer_desktop}>
      <div className={clsx.footer_top}>
        <div className={clsx.footer_top__left}>
          {links.map(({ path, title }, i) => (
            <NavLink to={path} key={i}>
              {title}
            </NavLink>
          ))}
        </div>
        <div className={clsx.footer_top__right}>
          {socialLinks.map(({ path, component }, i) => (
            <NavLink to={path} key={i}>
              {component}
            </NavLink>
          ))}
        </div>
      </div>
      <hr />
      <div className={clsx.footer_bottom}>
        <p>{new Date().getFullYear()} INDOEX All Rights Reserved</p>
        <img src={footerLogo} alt="Footer Logo" />
      </div>
    </div>

    <div className={clsx.footer_mobile}>
      <hr />
      <div className={clsx.footer_mobile__top}>
        <div className={clsx.mobile_top__left}>
          {links.map(({ path, title }, i) => (
            <NavLink to={path} key={i}>
              {title}
            </NavLink>
          ))}
        </div>
        <div className={clsx.mobile_top__right}>
          <img src={footerLogo} alt="Footer Logo" />
          {socialLinks.map(({ path, component }, i) => (
            <NavLink to={path} key={i}>
              {component}
            </NavLink>
          ))}
        </div>
      </div>
      <div className={clsx.footer_mobile__bottom}>
        <p>{new Date().getFullYear()} INDOEX All Rights Reserved</p>
      </div>
    </div>
  </div>
)
