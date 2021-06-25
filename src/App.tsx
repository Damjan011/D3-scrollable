import React, { useEffect, useState } from 'react';
import BandwidthGraph from './components/BandwidthGraph';

const newData = [
  {
    dn: "tx",
    rx: 3,
    time: "18:19:29",
    timestamp: Date.now() - 360000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 4,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 3,
    time: "18:19:29",
    timestamp: Date.now() - 330000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 5,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 4,
    time: "18:19:29",
    timestamp: Date.now() - 300000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 2,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 6,
    time: "18:19:29",
    timestamp: Date.now() - 270000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 5,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 2,
    time: "18:19:29",
    timestamp: Date.now() - 240000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 4,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 5,
    time: "18:19:29",
    timestamp: Date.now() - 210000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 2,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 7,
    time: "18:19:29",
    timestamp: Date.now() - 180000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 6,
    up: "rx",
  },

  {
    dn: "tx",
    rx: 6,
    time: "18:19:29",
    timestamp: Date.now() - 150000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 3,
    up: "rx",
  },


  {
    dn: "tx",
    rx: 7,
    time: "18:19:29",
    timestamp: Date.now() - 120000,
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
    timestamp: Date.now() - 90000,
    timestamp_rx: 1601749500000,
    timestamp_tx: 1601749500000,
    top_user: null,
    tx: 6,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 6,
    time: "18:09:29",
    timestamp: Date.now() - 60000,
    timestamp_rx: 1601748300000,
    timestamp_tx: 1601748300000,
    top_user: null,
    tx: 4,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 2,
    time: "17:59:29",
    timestamp: Date.now() - 30000,
    timestamp_rx: 1601747700000,
    timestamp_tx: 1601747700000,
    top_user: null,
    tx: 1,
    up: "rx",
  },
  {
    dn: "tx",
    rx: 1,
    time: "17:49:29",
    timestamp: Date.now(),
    timestamp_rx: 1601747100000,
    timestamp_tx: 1601747100000,
    top_user: null,
    tx: 2,
    up: "rx",
  },
];

function App() {
  const [data, setData] = useState(newData);

  useEffect(() => {
    // setTimeout(() => {
    //   setData([
    //     ...data,
    //     {
    //       dn: "tx",
    //       rx: 4,
    //       time: "18:19:29",
    //       timestamp: 1603124887000,
    //       timestamp_rx: 1601749500000,
    //       timestamp_tx: 1601749500000,
    //       top_user: null,
    //       tx: 5,
    //       up: "rx",
    //     },
    //     {
    //       dn: "tx",
    //       rx: 3,
    //       time: "18:19:29",
    //       timestamp: 1603224897000,
    //       timestamp_rx: 1601749500000,
    //       timestamp_tx: 1601749500000,
    //       top_user: null,
    //       tx: 2,
    //       up: "rx",
    //     },
    //   ])
    //   console.log('desio sam se')
    // }, 5000)
  }, [])

  return (
    <div className="app">
      <div className="side-bar">
        <p>Sidebar</p>
      </div>
      <div style={{paddingTop: '100px'}} className="main-content">
      <BandwidthGraph height={180} data={data} />
      <div className="break"></div>
      {/* <HealthGraph width={800} height={190} data={data} /> */}
      {/* <BandwidthGraph width={800} height={190} data={data} />
      <BandwidthGraph width={800} height={190} data={data} /> */}
      </div>
    </div>
  );
}

export default App;
