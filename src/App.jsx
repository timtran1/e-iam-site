import './App.css';
import Header from './component/header/index.jsx';
import Footer from './component/footer/index.jsx';
import AppProvider from './common/context/app/app.provider.jsx';
import Content from './component/content/index.jsx';

const App = () => {
  return (
    <>
      <>
        <AppProvider>
          <main className="min-h-screen flex flex-col justify-between">
            <section>
              {/*region header*/}
              <Header className="z-50 sticky top-0" />
              {/*endregion header*/}

              {/*region body content*/}
              <article className="px-6 py-4 max-w-[1440px] mx-auto">
                <Content />
              </article>
              {/*endregion body content*/}
            </section>

            {/*region footer*/}
            <Footer />
            {/*endregion footer*/}
          </main>
        </AppProvider>
      </>
    </>
  );
};
export default App;
