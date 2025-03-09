import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PublishIcon from "@mui/icons-material/Publish";

interface PublishDialogProps {
  open: boolean;
  onClose: () => void;
  onPublish: (selectedDomain: string) => void;
}

export const PreviewDialog: React.FC<PublishDialogProps> = ({ open, onClose, onPublish }) => {
  const [selectedDomain, setSelectedDomain] = useState("test-869e9.webflow.io");

  const stagingOptions = [
    { value: "test-869e9.webflow.io", label: "test-869e9.webflow.io" },
    { value: "not-published", label: "Not published" },
  ];

  const productionOptions = [
    { value: "custom", label: "Custom domain" },
    { value: "add-custom", label: "Add a custom domain" },
  ];

  const handlePublishClick = () => {
    onPublish(selectedDomain);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "#1e1e38",
          color: "white",
          borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <PublishIcon sx={{ color: "#6366f1", fontSize: "1rem" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
          CHOOSE PUBLISH DESTINATION
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: "#1e1e38", p: 2, color: "white" }}>
        <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mb: 1 }}>
          Staging
        </Typography>
        <RadioGroup
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          sx={{ color: "white" }}
        >
          {stagingOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  sx={{
                    color: alpha("#6366f1", 0.7),
                    "&.Mui-checked": { color: "#6366f1" },
                  }}
                />
              }
              label={option.label}
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.75rem", color: alpha("#ffffff", 0.7) } }}
            />
          ))}
        </RadioGroup>

        <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.7), fontSize: "0.75rem", mt: 2, mb: 1 }}>
          Production
        </Typography>
        <RadioGroup
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          sx={{ color: "white" }}
        >
          {productionOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  sx={{
                    color: alpha("#6366f1", 0.7),
                    "&.Mui-checked": { color: "#6366f1" },
                  }}
                />
              }
              label={option.label}
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.75rem", color: alpha("#ffffff", 0.7) } }}
            />
          ))}
        </RadioGroup>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="caption"
            sx={{ color: alpha("#ffffff", 0.7), fontSize: "0.75rem", cursor: "pointer", "&:hover": { color: "#6366f1" } }}
          >
            Advanced options
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          bgcolor: "#1e1e38",
          p: 1,
          justifyContent: "space-between",
          borderTop: "1px solid rgba(99, 102, 241, 0.1)",
        }}
      >
        <Button onClick={onClose} sx={{ color: alpha("#ffffff", 0.7), fontSize: "0.75rem" }}>
          Close
        </Button>
        <Button
          onClick={handlePublishClick}
          variant="contained"
          sx={{
            backgroundColor: "#6366f1",
            "&:hover": { backgroundColor: alpha("#6366f1", 0.9) },
            textTransform: "none",
            fontSize: "0.85rem",
            fontWeight: 600,
            padding: "4px 12px",
            borderRadius: "4px",
            color: "white",
            boxShadow: "0 2px 4px rgba(99, 102, 241, 0.3)",
            "&:active": { boxShadow: "0 1px 2px rgba(99, 102, 241, 0.3)" },
          }}
        >
          Publish to selected domains
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePublish = (selectedDomain: string) => {
    console.log("Đã chọn domain để publish:", selectedDomain);
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          backgroundColor: "#6366f1",
          "&:hover": { backgroundColor: alpha("#6366f1", 0.9) },
          textTransform: "none",
          fontSize: "0.85rem",
          fontWeight: 600,
          padding: "6px 16px",
          borderRadius: "4px",
          color: "white",
          boxShadow: "0 2px 4px rgba(99, 102, 241, 0.3)",
          "&:active": { boxShadow: "0 1px 2px rgba(99, 102, 241, 0.3)" },
        }}
      >
        Open Publish Dialog
      </Button>
      <PreviewDialog open={open} onClose={handleClose} onPublish={handlePublish} />
    </Box>
  );
};
