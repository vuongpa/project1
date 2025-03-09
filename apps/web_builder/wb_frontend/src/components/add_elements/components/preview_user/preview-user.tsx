
import React from "react";
import { Editor, Frame, Element } from "@craftjs/core";
import { DeviceMockup } from "../main_element";
import { componentMap } from "../layout_map";
import { Box } from "@mui/material";

interface PreviewComponentProps {
  serializedData: string;
}

export const PreviewComponent: React.FC<PreviewComponentProps> = ({ serializedData }) => {
  return (
    <Editor enabled={false} resolver={componentMap}>
      <Box
        sx={{
          width: "840px",
          height: "500px",
          background: "#fff",
          overflow: "visible",
          padding: "0px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <Frame data={serializedData}>
          <Element canvas is={DeviceMockup} />
        </Frame>
      </Box>
    </Editor>
  );
};