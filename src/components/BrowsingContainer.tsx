import { useState } from 'react';
import Modal from './Modal';

interface Item {
  id: string;
  name: string;
  [key: string]: any; // Allow for additional properties
}

interface BrowsingContainerProps<T extends Item> {
  items: T[];
  loading: boolean;
  error: string | null;
  renderItem?: (item: T) => React.ReactNode; // Optional custom render function
  renderItemDetails?: (item: T) => React.ReactNode; // New prop for modal content
}

export default function BrowsingContainer<T extends Item>({ 
  items, 
  loading, 
  error,
  renderItem,
  renderItemDetails
}: BrowsingContainerProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const itemsPerPage = 6;

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const defaultRenderItem = (item: T) => (
    <div className="item-card">
      <h4>{item.name}</h4>
    </div>
  );

  const handleItemClick = (item: T) => {
    setSelectedItem(item);
  };

  return (
    <div className="browsing-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : currentItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <>
          <div className="item-grid">
            {currentItems.map((item) => (
              <div key={item.id} onClick={() => handleItemClick(item)}>
                {renderItem ? renderItem(item) : defaultRenderItem(item)}
              </div>
            ))}
          </div>

          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>

          {selectedItem && renderItemDetails && (
            <Modal
              isOpen={!!selectedItem}
              onClose={() => setSelectedItem(null)}
              title={selectedItem.name}
            >
              {renderItemDetails(selectedItem)}
            </Modal>
          )}
        </>
      )}
    </div>
  );
} 