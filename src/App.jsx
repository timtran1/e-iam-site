import './App.css';
import Header from './component/header/Header.jsx';
import Footer from './component/footer/Footer.jsx';
import AppProvider from './common/context/app/app.provider.jsx';
import Content from './component/content/Content.jsx';

const App = () => {
  return (
    <>
      <>
        <AppProvider>
          <section>
            {/*region header*/}
            <Header className="z-50 sticky top-0" />
            {/*endregion header*/}

            {/*region body content*/}
            <Content />
            {/*endregion body content*/}
          </section>

          {/*region footer*/}
          <Footer />
          {/*endregion footer*/}
        </AppProvider>
      </>
    </>
  );
};
export default App;
