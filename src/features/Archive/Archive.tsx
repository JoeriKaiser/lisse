import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useGetScans } from '../../api/queries/getScans.ts';
import { Scan } from '../../api/types.ts';

const Archive = () => {
  const { user } = useAuth();
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('scannedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (!user) {
    return <div className="p-4 text-center">Please login to view the archive</div>;
  }

  const getScansForUserQuery = useGetScans(user.id!);

  const scans = getScansForUserQuery.data || [];

  const filteredAndSortedScans = useMemo(() => {
    return scans
      .filter(
        (scan: Scan) =>
          scan?.productName?.toLowerCase().includes(filterText.toLowerCase()) ||
          scan?.productCategory?.toLowerCase().includes(filterText.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortBy as keyof Scan];
        const bValue = b[sortBy as keyof Scan];
        if (aValue! < bValue!) return sortOrder === 'asc' ? -1 : 1;
        if (aValue! > bValue!) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [scans, filterText, sortBy, sortOrder]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Archive</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by product name or category"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4 flex items-center">
        <label htmlFor="sortBy" className="mr-2">
          Sort by:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded mr-4 text-background">
          <option value="scannedAt">Scan Date</option>
          <option value="productName">Product Name</option>
          <option value="productCategory">Product Category</option>
        </select>
        <label htmlFor="sortOrder" className="mr-2">
          Order:
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="p-2 border rounded text-background">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <ul className="space-y-4">
        {filteredAndSortedScans.map((scan) => (
          <li key={scan.barcode} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold">{scan.productName}</h2>
            <p className="text-sm text-gray-600">{scan.productCategory}</p>
            <p className="text-sm">Barcode: {scan.barcode}</p>
            <p className="text-sm">Scanned: {new Date(scan.scannedAt!).toLocaleString()}</p>
            {scan.notes && <p className="text-sm mt-2">Notes: {scan.notes}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Archive;
