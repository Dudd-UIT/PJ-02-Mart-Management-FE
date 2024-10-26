'use client'

import { useEffect } from 'react';

export default function RowHighlight() {
  useEffect(() => {
    document.querySelectorAll('.table tbody tr input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement; 
        const row = target.closest('tr');
        if (target.checked) {
          row?.classList.add('highlight');
        } else {
          row?.classList.remove('highlight');
        }
      });
    });

    return () => {
      document.querySelectorAll('.table tbody tr input[type="checkbox"]').forEach((checkbox) => {
        checkbox.removeEventListener('change', () => {});
      });
    };
  }, []);

  return null;
}
