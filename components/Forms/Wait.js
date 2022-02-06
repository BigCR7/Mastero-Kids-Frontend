import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from '~/i18n';
import AuthFrame from './AuthFrame';
import useStyles from './form-style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../store/actions/main';
import jwtDecode from 'jwt-decode';
import { getCookieFromBrowser } from '../../utils/cookie';

function WaitForm(props) {
  if (props.access_token !== undefined && props.access_token !== null) {
    props.verify_email_token({access_token : props.access_token});
    return <div></div>;
  }

  let token = getCookieFromBrowser('token');
  let decodedToken = null;
  if (token)
    decodedToken = jwtDecode(token);

  const classes = useStyles();
  const { t } = props;

  const handleLogout = (event) => {
    event.preventDefault();
    props.deauthenticate();
  }

  return (
    <AuthFrame title={t('common:login_title')} subtitle={t('common:login_subtitle')} isverification = {true}>
      <div>
        <div className={classes.head}>
          <Typography align="left" className={classes.titleText}>
            {t('common:wait_title')}
          </Typography>
          <Button size="small" className={classes.buttonLink} onClick={handleLogout}>
            <Icon className={clsx(classes.icon, classes.signArrow)}>arrow_forward</Icon>
            {t('common:verification_logout')}
          </Button>
        </div>
        <div>
          <Typography>
            {t('common:wait_description')}
          </Typography>
        </div>

        <div>
          <Typography>
            Email: {decodedToken !== null && decodedToken.email}
          </Typography>
        </div>
      </div>
    </AuthFrame>
  );
}


WaitForm.propTypes = {
  t: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
      deauthenticate: actions.deauthenticate
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(withTranslation(['common'])(WaitForm));
