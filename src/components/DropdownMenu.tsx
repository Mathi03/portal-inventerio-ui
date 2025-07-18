import {
  IconKebabMenuLight,
  Inline,
  Menu,
  MenuItem,
  MenuSection
} from '@telefonica/mistica';
import React from 'react';

export interface DropdownItemMenu {
  label: string;
  url?: string;
  icon?: React.ReactNode;
  checkbox?: boolean;
  destructive?: boolean;
  action?: any;
}

interface DropdownMenuProps {
  items: DropdownItemMenu[];
  horizontalPosition: 'right' | 'left';
  verticalPosition: 'top' | 'bottom';
  onItemClick: (item: any) => void;
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  horizontalPosition,
  onItemClick
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          display: 'flex'
        }}
      >
        <Menu
          position={horizontalPosition}
          width={280}
          renderTarget={({ ref, onPress }) => (
            <div
              ref={ref}
              onClick={onPress}
              style={{ width: 'fit-content', cursor: 'pointer' }}
              data-testid="menuTarget"
            >
              <Inline space={16} alignItems="center">
                <IconKebabMenuLight />
              </Inline>
            </div>
          )}
          renderMenu={({ ref, className }) => (
            <div ref={ref} className={className}>
              <MenuSection>
                {items.map((item, index) => (
                  <MenuItem
                    key={index}
                    label={item.label}
                    onPress={() => onItemClick(item)}
                    destructive={item.destructive}
                  />
                ))}
              </MenuSection>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default DropdownMenu;
