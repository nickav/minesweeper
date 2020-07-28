// ------------------------------------------------------------------------------
// Node Modules -----------------------------------------------------------------
import classNames from 'classnames';
import React from 'react';
// ------------------------------------------------------------------------------
// Style ------------------------------------------------------------------------
import styles from './App.scss';
// ------------------------------------------------------------------------------
// Components -------------------------------------------------------------------
import { Header, Footer, Game } from '@/components/main';
//------------------------------------------------------------------------------
// React Class -----------------------------------------------------------------
class App extends React.Component {
  componentDidUpdate = (prevProps) => {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    }
  };

  render() {
    const cn = classNames(styles.App, {});

    return (
      <div className={cn}>
        <Header />
        <Game size={{ width: 16, height: 16 }} />
        <Footer />
      </div>
    );
  }
}
//------------------------------------------------------------------------------
// Export ----------------------------------------------------------------------
export default App;
