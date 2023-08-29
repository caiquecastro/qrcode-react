import Head from 'next/head'
import { useEffect, useState } from 'react'
import { QRCodeSVG as QRCode } from 'qrcode.react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { Container, Input } from '@chakra-ui/react'

export default function Home() {
  const router = useRouter()
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(router.query.text || '')
  }, [router])

  const qrcodeValue = router.query.prefix ? `${router.query.prefix}${value}` : value

  return (
    <Container maxW="lg" marginY={10} centerContent>
      <Head>
        <title>QRCode Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QRCode
        level="Q"
        size={300}
        value={qrcodeValue}
        includeMargin
      />

      <Input
        marginY={2}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <pre className={styles.valuePreview}>
        <code>{qrcodeValue}</code>
      </pre>
    </Container>
  )
}
