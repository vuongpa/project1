// Trong parent component
import React, { useState } from 'react';
import { RenderJsonFromApi } from '../../components/add_elements/components/render_from_json/render-from-json';
import { componentMap } from '../../components/add_elements/components/layout_map';
import { Editor } from '@craftjs/core';

export const ListTemplatesPage: React.FC = () => {
  const [jsonContent, setJsonContent] = useState<any>(null);

  return (
    <Editor resolver={componentMap}>
    <RenderJsonFromApi setJsonContent={(json) => console.log(json)} />
  </Editor>
  );
};