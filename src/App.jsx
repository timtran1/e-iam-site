import './assets/css/global.css';
import './i18n.js';
import Header from './component/header/Header.jsx';
import Footer from './component/footer/Footer.jsx';
import AppProvider from './common/context/app/app.provider.jsx';
import Content from './component/content/Content.jsx';
import useI18nSync from './common/hook/useI18nSync.js';
import useGlobalStyleConfig from './common/hook/useGlobalStyleConfig.js';
import useSelectorInputResize from './common/hook/useSelectorInputResize.js';
import useOSDetect from './common/hook/useOSDetect.js';
import {WINDOWS_ZOOM_FACTOR} from './common/constant/zoom.js';

const App = () => {
  // Sync i18next with cookie changes globally
  useI18nSync();

  // Use global style config script
  useGlobalStyleConfig();
  useSelectorInputResize();

  // Shrink the whole app on Windows
  const {os} = useOSDetect();
  console.log('[App] OS:', os);
  console.log('[App] Version: 1.0.3');

  return (
    <AppProvider>
      <div
        className="min-h-screen flex flex-col justify-between"
        style={
          os === 'Windows'
            ? {
                zoom: WINDOWS_ZOOM_FACTOR,
                minHeight: `calc(100vh / ${WINDOWS_ZOOM_FACTOR})`,
              }
            : undefined
        }
      >
        <section>
          {/*region header*/}
          <Header />
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
  );
};
export default App;
