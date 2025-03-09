import React, { useState } from "react";
import { useNode, useEditor, Canvas } from "@craftjs/core";
import { getColumnPropertiesDefaults } from "./properties-column";
import { ColumnProperties } from "./properties-column-panel";
import { DeleteContextMenu } from "../../../delete_context_menu/delete-context-menu";

interface ColumnProps {
  columnCount?: number;
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  border?: string;
  columnRatios?: string;
  children?: React.ReactNode;
}

export const ColumnLayout: React.FC<ColumnProps> & { craft: any } = (props) => {
  const {
    connectors: { connect, drag },
    selected,
    id,
  } = useNode((node) => ({
    selected: node.events.selected,
    id: node.id,
  }));
  const { actions } = useEditor();
  const [isHovered, setIsHovered] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const defaultProps = getColumnPropertiesDefaults();
  const {
    columnCount = defaultProps.columnCount || 3, // Mặc định 3 cột
    width = defaultProps.width || "100%",
    height = defaultProps.height,
    padding = defaultProps.padding || "1rem",
    margin = defaultProps.margin || "0 0 1rem 0",
    backgroundColor = defaultProps.backgroundColor,
    border = defaultProps.border || "1px dashed red",
    columnRatios = defaultProps.columnRatios,
    children,
  } = props;

  const columnStyle = {
    width,
    height,
    padding,
    margin,
    backgroundColor,
    border,
    minHeight: "100px",
    boxSizing: "border-box" as const,
    outline: selected ? "2px solid #3b82f6" : isHovered ? "1px dashed #9ca3af" : "none",
    display: "grid",
    gridTemplateColumns: columnRatios || `repeat(${columnCount}, 1fr)`, // Chia đều nếu không có columnRatios
    gap: "10px",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.selectNode(id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Tạo các cột trống ban đầu, hiển thị children nếu có
  const renderColumns = () => {
    const childrenArray = React.Children.toArray(children);
    return Array.from({ length: columnCount }, (_, index) => (
      <div
        key={index}
        style={{
          minHeight: "100px",
          backgroundColor: "#f9fafb",
          border: "1px dashed blue",
          flexGrow: 1,
          margin: "0.25rem",
          padding: "1rem",
          boxSizing: "border-box" as const,
        }}
      >
        {childrenArray[index] || null} {/* Chỉ hiển thị nếu có children */}
      </div>
    ));
  };

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative cursor-move transition-all"
      style={columnStyle}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderColumns()}
      <DeleteContextMenu
        nodeId={id}
        onClose={handleCloseContextMenu}
        position={contextMenu}
        onDelete={() => actions.delete(id)}
      />
    </div>
  );
};

ColumnLayout.craft = {
  displayName: "ColumnLayout",
  props: getColumnPropertiesDefaults(),
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: (selectedNode) => {
      return selectedNode.data.displayName === "Column"; // Chỉ chấp nhận Column
    },
  },
  related: {
    toolbar: ColumnProperties,
  },
  isCanvas: true,
};