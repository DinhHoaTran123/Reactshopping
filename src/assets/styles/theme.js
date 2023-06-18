import { theme } from 'antd';

export const THEMES = {
  ORANGE: 'orange',
  BLUE: 'blue',
};

export const customTheme = {
  orange: {
    token: {
      colorPrimary: '#e18e3c',
      colorLink: '#fff',
      colorLinkHover: '#fff',
    },
    components: {
      Layout: {
        colorBgHeader: '#202123',
      },
    },
    algorithm: theme.darkAlgorithm,
  },
  blue: {
    token: {
      colorPrimary: '#6cc3c1',
      colorLink: '#0fb4b8',
      colorLinkHover: '#0f4b78',
    },
    components: {
      Layout: {
        colorBgHeader: '#fff',
      },
    },
  },
  default: theme.defaultConfig,
};
