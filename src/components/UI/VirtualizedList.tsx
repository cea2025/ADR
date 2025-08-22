import { FixedSizeList as List } from 'react-window';
import { ReactNode } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
}

function VirtualizedList<T>({ 
  items, 
  height, 
  itemHeight, 
  renderItem, 
  className = '' 
}: VirtualizedListProps<T>) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {renderItem(items[index], index)}
    </div>
  );

  return (
    <div className={`md:hidden ${className}`}>
      <List
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        width="100%"
        className="scrollbar-thin scrollbar-thumb-adr-brown scrollbar-track-gray-100"
      >
        {Row}
      </List>
    </div>
  );
}

export default VirtualizedList;
