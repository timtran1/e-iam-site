import Hero from './Hero/index.jsx';
import DirectAccess from './DirectAccess/index.jsx';
import FederalAdministration from './FederalAdministration/index.jsx';
import CoreFunctions from './CoreFunctions/index.jsx';
import CookieConsentPopup from "./CookieConsentPopup.jsx";


export default function HomePage() {
  console.log('HomePage')
  return (
    <>
      <div className="typography flex-grow text-primary-text">
        <Hero />
        <div className="flex flex-col-reverse md:flex-col">
          <DirectAccess />
          <FederalAdministration />
        </div>
        <CoreFunctions />
      </div>
      <CookieConsentPopup />
    </>
  );
}
