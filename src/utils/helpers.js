/**
 * Formats a number as Indian Rupee (INR) currency
 * @param {number} value 
 * @returns {string}
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Formats a date string
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Exports data to a CSV file and triggers a browser download
 * @param {Array<string>} headers 
 * @param {Array<Object>} rows 
 * @param {string} fileName 
 */
export const exportToCSV = (headers, rows, fileName = 'report') => {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => headers.map(header => {
      const val = row[header] === undefined || row[header] === null ? '' : row[header];
      // Escape commas and quotes
      const strVal = String(val).replace(/"/g, '""');
      return strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')
        ? `"${strVal}"`
        : strVal;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Simulates exporting to Excel
 */
export const exportToExcel = (headers, rows, fileName = 'report') => {
  // We can write a clean HTML table format that Excel parses natively
  let tabContent = headers.join('\t') + '\n';
  rows.forEach(row => {
    tabContent += headers.map(header => {
      const val = row[header] === undefined || row[header] === null ? '' : row[header];
      return String(val).replace(/\t/g, ' ');
    }).join('\t') + '\n';
  });

  const blob = new Blob([tabContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Simulates exporting to PDF
 */
export const exportToPDF = (headers, rows, fileName = 'report') => {
  // Create a clean printable layout text-blob or display an alert/print page
  let printContent = `Happi Ride Master Admin Report - ${fileName.toUpperCase()}\n`;
  printContent += `Generated: ${new Date().toLocaleString()}\n`;
  printContent += `========================================================================\n\n`;
  
  // Table headers
  printContent += headers.join(' | ') + '\n';
  printContent += headers.map(() => '----------------').join('-|-') + '\n';
  
  rows.forEach(row => {
    printContent += headers.map(header => {
      const val = row[header] === undefined || row[header] === null ? '' : row[header];
      return String(val).padEnd(16).substring(0, 16);
    }).join(' | ') + '\n';
  });

  const blob = new Blob([printContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
