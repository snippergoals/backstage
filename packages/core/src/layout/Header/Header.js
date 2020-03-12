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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles, Tooltip } from '@material-ui/core';
import { Theme } from '../Page/Page';
// import { Link } from 'shared/components';
import Waves from './Waves';
import Helmet from 'react-helmet';

class Header extends Component {
  static propTypes = {
    type: PropTypes.string,
    typeLink: PropTypes.string,
    title: PropTypes.node.isRequired,
    tooltip: PropTypes.string,
    subtitle: PropTypes.node,
    pageTitleOverride: PropTypes.string,
    style: PropTypes.object,
    component: PropTypes.object,
  };

  typeFragment() {
    const { type, typeLink, classes } = this.props;
    if (!type) {
      return null;
    }

    return typeLink ? (
      // <Link to={typeLink}>
      <Typography className={classes.type}>{type}</Typography>
    ) : (
      // </Link>
      <Typography className={classes.type}>{type}</Typography>
    );
  }

  titleFragment() {
    const { title, pageTitleOverride, classes, tooltip } = this.props;
    const FinalTitle = (
      <Typography className={classes.title} variant="h4">
        {title || pageTitleOverride}
      </Typography>
    );
    if (tooltip) {
      return (
        <Tooltip title={tooltip} placement="top-start">
          {FinalTitle}
        </Tooltip>
      );
    }
    return FinalTitle;
  }

  subtitleFragment() {
    const { subtitle, classes } = this.props;
    if (!subtitle) {
      return null;
    } else if (typeof subtitle !== 'string') {
      return subtitle;
    }

    return (
      <Typography className={classes.subtitle} variant="subtitle1">
        {subtitle}
      </Typography>
    );
  }

  render() {
    const { title, pageTitleOverride, children, style, classes } = this.props;
    const pageTitle = pageTitleOverride || title;
    return (
      <Fragment>
        <Helmet
          titleTemplate={`${pageTitle} | %s | Backstage`}
          defaultTitle={`${pageTitle} | Backstage`}
        />
        <Theme.Consumer>
          {theme => (
            <header style={style} className={classes.header}>
              <Waves theme={theme} />
              <div className={classes.leftItemsBox}>
                {this.typeFragment()}
                {this.titleFragment()}
                {this.subtitleFragment()}
              </div>
              <div className={classes.rightItemsBox}>{children}</div>
            </header>
          )}
        </Theme.Consumer>
      </Fragment>
    );
  }
}

const styles = theme => ({
  header: {
    gridArea: 'pageHeader',
    padding: theme.spacing(3),
    minHeight: 118,
    width: '100%',
    boxShadow: '0 0 8px 3px rgba(20, 20, 20, 0.3)',
    position: 'relative',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  leftItemsBox: {
    flex: '1 1 auto',
  },
  rightItemsBox: {
    flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginRight: theme.spacing(6),
  },
  title: {
    color: theme.palette.bursts.fontColor,
    lineHeight: '1.0em',
    wordBreak: 'break-all',
    fontSize: 'calc(24px + 6 * ((100vw - 320px) / 680))',
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.0em',
  },
  type: {
    textTransform: 'uppercase',
    fontSize: 9,
    opacity: 0.8,
    marginBottom: 10,
    color: theme.palette.bursts.fontColor,
  },
});

export default withStyles(styles)(Header);
