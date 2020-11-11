import Head from 'next/head'
import { useState } from 'react'
import { QRCode } from 'react-qr-svg'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [value, setValue] = useState('');

  return (
    <div className={styles.container}>
      <Head>
        <title>QRCode Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QRCode
        bgColor="#FFFFFF"
        fgColor="#000000"
        level="Q"
        style={{ width: 256 }}
        value={value}
      />

      <input
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={20}
      />
    </div>
  )
}
