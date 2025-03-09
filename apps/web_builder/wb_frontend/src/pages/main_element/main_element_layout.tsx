import { Editor, Element, Frame } from '@craftjs/core';
import { useState } from 'react';
import { useLocation } from 'react-router';
import {
  AddElementsComponent,
  AddElementsHeader,
  DeviceMockup,
  LeftSideBar,
  RightSidebar,
} from '../../components/add_elements';
import { LayerComponent } from '../../components/add_elements/components/layer';
import { componentMap } from '../../components/add_elements/components/layout_map';

export const AddElementPage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const location = useLocation();
  const data = location.state?.layoutToEdit;
  console.log(data);

  const handleComponentChange = (component: string | null) => {
    setActiveComponent(component);
  };

  const renderSidebarContent = () => {
    switch (activeComponent) {
      case 'add':
        return <AddElementsComponent />;
      case 'layers':
        return <LayerComponent />;
      default:
        return null;
    }
  };

  const isLayoutEmpty = !data?.layout || Object.keys(data.layout).length === 0;

  return (
    <Editor resolver={componentMap}>
      <div className="flex flex-col h-screen overflow-hidden">
        <AddElementsHeader />
        <div className="flex flex-1 overflow-hidden">
          <LeftSideBar onComponentChange={handleComponentChange} />
          {renderSidebarContent()}
          <div className="flex flex-col flex-grow w-full overflow-y-auto">
            <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)] bg-gray-100">
              {isLayoutEmpty ? (
                <Frame>
                  <Element canvas is={DeviceMockup} />
                </Frame>
              ) : (
                <Frame data={JSON.stringify(data.layout)}>
                  <Element canvas is={DeviceMockup} />
                </Frame>
              )}
            </div>
          </div>
          <RightSidebar />
        </div>
      </div>
    </Editor>
  );
};