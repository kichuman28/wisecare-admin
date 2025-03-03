/**
 * Format date to a readable string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Filter orders based on search term and status
 * @param {Array} orders - All orders
 * @param {string} searchTerm - Search term
 * @param {string} statusFilter - Status filter
 * @param {Object} patientDetails - Patient details
 * @param {Object} addressDetails - Address details
 * @returns {Array} Filtered orders
 */
export const filterOrders = (orders, searchTerm, statusFilter, patientDetails, addressDetails = {}) => {
  let results = [...orders];
  
  if (statusFilter !== 'all') {
    results = results.filter(order => order.status === statusFilter);
  }
  
  if (searchTerm) {
    results = results.filter(order => {
      const patientName = patientDetails[order.userId]?.name || '';
      const medicineNames = order.medicines.map(med => med.medicineName.toLowerCase()).join(' ');
      const searchLower = searchTerm.toLowerCase();
      
      // Include address fields in search
      let addressMatch = false;
      if (order.addressId && addressDetails[order.addressId]) {
        const address = addressDetails[order.addressId];
        // Use actual address structure
        const addressString = [
          address.address,
          address.additionalInfo
        ].filter(Boolean).join(' ').toLowerCase();
        
        addressMatch = addressString.includes(searchLower);
      }
      
      return (
        patientName.toLowerCase().includes(searchLower) ||
        medicineNames.includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower) ||
        addressMatch
      );
    });
  }
  
  return results;
}; 