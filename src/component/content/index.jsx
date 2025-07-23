import React from 'react';
import AppContext from '../../common/context/app/app.context.js';
// import PureElementRendering from '../../common/ui/PureElementRendering.jsx';
// import DirectAccess from '../home/DirectAccess/index.jsx';
import { mockMenu, mockContent, mockRightContent } from '../../common/constant/dummy.js';
import LeftSidebar from '../left-sidebar/LeftSidebar.jsx';

const isDevMode = import.meta.env.DEV;
/**
 * Content
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Content = () => {
  // Get context data
  const { menu, rightContent, content } = React.useContext(AppContext);

  const menus = isDevMode ? mockMenu : menu;
  const rightSidebarContent = isDevMode ? mockRightContent : rightContent;
  const pageContent = isDevMode ? mockContent : content

  return (
    <article className="px-6 py-12 max-w-[1440px] mx-auto">
      <div className="flex gap-8 justify-between">
        {/*region navigations sidebar*/}
        <LeftSidebar menus={menus} />
        {/*endregion navigations sidebar*/}

        {/*region content*/}
        <div className="max-w-full overflow-hidden grow"
          dangerouslySetInnerHTML={{ __html: pageContent }} />
        {/*endregion content*/}

        {/*region right sidebar*/}
        {rightSidebarContent &&
          <aside className="hidden lg:block right-sidebar bg-gray-aqua-haze px-6 py-3 w-[300px]"
            dangerouslySetInnerHTML={{ __html: rightSidebarContent }} />
        }
        {/*endregion right sidebar*/}
      </div>
    </article>
  );
};

export default Content;
