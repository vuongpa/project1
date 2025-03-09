import { useNode } from '@craftjs/core';
import { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ComputerIcon from '@mui/icons-material/Computer';

interface DeviceMockupProps {
  width?: string;
  height?: string;
  name?: string;
  gap?: string;
  padding?: string;
  children?: ReactNode;
}

export const DeviceMockup = ({
  width = '940px',
  height = '700px',
  name = '💻 Desktop',
  gap = '0px',
  padding = '0px',
  children,
}: DeviceMockupProps) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <Box
      ref={connect as unknown as React.Ref<HTMLDivElement>}
      sx={{
        bgcolor: alpha('#1e1e38', 0.05), 
        p: 2,
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1,
          px: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: '0.85rem',
            color: '#1e1e38',
          }}
        >
          {name}
        </Typography>
      </Box>
      <Box
        sx={{
          mx: 'auto',
          borderRadius: '2px',
          bgcolor: 'linear-gradient(145deg, #f3f4f6, #e5e7eb)',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)', 
          width: width,
          height: height,
          p: padding,
          transition: 'border-color 0.3s ease',
          '&:hover': {
            borderColor: '#6366f1',
          },
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: gap,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

DeviceMockup.craft = {
  displayName: 'DeviceMockup',
  props: {
    width: '840px',
    height: '500px',
    name: '💻 Desktop',
    gap: '0px',
    padding: '0px',
  },
  rules: {
    canDrop: () => true,
  },
};