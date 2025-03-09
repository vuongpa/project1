import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  Paper,
  Typography,
  InputAdornment,
  Slider,
  Switch,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ColumnPropertiesDefaults } from "./properties-column";

interface ColumnPropertiesProps {
  properties: ColumnPropertiesDefaults;
  onPropertyChange: (newProperties: Partial<ColumnPropertiesDefaults>) => void;
  size?: "small";
}

export const ColumnProperties: React.FC<ColumnPropertiesProps> = ({
  properties,
  onPropertyChange,
  size = "small",
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isHeightAuto, setIsHeightAuto] = useState(properties.height === "auto");

  const handleChange = <K extends keyof ColumnPropertiesDefaults>(
    key: K,
    value: ColumnPropertiesDefaults[K]
  ) => {
    onPropertyChange({ [key]: value });
  };

  const parsePxValue = (value: string) => {
    return parseInt(value.replace("px", ""), 10) || 0;
  };

  const appendPxIfNumeric = (value: string) => {
    return /^\d+$/.test(value) ? `${value}px` : value;
  };

  const inputStyle = {
    "& .MuiInputBase-input": { color: "white", fontSize: "10px" },
    "& .MuiInputLabel-root": { color: "white", fontSize: "10px" },
    "& .MuiInputLabel-root.Mui-focused": { color: "white", fontSize: "10px" },
    "& .MuiInput-underline:before": { borderBottomColor: "white" },
    "& .MuiInput-underline:after": { borderBottomColor: "white" },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottomColor: "white" },
    height: "24px",
    width: "120px",
  };

  const sections = [
    { id: "layout", label: "Layout", details: ["columnCount"] },
    { id: "size", label: "Size", details: ["width", "height"] },
    { id: "spacing", label: "Spacing", details: ["padding", "margin"] },
    { id: "appearance", label: "Appearance", details: ["backgroundColor", "border"] },
  ];

  return (
    <Paper
      elevation={1}
      sx={{ p: 1, bgcolor: "#111827", color: "white", maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}
    >
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ borderBottom: "1px solid #424242", pb: 0.5, fontSize: "12px" }}
      >
        Column Properties
      </Typography>
      <Box sx={{ mt: 0.5 }}>
        {sections.map((section) => (
          <Accordion
            key={section.id}
            expanded={expandedSection === section.id}
            onChange={(_, expanded) => setExpandedSection(expanded ? section.id : null)}
            sx={{ bgcolor: "#111827", color: "white", mb: 0.5 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white", fontSize: "16px" }} />}>
              <Typography variant="caption" className="text-xs">
                {section.label}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: "#1f2937", p: 0.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {/* Layout Section */}
                {section.details.includes("columnCount") && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: "white", fontSize: "10px" }}>
                      Columns
                    </Typography>
                    <Slider
                      value={properties.columnCount}
                      onChange={(_, value) => handleChange("columnCount", value as number)}
                      min={1}
                      max={12} // Tối đa 12 cột, tương tự Webflow
                      step={1}
                      valueLabelDisplay="auto"
                      sx={{ color: "white", width: "120px" }}
                    />
                  </Box>
                )}

                {/* Size Section */}
                {section.details.includes("width") && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: "white", fontSize: "10px" }}>
                      Width
                    </Typography>
                    <Slider
                      value={parsePxValue(properties.width)}
                      onChange={(_, value) => handleChange("width", `${value}px`)}
                      min={50}
                      max={500}
                      step={1}
                      valueLabelDisplay="auto"
                      sx={{ color: "white", width: "120px" }}
                    />
                  </Box>
                )}
                {section.details.includes("height") && (
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography variant="caption" sx={{ minWidth: 80, color: "white", fontSize: "10px" }}>
                        Height Auto
                      </Typography>
                      <Switch
                        checked={isHeightAuto}
                        onChange={(e) => {
                          setIsHeightAuto(e.target.checked);
                          handleChange("height", e.target.checked ? "auto" : "100px");
                        }}
                        size="small"
                        sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "white" } }}
                      />
                    </Box>
                    {!isHeightAuto && (
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography variant="caption" sx={{ minWidth: 80, color: "white", fontSize: "10px" }}>
                          Height
                        </Typography>
                        <Slider
                          value={parsePxValue(properties.height)}
                          onChange={(_, value) => handleChange("height", `${value}px`)}
                          min={50}
                          max={500}
                          step={1}
                          valueLabelDisplay="auto"
                          sx={{ color: "white", width: "120px" }}
                        />
                      </Box>
                    )}
                  </Box>
                )}

                {/* Spacing Section */}
                {section.details.includes("padding") && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: "white", fontSize: "10px" }}>
                      Padding
                    </Typography>
                    <Slider
                      value={parsePxValue(properties.padding)}
                      onChange={(_, value) => handleChange("padding", `${value}px`)}
                      min={0}
                      max={100}
                      step={1}
                      valueLabelDisplay="auto"
                      sx={{ color: "white", width: "120px" }}
                    />
                  </Box>
                )}
                {section.details.includes("margin") && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: "white", fontSize: "10px" }}>
                      Margin
                    </Typography>
                    <Slider
                      value={parsePxValue(properties.padding)}
                      onChange={(_, value) => handleChange("margin", `${value}px`)}
                      min={0}
                      max={100}
                      step={1}
                      valueLabelDisplay="auto"
                      sx={{ color: "white", width: "120px" }}
                    />
                  </Box>
                )}

                {/* Appearance Section */}
                {section.details.includes("backgroundColor") && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: "white", fontSize: "10px" }}>
                      Background
                    </Typography>
                    <TextField
                      value={properties.backgroundColor}
                      onChange={(e) => handleChange("backgroundColor", e.target.value)}
                      variant="standard"
                      size={size}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <input
                              type="color"
                              value={properties.backgroundColor}
                              onChange={(e) => handleChange("backgroundColor", e.target.value)}
                              style={{ width: "20px", height: "20px", border: "none", background: "none", cursor: "pointer" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyle}
                    />
                  </Box>
                )}
                {section.details.includes("border") && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography variant="caption" sx={{ minWidth: 80, color: "white", fontSize: "10px" }}>
                      Border
                    </Typography>
                    <TextField
                      value={properties.border}
                      onChange={(e) => handleChange("border", e.target.value)}
                      variant="standard"
                      size={size}
                      sx={inputStyle}
                    />
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