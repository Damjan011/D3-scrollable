import React, { useEffect, useState } from 'react';
import BarChart from './components/BarChart';

const datas = [
  [10, 30, 40, 20],
  [10, 40, 30, 20, 50, 10],
  [60, 30, 40, 20, 30]
];

const patka = [
  {date: Date.parse('2007-04-23'), value: 93.24},
  {date: Date.parse('2007-04-24'), value: 22.24},
  {date: Date.parse('2007-04-25'), value: 56.24},
  // {date: 2007-04-24, value: 93.24},
  // {date: 2007-04-25, value: 93.24},
  // {date: 2007-04-26, value: 93.24},
  // {date: 2007-04-27, value: 93.24},
  // {date: 2007-04-28, value: 93.24},
  // {date: 2007-04-29, value: 93.24},
  // {date: 2007-04-30, value: 93.24},
];

const newData = [
  {
    dn: "tx",
    rx: 1,
    time: "17:49:29",
    timestamp: 1601888784000,
    timestamp_rx: 1601747100000,
    timestamp_tx: 1601747100000,
    top_user: null,
    tx: 2,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 2,
    time: "17:59:29",
    timestamp: 1601892384000,
    timestamp_rx: 1601747700000,
    timestamp_tx: 1601747700000,
    top_user: null,
    tx: 1,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 6,
    time: "18:09:29",
    timestamp: 1601895984000,
    timestamp_rx: 1601748300000,
    timestamp_tx: 1601748300000,
    top_user: null,
    tx: 4,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 7,
    time: "18:19:29",
    timestamp: 1601899584000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 6,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 7,
    time: "18:19:29",
    timestamp: 1601903184000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 6,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 7,
    time: "18:19:29",
    timestamp: 1601906784000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 6,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 7,
    time: "18:19:29",
    timestamp: 1602910384000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 6,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 7,
    time: "18:19:29",
    timestamp: 1603913984000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 6,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 7,
    time: "18:19:29",
    timestamp: 1604917584000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 6,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 7,
    time: "18:19:29",
    timestamp: 1605921184000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 6,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 1,
    time: "18:19:29",
    timestamp: 1606924785000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 1,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 7,
    time: "18:19:29",
    timestamp: 1607924796000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 6,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 5,
    time: "18:19:29",
    timestamp: 1608924877000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 4,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 7,
    time: "18:19:29",
    timestamp: 1609924887000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 1,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 3,
    time: "18:19:29",
    timestamp: 1611924897000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 2,
    up: "rx",
  },
];

var i = 0;

function App() {
  const [data, setData] = useState([]);

    useEffect(() => {
      
    }, []);

  return (
    <div className="app">
      <BarChart width={1000} height={400} data={newData} />
    </div>
  );
}

export default App;
