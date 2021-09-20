import { useEffect, useState } from 'react';
import { Box, Text, Span, Link } from '@styles/components';
import { styled } from '@styles/config';
import * as Icon from 'react-feather';
import { useTheme } from 'next-themes';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

export default function Home({ posts }) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  function onToggleChange(value) {
    if (value !== '') setTheme(value);
  }

  // To avoid having `theme` undefined.
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Box column center css={{ py: '$5' }}>
      <Box container>
        <Text type="title" css={{ py: '$5' }}>
          {' '}
          Hello World{' '}
        </Text>
        <Text>
          {' '}
          This is a dummy text. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
          commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis
          parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque
          eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
          aliquet nec, vulputate eget, arcu.{' '}
        </Text>
      </Box>

      <Box container css={{ py: '$5' }}>
        <ToggleGroup
          type="single"
          defaultValue={theme}
          aria-label="Theme"
          onValueChange={(value) => onToggleChange(value)}
        >
          <ToggleGroupItem value="light" aria-label="Day">
            <Icon.Sun size={18} />
          </ToggleGroupItem>
          <ToggleGroupItem value="system" aria-label="Auto">
            AUTO
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" aria-label="Night">
            <Icon.Moon size={18} />
          </ToggleGroupItem>
        </ToggleGroup>
      </Box>
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
