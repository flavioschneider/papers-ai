import { useEffect, useState } from 'react';
import { styled } from '@styles/config';
import * as Icon from 'react-feather';
import { useTheme } from 'next-themes';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';


const StyledToggleGroup = styled(ToggleGroupPrimitive.Root, {
  display: 'inline-flex',
  fontFamily: '$sans',
});

const StyledItem = styled(ToggleGroupPrimitive.Item, {
  all: 'unset',
  backgroundColor: '$contrast3',
  color: '$contrast12',
  height: '20px',
  p: '$1',
  display: 'flex',
  fontSize: '$2',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  '&:first-child': {
    borderTopLeftRadius: '$round',
    borderBottomLeftRadius: '$round',
    pl: '$2',
  },
  '&:last-child': {
    borderTopRightRadius: '$round',
    borderBottomRightRadius: '$round',
    pr: '$2',
  },
  '&:hover, &:active': { backgroundColor: '$contrast4' },
  '&[data-state=on]': { backgroundColor: '$contrast5', color: 'contrast1' },
  '&:focus': { position: 'relative' },
});

const ToggleGroup = StyledToggleGroup;
const ToggleGroupItem = StyledItem;

export default function ThemeSwitch () {

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
    <ToggleGroup
      type="single"
      defaultValue={theme}
      aria-label="Theme"
      onValueChange={(value) => onToggleChange(value)}
    >
      <ToggleGroupItem value="light" aria-label="Day">
        <Icon.Sun size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Night">
        <Icon.Moon size={16} />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
