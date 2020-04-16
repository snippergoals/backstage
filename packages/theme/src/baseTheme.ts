/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createMuiTheme } from '@material-ui/core';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';
import { blue, yellow } from '@material-ui/core/colors';
import {
  BackstageTheme,
  BackstageThemeOptions,
  BackstageColorScheme,
} from './types';

type Overrides = Partial<BackstageTheme['overrides']>;

export function createThemeOptions(
  type: 'light' | 'dark',
  colors: BackstageColorScheme,
): BackstageThemeOptions {
  return {
    props: {
      MuiGrid: {
        spacing: 2,
      },
      MuiSwitch: {
        color: 'primary',
      },
    },
    palette: {
      type,
      background: {
        default: colors.PAGE_BACKGROUND,
        // @ts-ignore
        informational: '#60a3cb',
      },
      color: {
        default: colors.TEXT_COLOR,
      },
      status: {
        ok: colors.STATUS_OK,
        warning: colors.STATUS_WARNING,
        error: colors.STATUS_ERROR,
        running: '#BEBEBE',
        pending: '#5BC0DE',
        background: colors.NAMED_WHITE,
      },
      bursts: {
        fontColor: colors.NAMED_WHITE,
        slackChannelText: '#ddd',
        backgroundColor: {
          default: colors.DEFAULT_PAGE_THEME_COLOR,
        },
      },
      // @ts-ignore
      primary: {
        main: blue[500],
      },
      border: '#E6E6E6',
      textVerySubtle: '#DDD',
      textSubtle: '#6E6E6E',
      highlight: '#FFFBCC',
      errorBackground: colors.ERROR_BACKGROUND_COLOR,
      warningBackground: '#F59B23',
      infoBackground: '#ebf5ff',
      errorText: colors.ERROR_TEXT_COLOR,
      infoText: colors.INFO_TEXT_COLOR,
      warningText: colors.NAMED_WHITE,
      linkHover: colors.LINK_TEXT_HOVER,
      link: colors.LINK_TEXT,
      gold: yellow.A700,
      sidebar: colors.SIDEBAR_BACKGROUND_COLOR,
    },
    navigation: {
      width: 220,
      background: '#333333',
    },
    typography: {
      fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
      h5: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 700,
        fontSize: 28,
        marginBottom: 6,
      },
      h3: {
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 6,
      },
      h2: {
        fontSize: 40,
        fontWeight: 700,
        marginBottom: 8,
      },
      h1: {
        fontSize: 54,
        fontWeight: 700,
        marginBottom: 10,
      },
    },
  };
}

export function createThemeOverrides(theme: BackstageTheme): Overrides {
  return {
    MuiTableRow: {
      // Alternating row backgrounds
      root: {
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.background.default,
        },
      },
      // Use pointer for hoverable rows
      hover: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      // Alternating head backgrounds
      head: {
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.background.paper,
        },
      },
    },
    // Tables are more dense than default mui tables
    MuiTableCell: {
      root: {
        wordBreak: 'break-word',
        overflow: 'hidden',
        verticalAlign: 'middle',
        lineHeight: '1',
        margin: 0,
        padding: '8px',
        borderBottom: 0,
      },
      head: {
        wordBreak: 'break-word',
        overflow: 'hidden',
        color: 'rgb(179, 179, 179)',
        fontWeight: 'normal',
        lineHeight: '1',
      },
    },
    MuiTabs: {
      // Tabs are smaller than default mui tab rows
      root: {
        minHeight: 24,
      },
    },
    MuiTab: {
      // Tabs are smaller and have a hover background
      root: {
        color: theme.palette.link,
        minHeight: 24,
        textTransform: 'initial',
        '&:hover': {
          color: darken(theme.palette.link, 0.3),
          background: lighten(theme.palette.link, 0.95),
        },
        [theme.breakpoints.up('md')]: {
          minWidth: 120,
          fontSize: theme.typography.pxToRem(14),
          fontWeight: 500,
        },
      },
      textColorPrimary: {
        color: theme.palette.link,
      },
    },
    MuiTableSortLabel: {
      // No color change on hover, just rely on the arrow showing up instead.
      root: {
        color: 'inherit',
        '&:hover': {
          color: 'inherit',
        },
        '&:focus': {
          color: 'inherit',
        },
      },
      // Bold font for highlighting selected column
      active: {
        fontWeight: 'bold',
        color: 'inherit',
      },
    },
    MuiListItemText: {
      dense: {
        // Default dense list items to adding ellipsis for really long str...
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
    MuiButton: {
      text: {
        // Text buttons have less padding by default, but we want to keep the original padding
        padding: undefined,
      },
    },
    MuiChip: {
      root: {
        // By default there's no margin, but it's usually wanted, so we add some trailing margin
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    MuiCardHeader: {
      root: {
        // Reduce padding between header and content
        paddingBottom: 0,
      },
    },
    MuiCardActions: {
      root: {
        // We default to putting the card actions at the end
        justifyContent: 'flex-end',
      },
    },
  };
}

// Creates a Backstage MUI theme using a color scheme.
// The theme is created with the common Backstage options and component styles.
export function createTheme(
  type: 'light' | 'dark',
  colors: BackstageColorScheme,
): BackstageTheme {
  const themeOptions = createThemeOptions(type, colors);
  const baseTheme = createMuiTheme(themeOptions) as BackstageTheme;
  const overrides = createThemeOverrides(baseTheme);
  const theme = { ...baseTheme, overrides };
  return theme;
}
