import Head from 'next/head'
import { QRCode } from 'react-qr-svg'
import { useCallback, useState } from 'react'
import styles from '../styles/Home.module.css'
import JsonTable from '../components/JsonTable'
import { Button, Container, Input } from '@chakra-ui/react'

export default function JsonQrcode() {
    const [values, setValues] = useState([]);
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const saveKey = useCallback((e) => {
        e.preventDefault();

        setValues((v) => ({
            ...v,
            [key]: value,
        }));

        setKey('');
        setValue('');
    }, [key, value]);


    const qrcodeValue = Object.keys(values).reduce((acc, cur) => {
        return {
            ...acc,
            [cur]: values[cur],
        };
    }, {});
    
    const qrcodeString = JSON.stringify(qrcodeValue, null, 2);

    return (
        <Container maxW="lg" marginY={10} centerContent>
            <Head>
                <title>QRCode Generator</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <QRCode
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="Q"
                style={{ width: 256 }}
                value={qrcodeString}
            />

            <form>
                <div>
                    <Input value={key} onChange={(e) => setKey(e.target.value)} />
                    <Input value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
                <Button onClick={saveKey} type="submit">Salvar</Button>
            </form>

            <JsonTable values={values} onChange={setValues} />

            <div className={styles.valuePreview}>
                <code>{qrcodeString}</code>
            </div>
        </Container>
    );
}