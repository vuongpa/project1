import { useEditor } from "@craftjs/core";
import React from "react";

interface ExportFileJsonProps {
  projectName: string;
}

export const ExportFileJson: React.FC<ExportFileJsonProps> = ({ projectName }) => {
  const { query } = useEditor();

  const handleSave = async () => {
    try {
      const jsonData = query.serialize();
      if (!jsonData) {
        throw new Error("No layout data to save");
      }
      const layoutData = JSON.parse(jsonData);
      const payload = {
        name: projectName,
        layout: layoutData,
      };
      const response = await fetch('http://localhost:4000/dev/save-layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save layout to database');
      }

      const result = await response.json();
      console.log('Saved layout to database:', result);

      alert('Layout saved successfully!');
    } catch (error) {
      console.error('Error saving layout:', error);
      alert('Failed to save layout: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <button
      onClick={handleSave}
      className="text-white"
    >
      Lưu dự án
    </button>
  );
};