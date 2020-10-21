import * as rc from 'rc';
import * as React from 'react';
import * as ReactPDF from '@react-pdf/renderer';
import { Page, Text, Image, View, Document, StyleSheet } from '@react-pdf/renderer';
import { resolve } from 'path';
import { toBuffer } from 'qrcode';
import { existsSync, mkdirSync } from 'fs';

const config = rc('orga', {
  source: process.cwd(),
  target: resolve(process.cwd(), 'out'),
  moveDb: 'move-wiki.json',
});

const outDir = resolve(process.cwd(), config.target);
const inFile = resolve(config.source, config.moveDb);
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
  },
  section: {
    margin: '5 0',
    flexDirection: 'row',
    alignItems: 'center',
    border: '1pt solid #cccccc',
  },
  id: {
    transform: 'rotate(270deg)',
    textAlign: 'center',
    color: '#666666',
    margin: '0 10',
    fontSize: '16pt',
    width: '30pt',
  },
  name: {
    padding: '0 10',
    fontSize: '52pt',
    color: '#666666',
    flexGrow: 1,
  },
  qrCode: {
    width: 132,
    height: 132,
  },
});
const { boxes } = require(inFile);

if (!existsSync(outDir)) {
  mkdirSync(outDir);
}

async function render() {
  interface BoxInfo {
    id: string;
    type: string;
    labels: Array<string>;
    content: Array<string>;
    source: string;
    target: string;
  }

  const items = await Promise.all(
    (boxes as Array<BoxInfo>).map(async (box) => {
      const qrCode = await toBuffer(`@orga/move-wiki:${box.id}`);
      return {
        ...box,
        qrCode,
      };
    }),
  );

  interface BoxLabelProps {
    id: string;
    qrCode: Buffer;
    target: string;
  }

  const BoxLabel: React.FC<BoxLabelProps> = ({ id, qrCode, target }) => (
    <View style={styles.section}>
      <Text style={styles.id}>{id}</Text>
      <Image style={styles.qrCode} src={{ data: qrCode, format: 'png' }} />
      <Text style={styles.name}>{target || 'Keller (tbd)'}</Text>
    </View>
  );

  const BoxLabels: React.FC = () => (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {items.map((item) => (
          <React.Fragment key={item.id}>
            <BoxLabel {...item} />
            <BoxLabel {...item} />
            <BoxLabel {...item} />
            <BoxLabel {...item} />
          </React.Fragment>
        ))}
      </Page>
    </Document>
  );

  // @ts-ignore
  ReactPDF.render(<BoxLabels />, resolve(outDir, `labels.pdf`));
}

render();
