import Head from 'next/head'
import { useState } from 'react'
import { QRCodeSVG as QRCode } from 'qrcode.react'
import styles from '../styles/Home.module.css'
import {
  Container,
  Input,
  ButtonGroup,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Select,
  Textarea,
} from '@chakra-ui/react'

type QRType = 'text' | 'url' | 'wifi' | 'email' | 'phone' | 'sms' | 'vcard'

interface TextFields { text: string }
interface UrlFields { url: string }
interface WifiFields { ssid: string; password: string; security: 'WPA' | 'WEP' | 'nopass'; hidden: 'true' | 'false' }
interface EmailFields { to: string; subject: string; body: string }
interface PhoneFields { phone: string }
interface SmsFields { phone: string; message: string }
interface VCardFields { firstName: string; lastName: string; phone: string; email: string; org: string }

type FieldsByType = {
  text: TextFields
  url: UrlFields
  wifi: WifiFields
  email: EmailFields
  phone: PhoneFields
  sms: SmsFields
  vcard: VCardFields
}

const TYPES: { id: QRType; label: string }[] = [
  { id: 'text', label: 'Text' },
  { id: 'url', label: 'URL' },
  { id: 'wifi', label: 'WiFi' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'sms', label: 'SMS' },
  { id: 'vcard', label: 'Contact' },
]

const DEFAULT_FIELDS: FieldsByType = {
  text: { text: '' },
  url: { url: '' },
  wifi: { ssid: '', password: '', security: 'WPA', hidden: 'false' },
  email: { to: '', subject: '', body: '' },
  phone: { phone: '' },
  sms: { phone: '', message: '' },
  vcard: { firstName: '', lastName: '', phone: '', email: '', org: '' },
}

function buildValue(type: QRType, fields: FieldsByType[QRType]): string {
  switch (type) {
    case 'text':
      return (fields as TextFields).text
    case 'url':
      return (fields as UrlFields).url
    case 'wifi': {
      const f = fields as WifiFields
      const hidden = f.hidden === 'true' ? 'H:true;' : ''
      return `WIFI:T:${f.security};S:${f.ssid};P:${f.password};${hidden};`
    }
    case 'email': {
      const f = fields as EmailFields
      return `MATMSG:TO:${f.to};SUB:${f.subject};BODY:${f.body};;`
    }
    case 'phone':
      return `tel:${(fields as PhoneFields).phone}`
    case 'sms': {
      const f = fields as SmsFields
      return `SMSTO:${f.phone}:${f.message}`
    }
    case 'vcard': {
      const f = fields as VCardFields
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${f.lastName};${f.firstName}`,
        `FN:${f.firstName} ${f.lastName}`.trim(),
        f.phone ? `TEL:${f.phone}` : '',
        f.email ? `EMAIL:${f.email}` : '',
        f.org ? `ORG:${f.org}` : '',
        'END:VCARD',
      ]
        .filter(Boolean)
        .join('\n')
    }
  }
}

interface TextFieldProps {
  label: string
  fieldKey: string
  fields: Record<string, string>
  onChange: (key: string, value: string) => void
}

function TextField({ label, fieldKey, fields, onChange }: TextFieldProps) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input value={fields[fieldKey] ?? ''} onChange={(e) => onChange(fieldKey, e.target.value)} />
    </FormControl>
  )
}

interface TypeFormProps {
  type: QRType
  fields: Record<string, string>
  onChange: (key: string, value: string) => void
}

function TypeForm({ type, fields, onChange }: TypeFormProps) {
  switch (type) {
    case 'text':
      return <TextField label="Text" fieldKey="text" fields={fields} onChange={onChange} />
    case 'url':
      return <TextField label="URL" fieldKey="url" fields={fields} onChange={onChange} />
    case 'wifi':
      return (
        <>
          <TextField label="Network name (SSID)" fieldKey="ssid" fields={fields} onChange={onChange} />
          <TextField label="Password" fieldKey="password" fields={fields} onChange={onChange} />
          <FormControl>
            <FormLabel>Security</FormLabel>
            <Select value={fields.security} onChange={(e) => onChange('security', e.target.value)}>
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Hidden network</FormLabel>
            <Select value={fields.hidden} onChange={(e) => onChange('hidden', e.target.value)}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </Select>
          </FormControl>
        </>
      )
    case 'email':
      return (
        <>
          <TextField label="To" fieldKey="to" fields={fields} onChange={onChange} />
          <TextField label="Subject" fieldKey="subject" fields={fields} onChange={onChange} />
          <FormControl>
            <FormLabel>Body</FormLabel>
            <Textarea
              value={fields.body ?? ''}
              onChange={(e) => onChange('body', e.target.value)}
              rows={3}
            />
          </FormControl>
        </>
      )
    case 'phone':
      return <TextField label="Phone number" fieldKey="phone" fields={fields} onChange={onChange} />
    case 'sms':
      return (
        <>
          <TextField label="Phone number" fieldKey="phone" fields={fields} onChange={onChange} />
          <FormControl>
            <FormLabel>Message</FormLabel>
            <Textarea
              value={fields.message ?? ''}
              onChange={(e) => onChange('message', e.target.value)}
              rows={3}
            />
          </FormControl>
        </>
      )
    case 'vcard':
      return (
        <>
          <TextField label="First name" fieldKey="firstName" fields={fields} onChange={onChange} />
          <TextField label="Last name" fieldKey="lastName" fields={fields} onChange={onChange} />
          <TextField label="Phone" fieldKey="phone" fields={fields} onChange={onChange} />
          <TextField label="Email" fieldKey="email" fields={fields} onChange={onChange} />
          <TextField label="Organization" fieldKey="org" fields={fields} onChange={onChange} />
        </>
      )
  }
}

export default function Home() {
  const [activeType, setActiveType] = useState<QRType>('text')
  const [fieldsByType, setFieldsByType] = useState<FieldsByType>(DEFAULT_FIELDS)

  const fields = fieldsByType[activeType]
  const qrcodeValue = buildValue(activeType, fields)

  function handleFieldChange(key: string, val: string) {
    setFieldsByType((prev) => ({
      ...prev,
      [activeType]: { ...prev[activeType], [key]: val },
    }))
  }

  return (
    <Container maxW="lg" marginY={10} centerContent>
      <Head>
        <title>QRCode Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QRCode level="Q" size={300} value={qrcodeValue || ' '} includeMargin />

      <ButtonGroup
        variant="outline"
        size="sm"
        isAttached
        flexWrap="wrap"
        justifyContent="center"
        marginY={4}
        gap={1}
      >
        {TYPES.map(({ id, label }) => (
          <Button
            key={id}
            onClick={() => setActiveType(id)}
            colorScheme={activeType === id ? 'blue' : 'gray'}
            variant={activeType === id ? 'solid' : 'outline'}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>

      <VStack spacing={3} width="100%">
        <TypeForm
          type={activeType}
          fields={fields as unknown as Record<string, string>}
          onChange={handleFieldChange}
        />
      </VStack>

      <pre className={styles.valuePreview}>
        <code>{qrcodeValue}</code>
      </pre>
    </Container>
  )
}
