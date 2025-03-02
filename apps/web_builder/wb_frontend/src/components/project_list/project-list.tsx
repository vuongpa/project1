import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { ContextMenu, MenuActions } from "./components";
import { HasData } from "../../react_utils";
import { selectSearchKeyword } from "../../redux_logic";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataGrid } from "@mui/x-data-grid";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import ReorderIcon from '@mui/icons-material/Reorder';
import GridViewIcon from '@mui/icons-material/GridView';
import CheckIcon from '@mui/icons-material/Check';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { DuplicateProjectModal, DeleteProjectModal } from "../project_detail/page";
import { callDeleteAPI, callGetAPI, callPostAPI } from "../../api_utils";
import Swal from "sweetalert2";

export const ProjectList: React.FC<HasData> = ({ }) => {
  const [totalProjects, setTotalProjects] = useState<number>(0); // Tổng số dự án
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // State to toggle between grid and list view

  const navigate = useNavigate();
  const keyword = useSelector(selectSearchKeyword);

  // Fetch projects when keyword or currentPage changes
  useEffect(() => {
    const fetchProjects = async () => {
      Swal.fire({
        title: "Loading...",
        text: "Please wait while we fetch your projects.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const endpoint = keyword
          ? `/projects?name=${keyword}&page=${currentPage}&limit=8`
          : `/projects?page=${currentPage}&limit=8`;

        const projectResponse = await callGetAPI(endpoint);

        if (projectResponse.data && projectResponse.data.projects) {
          setProjectsData(projectResponse.data.projects);
          setTotalProjects(projectResponse.data.count_item_projects); // Set total projects
          setTotalPages(projectResponse.data.totalPages || 1);
        } else {
          console.error("No projects found in the response.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        Swal.fire("Error!", "Failed to load projects. Please try again.", "error");
      } finally {
        Swal.close();
      }
    };

    fetchProjects();
  }, [keyword, currentPage]);

  // Filtered search handling
  useEffect(() => {
    const fetchFilteredProjects = async () => {
      if (keyword) {
        setLoading(true);
        try {
          const projectResponse = await callGetAPI(`/projects?name=${keyword}&page=${currentPage}&limit=8`);

          if (projectResponse.data && projectResponse.data.projects) {
            setProjectsData(projectResponse.data.projects);
            setTotalPages(projectResponse.data.totalPages || 1);
          } else {
            console.error("No projects found in the response.");
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFilteredProjects();
  }, [keyword, currentPage]);

  // Handle menu actions
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, projectId: number) => {
    setSelectedProjectId(projectId);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (menuActions: MenuActions) => {
    if (selectedProjectId === null) return;

    switch (menuActions) {
      case MenuActions.edit:
        navigate(`/project_detail/${selectedProjectId}/edit`);
        break;
      case MenuActions.duplicate:
        setOpenDuplicateModal(true);
        break;
      case MenuActions.delete:
        setOpenDeleteModal(true);
        break;
      default:
        console.log(`Action: ${MenuActions[menuActions]} on Project ID: ${selectedProjectId}`);
        break;
    }
    handleMenuClose();
  };

  // Create new project
  const handleCreateNewProject = () => {
    navigate("/create-new-project");
  };

  // Handle duplicate project
  const handleDuplicateProject = async (projectId: number) => {
    try {
      const duplicateResponse = await callPostAPI(`/projects/${projectId}/duplicate`, {});

      if (duplicateResponse.status === 201) {
        const updatedProjects = await callGetAPI(`/projects?page=${currentPage}&limit=8`);

        if (updatedProjects.data && updatedProjects.data.projects) {
          setProjectsData(updatedProjects.data.projects);
          setTotalProjects(updatedProjects.data.count_item_projects); // Update total projects count
          setTotalPages(updatedProjects.data.totalPages || 1);
        }

        setOpenDuplicateModal(false);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Project duplicated successfully.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to duplicate the project. Please try again later.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again later.',
      });
    }
  };

  // Handle delete project
  const handleDelete = async () => {
    if (!selectedProjectId) return;

    try {
      await callDeleteAPI(`/projects/${selectedProjectId}`);
      setProjectsData((prevProjects) => prevProjects.filter((p) => p.id !== selectedProjectId));

      // Update total projects count after deletion
      const updatedResponse = await callGetAPI(`/projects?page=${currentPage}&limit=8`);
      setTotalProjects(updatedResponse.data.count_item_projects); // Update total projects

      Swal.fire("Deleted!", "Project has been successfully deleted.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to delete the project, please try again.", "error");
    } finally {
      setOpenDeleteModal(false);
      setSelectedProjectId(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteModal(false);
    setSelectedProjectId(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Project Name", width: 250 },
    { field: "createdAt", headerName: "Created", width: 250 },
    { field: "updatedAt", headerName: "Last Updated", width: 250 },
    { field: "thumbnail", headerName: "Thumbnail", width: 450 },
    {
      field: "actions",
      headerName: "",
      width: 70,
      renderCell: (params: any) => (
        <button onClick={(e) => handleMenuOpen(e, params.row.id)} className="hover:text-gray-800">
          <MoreVertIcon />
        </button>
      ),
    },
  ];

  return (
    <div className="p-5 max-w-full mx-auto pl-16 sm:pl-0 md:pl-0 lg:pl-0">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" component="h2" className="font-bold">
          List Project
        </Typography>

        <div className="flex items-center space-x-4">
          <div className="transition-all duration-500 ease-in-out">
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_event, newViewMode) => {
                if (newViewMode !== null) {
                  setViewMode(newViewMode);
                }
              }}
              aria-label="view mode"
            >
              <ToggleButton
                value="list"
                aria-label="list view"
                sx={{
                  borderRadius: "30px",
                  padding: "5px",
                  backgroundColor: viewMode === "list" ? "#1e40af" : "transparent",
                  color: viewMode === "list" ? "white" : "black",
                  boxShadow: viewMode === "list" ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {viewMode === "list" && <CheckIcon sx={{ fontSize: 16, marginRight: "5px" }} />}
                <GridViewIcon />
              </ToggleButton>
              <ToggleButton
                value="grid"
                aria-label="grid view"
                sx={{
                  borderRadius: "30px",
                  padding: "5px",
                  backgroundColor: viewMode === "grid" ? "#1e40af" : "transparent",
                  color: viewMode === "grid" ? "white" : "black",
                  boxShadow: viewMode === "grid" ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {viewMode === "grid" && <CheckIcon sx={{ fontSize: 16, marginRight: "5px" }} />}
                <ReorderIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition sm:px-3 sm:py-1 sm:text-sm"
            onClick={handleCreateNewProject}
          >
            + CREATE NEW PROJECT
          </button>
        </div>
      </div>

      <p>All projects you have ({totalProjects})</p>

      {loading ? null : (
        <>
          <div className="transition-all duration-500 ease-in-out">
            {viewMode === 'grid' ? (
              <DataGrid
                rows={projectsData.map((p) => ({ ...p, id: p.id || p._id }))}
                columns={columns}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {projectsData.map((project: any) => (
                  <div key={project.id} className="relative shadow-lg transition-all duration-300 hover:shadow-2xl rounded-lg overflow-hidden">
                    <Link to={`/projects/${project.alias}`}>
                      <div>
                        <LazyLoadImage
                          src={project.thumbnail}
                          alt={project.name}
                          className="w-full h-60 object-cover rounded-lg"
                        />
                        <Typography variant="h6" className="text-lg font-semibold mb-2">
                          {project.name}
                        </Typography>
                        <Typography variant="body2" className="text-sm text-gray-500">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </Typography>
                      </div>
                    </Link>

                    <button
                      onClick={(e) => handleMenuOpen(e, project.id)}
                      className="absolute bottom-2 right-2"
                    >
                      <MoreVertIcon className="text-gray-600 hover:text-gray-800" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {projectsData.length === 0 && !loading && <p>No projects found.</p>}
        </>
      )}

      <div className="flex justify-center mt-4">
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            variant="outlined"
            shape="rounded"
            onChange={(_event, value) => setCurrentPage(value)}
          />
        </Stack>
      </div>

      <ContextMenu
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        onAction={handleMenuAction}
      />

      {openDuplicateModal && selectedProjectId !== null && (
        <DuplicateProjectModal
          projectId={selectedProjectId}
          onClose={() => setOpenDuplicateModal(false)}
          onDuplicate={handleDuplicateProject}
        />
      )}

      {openDeleteModal && (
        <DeleteProjectModal
          projectId={selectedProjectId}
          onConfirmDelete={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};
