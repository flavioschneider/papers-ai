import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Box, Text, Span, Link } from '@styles/components';
import { styled } from '@styles/config';
import * as Icon from 'react-feather';
import { useTheme } from 'next-themes';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import PapersPlot from '@components/PapersPlot';

export default function Home({ papers }) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  function onToggleChange(value) {
    if (value === '') setTheme('system');
    else setTheme(value);
  }

  // To avoid having `theme` undefined.
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Box column center>
      <ToggleGroup
        type="single"
        defaultValue={theme}
        aria-label="Theme"
        onValueChange={(value) => onToggleChange(value)}
        css={{ pt: '$4' }}
      >
        <ToggleGroupItem value="light" aria-label="Day">
          <Icon.Sun size={18} />
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Night">
          <Icon.Moon size={18} />
        </ToggleGroupItem>
      </ToggleGroup>
    </Box>
  );
}

const StyledToggleGroup = styled(ToggleGroupPrimitive.Root, {
  display: 'inline-flex',
  fontFamily: '$sans',
});

const StyledItem = styled(ToggleGroupPrimitive.Item, {
  all: 'unset',
  backgroundColor: '$contrast3',
  color: '$contrast12',
  height: '30px',
  p: '$2',
  display: 'flex',
  fontSize: '$2',
  alignItems: 'center',
  justifyContent: 'center',
  '&:first-child': {
    borderTopLeftRadius: '$round',
    borderBottomLeftRadius: '$round',
    pl: '$3',
  },
  '&:last-child': {
    borderTopRightRadius: '$round',
    borderBottomRightRadius: '$round',
    pr: '$3',
  },
  '&:hover': { backgroundColor: '$contrast4' },
  '&[data-state=on]': { backgroundColor: '$contrast5', color: 'contrast1' },
  '&:focus': { position: 'relative', boxShadow: `0 0 0 2px black` },
});

const ToggleGroup = StyledToggleGroup;
const ToggleGroupItem = StyledItem;
