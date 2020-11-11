import Head from 'next/head'
import { useState } from 'react'
import { QRCode } from 'react-qr-svg'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

export default function Home() {
  const router = useRouter()
  const [value, setValue] = useState('')

  const qrcodeValue = router.query.prefix ? `${router.query.prefix}${value}` : value

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
        value={qrcodeValue}
      />

      <input
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={20}
      />
      <pre className={styles.valuePreview}>
        <code>{qrcodeValue}</code>
      </pre>
    </div>
  )
}
