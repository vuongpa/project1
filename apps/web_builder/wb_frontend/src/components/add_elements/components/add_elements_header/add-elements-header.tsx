import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { SavePage } from "../save_page/save-page-json";
import { DeviceMockup } from "../main_element";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import TabletIcon from "@mui/icons-material/Tablet";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import { IconButton, TextField, Tooltip, Box, Button, Typography, Divider, Chip, Badge, Avatar } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PreviewDialog } from "../preview_user/panel";

const headerStyle = {
  borderBottom: "1px solid rgba(79, 70, 229, 0.3)",
  background: "linear-gradient(to right, #1e1e38, #2a2a44)",
  minHeight: "3.5rem",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  px: { xs: 1.5, sm: 2.5 },
  color: "white",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

export const AddElementsHeader: React.FC = React.memo(() => {
  const { actions, query } = useEditor();
  const [title, setTitle] = useState<string>("My Project");
  const [alias, setAlias] = useState<string>("my-project");
  const [metaTag, setMetaTag] = useState<string>("web, page, builder");
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingAlias, setIsEditingAlias] = useState<boolean>(false);
  const [isEditingMeta, setIsEditingMeta] = useState<boolean>(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState<boolean>(false);

  const { deviceName, deviceSize } = useEditor((state) => {
    let width = "100%";
    let height = "100vh";
    let name = "📱 Smartphone";
    const nodes = state.nodes;
    for (const node of Object.values(nodes)) {
      if (node.data.type === DeviceMockup) {
        width = node.data.props.width || "100%";
        height = node.data.props.height || "100vh";
        name = node.data.props.name || "📱 Smartphone";
        break;
      }
    }
    const widthNum = parseInt(width.replace(/[^\d]/g, ""), 10) || 375;
    if (widthNum >= 600 && widthNum < 824) {
      name = "📱 Tablet";
    } else if (widthNum >= 824) {
      name = "💻 Desktop";
    }

    return {
      deviceName: name,
      deviceSize: `${width} x ${height}`,
    };
  });

  const updateDeviceSize = (width: string, height: string, name: string) => {
    const nodes = query.getNodes();
    for (const [id, node] of Object.entries(nodes)) {
      if (node.data.type === DeviceMockup) {
        actions.setProp(id, (props) => {
          props.width = width;
          props.height = height;
          props.name = name;
        });
        break;
      }
    }
  };

  const handleDeviceClick = (device: "smartphone" | "tablet" | "desktop") => {
    switch (device) {
      case "smartphone":
        updateDeviceSize("475px", "612px", "📱 Smartphone");
        break;
      case "tablet":
        updateDeviceSize("468px", "624px", "📱 Tablet");
        break;
      case "desktop":
        updateDeviceSize("840px", "500px", "💻 Desktop");
        break;
      default:
        break;
    }
  };

  const { canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const handleUndo = () => {
    if (canUndo) {
      actions.history.undo();
      console.log("Undo action triggered");
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      actions.history.redo();
      console.log("Redo action triggered");
    }
  };

  const isSmartphone = deviceName.includes("Smartphone");
  const isTablet = deviceName.includes("Tablet");
  const isDesktop = deviceName.includes("Desktop");

  const handleEditTitleClick = () => setIsEditingTitle(true);
  const handleEditAliasClick = () => setIsEditingAlias(true);
  const handleEditMetaClick = () => setIsEditingMeta(true);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => setAlias(e.target.value);
  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => setMetaTag(e.target.value);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (!title.trim()) setTitle("Project Title");
  };

  const handleAliasBlur = () => {
    setIsEditingAlias(false);
    if (!alias.trim()) setAlias("project-alias");
  };

  const handleMetaBlur = () => {
    setIsEditingMeta(false);
    if (!metaTag.trim()) setMetaTag("meta description");
  };

  const handlePreviewOpen = () => {
    setOpenPreviewDialog(true);
  };

  const handlePreviewClose = () => {
    setOpenPreviewDialog(false);
  };

  const handlePreviewPublish = (selectedDomain: string) => {
    const jsonData = query.serialize();
    if (jsonData && selectedDomain && selectedDomain !== "not-published" && selectedDomain !== "custom") {
      const baseUrl = `https://${selectedDomain}/preview?layout=${encodeURIComponent(jsonData)}`;
      window.open(baseUrl, "_blank"); 
    } else if (selectedDomain === "custom") {
      console.log("Vui lòng thêm custom domain trước khi preview!");
    }
  };

  return (
    <Box sx={headerStyle}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
        <Avatar sx={{ bgcolor: alpha("#6366f1", 0.9), width: 32, height: 32, fontSize: "1rem", fontWeight: "bold" }}>
          TT
        </Avatar>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isEditingTitle ? (
            <TextField
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              autoFocus
              size="small"
              sx={{
                input: { color: "#ffffff", fontSize: "0.95rem", fontWeight: 500 },
                "& .MuiInputBase-root": {
                  bgcolor: alpha("#1e1e38", 0.5),
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: alpha("#1e1e38", 0.7) },
                },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6366f1",
                  borderWidth: "2px",
                },
              }}
            />
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "0.01em" }}>
                {title}
              </Typography>
              <Tooltip title="Edit title" placement="top" arrow>
                <IconButton
                  onClick={handleEditTitleClick}
                  sx={{
                    color: alpha("#ffffff", 0.8),
                    "&:hover": { bgcolor: alpha("#6366f1", 0.15), color: "#ffffff" },
                    p: 0.5,
                    ml: 0.5,
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" sx={{ fontSize: "0.85rem" }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Divider orientation="vertical" flexItem sx={{ bgcolor: alpha("#6366f1", 0.3), mx: 1, height: "24px", my: "auto" }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isEditingAlias ? (
            <TextField
              value={alias}
              onChange={handleAliasChange}
              onBlur={handleAliasBlur}
              autoFocus
              size="small"
              sx={{
                input: { color: "#ffffff", fontSize: "0.85rem" },
                "& .MuiInputBase-root": {
                  bgcolor: alpha("#1e1e38", 0.5),
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: alpha("#1e1e38", 0.7) },
                },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6366f1",
                  borderWidth: "2px",
                },
              }}
            />
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Chip
                label={alias}
                size="small"
                sx={{
                  bgcolor: alpha("#1e1e38", 0.5),
                  color: alpha("#ffffff", 0.85),
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  height: "22px",
                  "& .MuiChip-label": { px: 1 },
                }}
              />
              <Tooltip title="Edit alias" placement="top" arrow>
                <IconButton
                  onClick={handleEditAliasClick}
                  sx={{
                    color: alpha("#ffffff", 0.8),
                    "&:hover": { bgcolor: alpha("#6366f1", 0.15), color: "#ffffff" },
                    p: 0.5,
                    ml: 0.5,
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" sx={{ fontSize: "0.8rem" }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isEditingMeta ? (
            <TextField
              value={metaTag}
              onChange={handleMetaChange}
              onBlur={handleMetaBlur}
              autoFocus
              size="small"
              sx={{
                input: { color: "#ffffff", fontSize: "0.85rem" },
                "& .MuiInputBase-root": {
                  bgcolor: alpha("#1e1e38", 0.5),
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: alpha("#1e1e38", 0.7) },
                },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6366f1",
                  borderWidth: "2px",
                },
              }}
            />
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  color: alpha("#ffffff", 0.7),
                  fontSize: "0.75rem",
                  bgcolor: alpha("#1e1e38", 0.3),
                  px: 1,
                  py: 0.25,
                  borderRadius: "4px",
                }}
              >
                {metaTag}
              </Typography>
              <Tooltip title="Edit meta tags" placement="top" arrow>
                <IconButton
                  onClick={handleEditMetaClick}
                  sx={{
                    color: alpha("#ffffff", 0.8),
                    "&:hover": { bgcolor: alpha("#6366f1", 0.15), color: "#ffffff" },
                    p: 0.5,
                    ml: 0.5,
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" sx={{ fontSize: "0.8rem" }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, flexWrap: "wrap", justifyContent: "center", mx: 2 }}>
        <Chip
          label={`${deviceName.replace(/^\W+/, '')} - ${deviceSize}`}
          variant="outlined"
          size="small"
          sx={{
            borderColor: alpha("#6366f1", 0.3),
            color: alpha("#ffffff", 0.85),
            bgcolor: alpha("#1e1e38", 0.3),
            fontSize: "0.75rem",
            "& .MuiChip-label": { px: 1 },
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", bgcolor: alpha("#1e1e38", 0.3), borderRadius: "6px", p: 0.5 }}>
          <Tooltip title="Smartphone View" arrow placement="top">
            <IconButton
              onClick={() => handleDeviceClick("smartphone")}
              sx={{
                color: isSmartphone ? "#6366f1" : alpha("#ffffff", 0.6),
                bgcolor: isSmartphone ? alpha("#ffffff", 0.15) : "transparent",
                "&:hover": {
                  bgcolor: isSmartphone ? alpha("#ffffff", 0.2) : alpha("#ffffff", 0.08),
                  color: isSmartphone ? "#6366f1" : "#ffffff",
                },
                p: 0.75,
                mx: 0.25,
                transition: "all 0.2s ease",
              }}
              size="small"
              aria-label="Smartphone"
            >
              <SmartphoneIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Tablet View" arrow placement="top">
            <IconButton
              onClick={() => handleDeviceClick("tablet")}
              sx={{
                color: isTablet ? "#6366f1" : alpha("#ffffff", 0.6),
                bgcolor: isTablet ? alpha("#ffffff", 0.15) : "transparent",
                "&:hover": {
                  bgcolor: isTablet ? alpha("#ffffff", 0.2) : alpha("#ffffff", 0.08),
                  color: isTablet ? "#6366f1" : "#ffffff",
                },
                p: 0.75,
                mx: 0.25,
                transition: "all 0.2s ease",
              }}
              size="small"
              aria-label="Tablet"
            >
              <TabletIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Desktop View" arrow placement="top">
            <IconButton
              onClick={() => handleDeviceClick("desktop")}
              sx={{
                color: isDesktop ? "#6366f1" : alpha("#ffffff", 0.6),
                bgcolor: isDesktop ? alpha("#ffffff", 0.15) : "transparent",
                "&:hover": {
                  bgcolor: isDesktop ? alpha("#ffffff", 0.2) : alpha("#ffffff", 0.08),
                  color: isDesktop ? "#6366f1" : "#ffffff",
                },
                p: 0.75,
                mx: 0.25,
                transition: "all 0.2s ease",
              }}
              size="small"
              aria-label="Desktop"
            >
              <DesktopWindowsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Button
          variant="text"
          startIcon={<GridViewIcon />}
          endIcon={<KeyboardArrowDownIcon />}
          size="small"
          sx={{
            color: alpha("#ffffff", 0.85),
            textTransform: "none",
            fontSize: "0.85rem",
            bgcolor: alpha("#1e1e38", 0.3),
            borderRadius: "6px",
            px: 1.5,
            py: 0.5,
            "&:hover": { bgcolor: alpha("#1e1e38", 0.5) },
          }}
        >
          Grids
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", bgcolor: alpha("#1e1e38", 0.3), borderRadius: "6px", p: 0.5 }}>
          <Tooltip title={canUndo ? "Undo" : "Nothing to undo"} arrow placement="top">
            <span>
              <IconButton
                onClick={handleUndo}
                disabled={!canUndo}
                sx={{
                  color: canUndo ? alpha("#ffffff", 0.8) : alpha("#ffffff", 0.3),
                  "&:hover": { bgcolor: alpha("#ffffff", 0.08), color: "#ffffff" },
                  "&.Mui-disabled": { color: alpha("#ffffff", 0.3) },
                  p: 0.75,
                  mx: 0.25,
                }}
                size="small"
                aria-label="Undo"
              >
                <UndoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={canRedo ? "Redo" : "Nothing to redo"} arrow placement="top">
            <span>
              <IconButton
                onClick={handleRedo}
                disabled={!canRedo}
                sx={{
                  color: canRedo ? alpha("#ffffff", 0.8) : alpha("#ffffff", 0.3),
                  "&:hover": { bgcolor: alpha("#ffffff", 0.08), color: "#ffffff" },
                  "&.Mui-disabled": { color: alpha("#ffffff", 0.3) },
                  p: 0.75,
                  mx: 0.25,
                }}
                size="small"
                aria-label="Redo"
              >
                <RedoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Validation Issues" arrow placement="top">
            <IconButton
              sx={{
                color: alpha("#ffffff", 0.8),
                "&:hover": { bgcolor: alpha("#ffffff", 0.08), color: "#ffffff" },
                p: 0.75,
                mx: 0.25,
              }}
              size="small"
            >
              <Badge badgeContent={0} color="error" sx={{ "& .MuiBadge-badge": { minWidth: "14px", height: "14px", fontSize: "0.6rem" } }}>
                <ErrorIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
        <Tooltip title="Search" arrow placement="top">
          <IconButton
            sx={{
              color: alpha("#ffffff", 0.8),
              "&:hover": { bgcolor: alpha("#6366f1", 0.15), color: "#ffffff" },
              p: 1,
            }}
            size="small"
          >
            <SearchIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <SavePage title={title} alias={alias} metaTags={metaTag} />

        <Tooltip title="Preview" arrow placement="top">
          <Button
            variant="contained"
            startIcon={<VisibilityIcon />}
            onClick={handlePreviewOpen}
            size="small"
            sx={{
              bgcolor: "#6366f1",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
              "&:hover": {
                bgcolor: "#4f46e5",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
              },
              p: "6px 12px",
            }}
          >
            Preview
          </Button>
        </Tooltip>
      </Box>

      <PreviewDialog
        open={openPreviewDialog}
        onClose={handlePreviewClose}
        onPublish={handlePreviewPublish}
      />
    </Box>
  );
});