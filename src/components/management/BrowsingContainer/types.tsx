export interface Item {
    id: string;
    name: string;
    [key: string]: any;
}

export interface BrowsingContainerProps<T extends Item> {
    items: T[];
    loading: boolean;
    error: string | null;
    renderItem?: (item: T) => React.ReactNode; // Optional custom render function
    renderItemDetails?: (item: T, handleItemUpdate: (updatedItem: T | null) => void) => React.ReactNode; // New prop for modal content
    onItemUpdate?: (updatedItem: T) => void;  // New prop
}