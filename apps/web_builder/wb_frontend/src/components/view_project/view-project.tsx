import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Card, CardContent, Divider, Button, Grid } from "@mui/material";
import toast from "react-hot-toast";
import { callGetAPI } from "../../api_utils";

interface PageType {
  id: number;
  title: string;
  urlAlias: string;
  content: string; // Thêm nội dung giả lập cho page
}

interface ProjectType {
  id: number;
  name: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  alias: string;
  pages: PageType[];
}

export const ViewProject = () => {
  const { alias } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [selectedPage, setSelectedPage] = useState<PageType | null>(null); // State để lưu page đang xem
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!alias) {
      toast.error("Không tìm thấy dự án.");
      navigate("/projects");
      return;
    }

    const fetchProjectData = async () => {
      try {
        const response = await callGetAPI(`/projects/${alias}`);

        if (!response.data || !response.data.project) {
          throw new Error("Dữ liệu không tồn tại.");
        }

        // Thêm nội dung giả cho từng Page
        const updatedPages = response.data.project.pages.map((page: PageType) => ({
          ...page,
          content: `This is the content of ${page.title}. It contains detailed information about the page.`,
        }));

        setProject({ ...response.data.project, pages: updatedPages });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Không thể tải thông tin dự án.");
        setError("Không thể lấy dữ liệu.");
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [alias, navigate]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  // Nếu người dùng chọn một trang, hiển thị giao diện chi tiết của Page
  if (selectedPage) {
    return (
      <Container>
        <Box sx={{ backgroundColor: "#008080", p: 2, borderRadius: "8px", color: "white", textAlign: "center" }}>
          <Typography variant="h4">{selectedPage.title}</Typography>
        </Box>
        <Card sx={{ mt: 2, p: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>{selectedPage.title}</Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>URL: {selectedPage.urlAlias}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">{selectedPage.content}</Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="secondary" onClick={() => setSelectedPage(null)}>
                Back to List
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Hiển thị danh sách Pages theo Grid
  return (
    <Container>
      <Box sx={{ backgroundColor: "#008080", p: 1, borderRadius: "8px", color: "white", textAlign: "center" }}>
        <Typography variant="h4">Project Details</Typography>
      </Box>
      <Card sx={{ mt: 1, p: 3, boxShadow: 3 }}>
        {project ? (
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>{project.name}</Typography>
            {project.thumbnail && (
              <Box sx={{ my: 2, textAlign: "center" }}>
                <img 
                  src={project.thumbnail} 
                  alt="Thumbnail"
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </Box>
            )}
            <Typography variant="body2" sx={{ color: "gray" }}>
              <strong>Description:</strong> {project.description}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" sx={{ color: "gray" }}>
              <strong>Created on:</strong> {new Date(project.createdAt).toLocaleString("en-GB")}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              <strong>Updated on:</strong> {new Date(project.updatedAt).toLocaleString("en-GB")}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Pages:</Typography>
            <Grid container spacing={2}>
              {project.pages.length > 0 ? (
                project.pages.map((page) => (
                  <Grid item xs={12} sm={6} md={4} key={page.id}>
                    <Card sx={{ p: 2, boxShadow: 1, backgroundColor: "#f9f9f9", height: "100%" }}>
                      <CardContent>
                        <Typography variant="h6">{page.title}</Typography>
                        <Typography variant="body2" sx={{ color: "gray" }}>({page.urlAlias})</Typography>
                        <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
                          <Button variant="contained" color="primary" size="small" onClick={() => setSelectedPage(page)}>
                            View
                          </Button>
                          <Button variant="outlined" color="secondary" size="small">
                            Delete
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body1">Không có trang nào.</Typography>
              )}
            </Grid>
          </CardContent>
        ) : (
          <Typography variant="body1" sx={{ mb: 2 }}>
            Không có dữ liệu dự án.
          </Typography>
        )}
      </Card>
    </Container>
  );
};
