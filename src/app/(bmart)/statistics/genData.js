const originalData = [
    { time: '1/12', range: ">1m", orders: 20 },


  ];
  
  const generateRandomData = (startDate, endDate) => {
    const data = [];
    const ranges = originalData[0].range.split(','); // Lấy các khoảng giá
  
    for (let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
      const day = date.getDate();
      const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
      const time = `${day}/${month}`;
  
      ranges.forEach(range => {
        const previousData = originalData.find(item => item.time === '1/12' && item.range === range);
        const previousOrders = previousData ? previousData.orders : 0;
        const randomChange = Math.floor(Math.random() * 30) - 15; // Biến động ngẫu nhiên từ -15 đến 15
        const newOrders = Math.max(0, previousOrders + randomChange);
  
        data.push({ time, range, orders: newOrders });
      });
    }
  
    return data;
  };
  
  const newData = generateRandomData('2023-12-02', '2023-12-14');
  
  console.log(newData);