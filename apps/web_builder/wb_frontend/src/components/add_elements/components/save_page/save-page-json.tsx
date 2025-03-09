import { useEditor } from "@craftjs/core";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callPostAPI } from "../../../../api_utils";
import { Button, Box, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { alpha } from "@mui/material/styles";

interface SavePageProps {
  title: string;
  alias: string;
  metaTags: string;
}

export const SavePage: React.FC<SavePageProps> = ({ title, alias, metaTags }) => {
  const { query } = useEditor();

  const handleSave = async () => {
    try {
      if (!title.trim() || !alias.trim()) {
        throw new Error("Tiêu đề và bí danh không được để trống");
      }

      const jsonData = query.serialize();
      if (!jsonData) {
        throw new Error("Không có dữ liệu layout để lưu");
      }

      console.log("Dữ liệu JSON trước khi gửi:", jsonData);

      const payload = {
        urlAlias: alias,
        title: title,
        metaTags: metaTags,
        sections: jsonData,
      };

      console.log("Payload gửi đi:", payload);

      toast.info("Đang lưu dự án...", {
        position: "top-right",
        autoClose: false,
        toastId: "saving",
      });

      const response = await callPostAPI("/projects/my_project/create-new-page", payload);

      console.log("Phản hồi từ server:", response.data);

      toast.dismiss("saving");
      toast.success("Lưu dự án thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error: any) {
      console.error("Lỗi khi lưu layout:", error);
      toast.dismiss("saving");

      let errorMessage = error.response?.data?.error || error.message || "Lỗi không xác định";

      toast.error(`Không thể lưu dự án: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#1e1e38',
        p: 1,
        borderRadius: '6px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Button
        onClick={handleSave}
        variant="contained"
        startIcon={<SaveIcon />}
        sx={{
          backgroundColor: '#6366f1',
          '&:hover': {
            backgroundColor: alpha('#6366f1', 0.9),
          },
          textTransform: 'none',
          fontSize: '0.85rem',
          fontWeight: 600,
          padding: '6px 16px',
          borderRadius: '4px',
          color: 'white',
          boxShadow: '0 2px 4px rgba(99, 102, 241, 0.3)',
          '&:active': {
            boxShadow: '0 1px 2px rgba(99, 102, 241, 0.3)',
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ color: 'inherit' }}>
          Lưu dự án
        </Typography>
      </Button>
    </Box>
  );
};