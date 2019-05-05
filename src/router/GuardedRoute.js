import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { useContextWrapper } from 'hooks';
import Guard from './Guard';
import { GuardContext, LoadingPageContext, ErrorPageContext } from './constants';

const GuardedRoute = ({
  beforeEnter,
  children,
  component,
  error,
  loading,
  render,
  ...routeProps
}) => {
  const globalGuards = useContext(GuardContext);

  const guards = [...globalGuards];
  if (beforeEnter) {
    guards.push(beforeEnter);
  }

  const [LoadingProvider, loadingProps] = useContextWrapper(loading, LoadingPageContext);
  const [ErrorProvider, errorProps] = useContextWrapper(error, ErrorPageContext);

  return (
    <Route
      {...routeProps}
      render={() => (
        <GuardContext.Provider value={guards}>
          <LoadingProvider {...loadingProps}>
            <ErrorProvider {...errorProps}>
              <Guard children={children} component={component} render={render} />
            </ErrorProvider>
          </LoadingProvider>
        </GuardContext.Provider>
      )}
    />
  );
};

GuardedRoute.propTypes = {
  ...Route.propTypes,
  beforeEnter: PropTypes.func,
  error: PropTypes.func,
  loading: PropTypes.func,
};

export default GuardedRoute;