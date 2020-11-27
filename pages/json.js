import Head from 'next/head'
import { useCallback, useState } from 'react';
import { QRCode } from 'react-qr-svg'
import styles from '../styles/Home.module.css'

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
    
    const qrcodeString = JSON.stringify(qrcodeValue);

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
                value={qrcodeString}
            />

            <form>
                <div>
                    <input value={key} onChange={(e) => setKey(e.target.value)} />
                    <input value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
                <button onClick={saveKey}>Salvar</button>
            </form>

            <pre className={styles.valuePreview}>
                <code>{qrcodeString}</code>
            </pre>
        </div>
    );
}