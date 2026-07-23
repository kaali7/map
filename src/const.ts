import type { Theme, ThemeCssVar } from '.'

export const LEFT = 0
export const RIGHT = 1
export const SIDE = 2
export const DOWN = 3

export const THEME: Theme & { cssVar: ThemeCssVar } = {
  name: 'Latte',
  type: 'light',
  palette: ['#dd7878', '#ea76cb', '#8839ef', '#e64553', '#fe640b', '#df8e1d', '#40a02b', '#209fb5', '#1e66f5', '#7287fd'],
  cssVar: {
    '--node-gap-x': '30px',
    '--node-gap-y': '10px',
    '--main-gap-x': '65px',
    '--main-gap-y': '45px',
    '--root-radius': '30px',
    '--main-radius': '20px',
    '--root-color': '#111827',
    '--root-bgcolor': '#ffffff',
    '--root-border-color': '#e2e8f0',
    '--main-border': '1.5px solid #e2e8f0',
    '--main-color': '#111827',
    '--main-bgcolor': '#ffffff',
    '--main-bgcolor-transparent': 'rgba(255, 255, 255, 0.8)',
    '--topic-padding': '3px',
    '--color': '#777777',
    '--bgcolor': '#f6f6f6',
    '--selected': '#4dc4ff',
    '--accent-color': '#e64553',
    '--panel-color': '#444446',
    '--panel-bgcolor': '#ffffff',
    '--panel-border-color': '#eaeaea',
    '--map-padding': '50px 80px',
  },
}

export const DARK_THEME: Theme & { cssVar: ThemeCssVar } = {
  name: 'Dark',
  type: 'dark',
  palette: ['#2563eb', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#748BE9', '#EF987F', '#775DD5', '#DA7FBC'],
  cssVar: {
    '--node-gap-x': '30px',
    '--node-gap-y': '10px',
    '--main-gap-x': '65px',
    '--main-gap-y': '45px',
    '--root-radius': '30px',
    '--main-radius': '20px',
    '--root-color': '#f8f9fa',
    '--root-bgcolor': '#121212',
    '--root-border-color': 'rgba(0,0,0,0)',
    '--main-border': 'none',
    '--main-color': '#f8f9fa',
    '--main-bgcolor': 'transparent',
    '--main-bgcolor-transparent': 'rgba(18, 18, 18, 0.8)',
    '--topic-padding': '3px',
    '--color': '#ced4da',
    '--bgcolor': '#121212',
    '--selected': '#343a40',
    '--accent-color': '#8b5cf6',
    '--panel-color': '#ffffff',
    '--panel-bgcolor': '#2d3748',
    '--panel-border-color': '#696969',
    '--map-padding': '50px 80px',
  },
}
