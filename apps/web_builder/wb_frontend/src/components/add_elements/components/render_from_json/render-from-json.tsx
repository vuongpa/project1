import React, { useState, useEffect, useRef, Component } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import html2canvas from 'html2canvas';
import { DeviceMockup } from '../main_element';
import { componentMap } from '../layout_map';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  Button,
  CardActions,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; errorMessage: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography color="error" variant="h5" component="div">
                Error Rendering Layout
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {this.state.errorMessage}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      );
    }
    return this.props.children;
  }
}

interface RenderJsonFromApiProps {
  setJsonContent?: (json: any) => void;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
}

interface LayoutItem {
  id: string;
  title: string;
  createdAt: string;
  layout: any;
}

export const RenderJsonFromApi: React.FC<RenderJsonFromApiProps> = ({
  setJsonContent,
  onEdit,
  onDelete,
}) => {
  const [layoutList, setLayoutList] = useState<LayoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canvasImages, setCanvasImages] = useState<{ [key: string]: string }>({});
  const frameRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJsonFromApi = async () => {
      try {
        const response = await fetch('http://localhost:4000/dev/layouts');
        if (!response.ok) {
          throw new Error('Failed to fetch JSON from API');
        }
        const data = await response.json();
        console.log('JSON from API:', JSON.stringify(data, null, 2));

        const layouts = Array.isArray(data) ? data : [];
        console.log('Layouts extracted:', layouts);
        const processedLayouts = layouts.map((item: any, index: number) => {
          const layoutData = item.layout || {};
          const cleanData = Object.keys(layoutData).reduce((acc, key) => {
            const node = layoutData[key];
            if (node.type && typeof node.type === 'object' && node.type.resolvedName) {
              acc[key] = node;
            } else {
              console.warn(`Ignoring node ${key} with invalid type:`, node.type);
            }
            return acc;
          }, {} as any);

          return {
            id: item.id.toString(),
            title: item.name || `Layout ${index + 1}`,
            createdAt: new Date(item.created_at).toLocaleDateString('en-GB'),
            layout: cleanData,
          };
        });

        console.log('Processed layouts:', processedLayouts);
        setLayoutList(processedLayouts);
        setJsonContent?.(processedLayouts);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };
    fetchJsonFromApi();
  }, [setJsonContent]);

  useEffect(() => {
    console.log('Canvas images updated:', canvasImages);
  }, [canvasImages]);

  useEffect(() => {
    if (!loading && layoutList.length > 0) {
      const captureCanvases = async () => {
        const newCanvasImages: { [key: string]: string } = {};

        for (const layout of layoutList) {
          const frameRef = frameRefs.current[layout.id];
          if (frameRef) {
            try {
              frameRef.style.display = 'block';
              frameRef.style.position = 'absolute';
              frameRef.style.left = '-9999px';
              frameRef.style.width = '840px';
              frameRef.style.height = '500px';
              await new Promise((resolve) => setTimeout(resolve, 3000));
              console.log(`Capturing canvas for layout ${layout.id}`);
              const canvas = await html2canvas(frameRef, {
                useCORS: true,
                logging: true,
                width: 840,
                height: 500,
              });

              const image = canvas.toDataURL('image/png');
              newCanvasImages[layout.id] = image;

              console.log(`Captured image for layout ${layout.id}:`, image);
            } catch (err) {
              console.error(`Error capturing canvas for layout ${layout.id}:`, err);
            }
          } else {
            console.warn(`Frame ref for layout ${layout.id} is null`);
          }
        }

        setCanvasImages((prev) => ({ ...prev, ...newCanvasImages }));
      };
      captureCanvases();
    }
  }, [loading, layoutList]);

  const handleDelete = async (layoutId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/dev/delete-layout?id=${layoutId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete layout');
      }
      const result = await response.json();
      console.log(result.message);
      setLayoutList((prev) => prev.filter((layout) => layout.id !== layoutId));
      alert('Layout deleted successfully!');
    } catch (error) {
      console.error('Error deleting layout:', error);
      alert('Failed to delete layout: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleEdit = (layout: LayoutItem) => {
    navigate('/add-element-app', { state: { layoutToEdit: layout } });
    onEdit?.(layout);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading JSON from API...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography color="error" variant="h5" component="div">
              Error
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        List Template
      </Typography>
      <Grid container spacing={2}>
        {layoutList.map((layout) => (
          <Grid xs={12} sm={6} md={4} key={layout.id}>
            <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
              {canvasImages[layout.id] ? (
                <CardMedia
                  component="img"
                  height="140"
                  image={canvasImages[layout.id]}
                  alt={layout.title}
                  sx={{ objectFit: 'contain' }}
                />
              ) : (
                <Box height="140px" display="flex" alignItems="center" justifyContent="center">
                  <CircularProgress size={24} />
                </Box>
              )}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {layout.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {layout.createdAt}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={() => handleEdit(layout)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleDelete(layout.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ position: 'absolute', left: '-9999px' }}>
        {layoutList.map((layout) => (
          <ErrorBoundary key={layout.id}>
            <Editor resolver={componentMap}>
              <div
                ref={(el) => {
                  frameRefs.current[layout.id] = el;
                }}
                style={{ width: '840px', height: '500px', background: '#fff' }}
              >
                <Frame data={layout.layout || {}}>
                  {!layout.layout && <Element canvas is={DeviceMockup} />}
                </Frame>
              </div>
            </Editor>
          </ErrorBoundary>
        ))}
      </Box>
    </Box>
  );
};