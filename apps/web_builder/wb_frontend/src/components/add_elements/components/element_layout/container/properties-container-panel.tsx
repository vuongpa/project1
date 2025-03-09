import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DefaultContainerProperties } from "./container-properties";
import { alpha } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";

interface ContainerPropertiesProps {
  properties: DefaultContainerProperties;
  onPropertyChange: (newProperties: Partial<DefaultContainerProperties>) => void;
  size?: "small";
}

export const ContainerProperties: React.FC<ContainerPropertiesProps> = ({
  properties,
  onPropertyChange,
  size = "small",
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleChange = (key: keyof DefaultContainerProperties, value: any) => {
    onPropertyChange({ [key]: value });
  };

  const sections = [
    { id: "dimensions", label: "Dimensions", details: ["width", "height", "maxWidth", "maxHeight", "minWidth", "minHeight"] },
    { id: "colors", label: "Colors", details: ["backgroundColor", "textColor", "opacity"] },
    { id: "margin", label: "Margin", details: ["marginTop", "marginRight", "marginBottom", "marginLeft"] },
    { id: "padding", label: "Padding", details: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] },
    { id: "decoration", label: "Decoration", details: ["borderColor", "borderWidth", "borderRadius", "borderStyle", "boxShadow"] },
    { id: "overflow", label: "Overflow", details: ["overflow"] },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        bgcolor: "transparent",
        color: "white",
        maxHeight: "calc(100vh - 150px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": { display: "none" }, // Ẩn thanh cuộn
        scrollbarWidth: "none", // Ẩn thanh cuộn trên Firefox
      }}
    >
      {/* Header của ContainerProperties */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, pb: 0.5, borderBottom: "1px solid rgba(99, 102, 241, 0.1)" }}>
        <SettingsIcon sx={{ color: "#6366f1", fontSize: "1rem" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem", color: alpha("#ffffff", 0.9) }}>
          Container Properties
        </Typography>
      </Box>

      {/* Các section thuộc tính */}
      <Box sx={{ mt: 0.5 }}>
        {sections.map((section) => (
          <Accordion
            key={section.id}
            expanded={expandedSection === section.id}
            onChange={(_, expanded) => setExpandedSection(expanded ? section.id : null)}
            sx={{
              bgcolor: alpha("#1e1e38", 0.5),
              color: "white",
              mb: 0.5,
              borderRadius: "6px",
              "&:before": { display: "none" }, // Xóa viền mặc định của Accordion
              boxShadow: "none",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: alpha("#ffffff", 0.7), fontSize: "1rem" }} />}
              sx={{
                "& .MuiAccordionSummary-content": { my: 0.5 },
                "&:hover": {
                  bgcolor: alpha("#6366f1", 0.15),
                },
                transition: "all 0.2s ease",
              }}
            >
              <Typography variant="caption" sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
                {section.label}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                bgcolor: alpha("#1e1e38", 0.8),
                color: "white",
                p: 1,
                borderRadius: "0 0 6px 6px",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {/* Dimensions */}
                {section.details.includes("width") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Width
                    </Typography>
                    <TextField
                      type="number"
                      value={parseInt(properties.width || "0", 10)}
                      onChange={(e) => handleChange("width", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("height") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Height
                    </Typography>
                    <TextField
                      type="number"
                      value={parseInt(properties.height || "0", 10)}
                      onChange={(e) => handleChange("height", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                      }}
                    />
                  </Box>
                )}

                {/* Colors */}
                {section.details.includes("backgroundColor") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Background
                    </Typography>
                    <TextField
                      value={properties.backgroundColor || "#ffffff"}
                      onChange={(e) => handleChange("backgroundColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.backgroundColor || "#ffffff"}
                              onChange={(e) => handleChange("backgroundColor", e.target.value)}
                              style={{ width: "20px", height: "20px", border: "none", background: "none", cursor: "pointer" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("textColor") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Text Color
                    </Typography>
                    <TextField
                      value={properties.textColor || "#000000"}
                      onChange={(e) => handleChange("textColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.textColor || "#000000"}
                              onChange={(e) => handleChange("textColor", e.target.value)}
                              style={{ width: "20px", height: "20px", border: "none", background: "none", cursor: "pointer" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("opacity") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Opacity
                    </Typography>
                    <Slider
                      value={properties.opacity || 1}
                      onChange={(_, value) => handleChange("opacity", value as number)}
                      min={0}
                      max={1}
                      step={0.01}
                      valueLabelDisplay="auto"
                      size={size}
                      sx={{
                        color: "#6366f1",
                        "& .MuiSlider-thumb": { bgcolor: "#6366f1", width: 10, height: 10 },
                        "& .MuiSlider-track": { bgcolor: "#6366f1", height: 3 },
                        "& .MuiSlider-rail": { bgcolor: alpha("#6366f1", 0.3), height: 3 },
                        "& .MuiSlider-valueLabel": { fontSize: "0.75rem", bgcolor: alpha("#1e1e38", 0.9) },
                        width: 150,
                      }}
                    />
                  </Box>
                )}

                {/* Margin */}
                {section.details.includes("marginTop") && (
                  <Box>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Margin
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, mt: 0.25 }}>
                      {["Top", "Right", "Bottom", "Left"].map((pos) => {
                        const key = `margin${pos}` as keyof DefaultContainerProperties;
                        return (
                          <Box key={pos} sx={{ width: "25%" }}>
                            <Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>
                              {pos}
                            </Typography>
                            <Slider
                              value={parseInt(String(properties[key] || "0px").replace("px", ""), 10) || 0}
                              onChange={(_, value) => handleChange(key, `${value}px`)}
                              min={0}
                              max={100}
                              valueLabelDisplay="auto"
                              size={size}
                              sx={{
                                color: "#6366f1",
                                "& .MuiSlider-thumb": { bgcolor: "#6366f1", width: 10, height: 10 },
                                "& .MuiSlider-track": { bgcolor: "#6366f1", height: 3 },
                                "& .MuiSlider-rail": { bgcolor: alpha("#6366f1", 0.3), height: 3 },
                                "& .MuiSlider-valueLabel": { fontSize: "0.75rem", bgcolor: alpha("#1e1e38", 0.9) },
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Padding */}
                {section.details.includes("paddingTop") && (
                  <Box>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Padding
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, mt: 0.25 }}>
                      {["Top", "Right", "Bottom", "Left"].map((pos) => {
                        const key = `padding${pos}` as keyof DefaultContainerProperties;
                        return (
                          <Box key={pos} sx={{ width: "25%" }}>
                            <Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>
                              {pos}
                            </Typography>
                            <Slider
                              value={parseInt(String(properties[key] || "0px").replace("px", ""), 10) || 0}
                              onChange={(_, value) => handleChange(key, `${value}px`)}
                              min={0}
                              max={100}
                              valueLabelDisplay="auto"
                              size={size}
                              sx={{
                                color: "#6366f1",
                                "& .MuiSlider-thumb": { bgcolor: "#6366f1", width: 10, height: 10 },
                                "& .MuiSlider-track": { bgcolor: "#6366f1", height: 3 },
                                "& .MuiSlider-rail": { bgcolor: alpha("#6366f1", 0.3), height: 3 },
                                "& .MuiSlider-valueLabel": { fontSize: "0.75rem", bgcolor: alpha("#1e1e38", 0.9) },
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Decoration */}
                {section.details.includes("borderColor") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Border Color
                    </Typography>
                    <TextField
                      value={properties.borderColor || "#000000"}
                      onChange={(e) => handleChange("borderColor", e.target.value)}
                      variant="outlined"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.borderColor || "#000000"}
                              onChange={(e) => handleChange("borderColor", e.target.value)}
                              style={{ width: "20px", height: "20px", border: "none", background: "none", cursor: "pointer" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("borderWidth") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Border Width
                    </Typography>
                    <TextField
                      type="number"
                      value={parseInt(properties.borderWidth || "0", 10)}
                      onChange={(e) => handleChange("borderWidth", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("borderRadius") && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                      Border Radius
                    </Typography>
                    <TextField
                      type="number"
                      value={parseInt(properties.borderRadius || "0", 10)}
                      onChange={(e) => handleChange("borderRadius", `${e.target.value}px`)}
                      variant="outlined"
                      size={size}
                      sx={{
                        "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                        backgroundColor: alpha("#1e1e38", 0.5),
                        borderRadius: "4px",
                        height: "32px",
                      }}
                    />
                  </Box>
                )}
                {section.details.includes("borderStyle") && (
                  <Box>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Border Style
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.borderStyle || "solid"}
                      onChange={(e) => handleChange("borderStyle", e.target.value)}
                      sx={{ color: "white", gap: 0.5 }}
                    >
                      <FormControlLabel
                        value="solid"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Solid</Typography>}
                      />
                      <FormControlLabel
                        value="dashed"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Dashed</Typography>}
                      />
                      <FormControlLabel
                        value="dotted"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Dotted</Typography>}
                      />
                      <FormControlLabel
                        value="none"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>None</Typography>}
                      />
                    </RadioGroup>
                  </Box>
                )}
                {section.details.includes("boxShadow") && (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="caption" sx={{ minWidth: 80, color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
                        Box Shadow
                      </Typography>
                      <TextField
                        value={properties.boxShadow || ""}
                        onChange={(e) => handleChange("boxShadow", e.target.value)}
                        variant="outlined"
                        size={size}
                        sx={{
                          "& .MuiInputBase-input": { color: "#ffffff", fontSize: "0.75rem" },
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.3) },
                          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#6366f1", 0.5) },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
                          backgroundColor: alpha("#1e1e38", 0.5),
                          borderRadius: "4px",
                          height: "32px",
                        }}
                      />
                    </Box>
                  </Box>
                )}

                {/* Overflow */}
                {section.details.includes("overflow") && (
                  <Box>
                    <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 0.5 }}>
                      Overflow
                    </Typography>
                    <RadioGroup
                      row
                      value={properties.overflow || "visible"}
                      onChange={(e) => handleChange("overflow", e.target.value)}
                      sx={{ color: "white", gap: 0.5 }}
                    >
                      <FormControlLabel
                        value="visible"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Visible</Typography>}
                      />
                      <FormControlLabel
                        value="hidden"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Hidden</Typography>}
                      />
                      <FormControlLabel
                        value="scroll"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Scroll</Typography>}
                      />
                      <FormControlLabel
                        value="auto"
                        control={<Radio sx={{ color: alpha("#6366f1", 0.7), "&.Mui-checked": { color: "#6366f1" } }} size="small" />}
                        label={<Typography variant="caption" sx={{ fontSize: "0.75rem", color: alpha("#ffffff", 0.7) }}>Auto</Typography>}
                      />
                    </RadioGroup>
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Paper>
  );
};