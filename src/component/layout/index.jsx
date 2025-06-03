import Header from '../header/index.jsx';
import Footer from '../footer/index.jsx';

const Layout = ({children}) => {
  return (
    <>
      {/*region header*/}
      <Header />
      {/*endregion header*/}

      {/*region body content*/}
      <main>{children}</main>
      {/*endregion body content*/}

      {/*region footer*/}
      <Footer />
      {/*endregion footer*/}
    </>
  );
};

export default Layout;
