import Header from '../header/index.jsx';
import Footer from '../footer/index.jsx';

const Layout = ({children}) => {
  return (
    <>
      <main className="min-h-screen flex flex-col justify-between">
        <section id="outer">
          {/*region header*/}
          <Header className="z-50 sticky top-0" />
          {/*endregion header*/}

          {/*region body content*/}
          <article id="content" className="px-6 py-4 max-w-[1440px] mx-auto">
            {children}
          </article>
          {/*endregion body content*/}
        </section>

        {/*region footer*/}
        <Footer />
        {/*endregion footer*/}
      </main>
    </>
  );
};

export default Layout;
