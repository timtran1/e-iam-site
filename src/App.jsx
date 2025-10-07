import './App.css';
import './i18n.js';
import Header from './component/header/Header.jsx';
import Footer from './component/footer/Footer.jsx';
import AppProvider from './common/context/app/app.provider.jsx';
import Content from './component/content/Content.jsx';
import useI18nSync from './common/hook/useI18nSync.js';

const App = () => {
  // Sync i18next with cookie changes globally
  useI18nSync();

  return (
    <>
      <>
        <AppProvider>
          <div className="min-h-screen flex flex-col justify-between">
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
          </div>
        </AppProvider>
      </>
    </>
  );
};
export default App;
