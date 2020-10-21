import * as rc from 'rc';
import * as React from 'react';
import * as ReactPDF from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';

const config = rc("orga", {
  source: process.cwd(),
  target: resolve(process.cwd(), 'out'),
  folderDb: 'folder-labels.json',
});

const outDir = resolve(process.cwd(), config.target);
const inFile = resolve(config.source, config.folderDb);
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  section: {
    margin: '0 20',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#cccccc',
  },
  number: {
    padding: '0 10',
    width: 50,
    color: '#cccccc',
  },
  name: {
    padding: '0 10',
    flexGrow: 1,
  },
});

const { definitions } = require(inFile);

if (!existsSync(outDir)) {
  mkdirSync(outDir);
}

for (const definition of definitions.filter((m) => !!m.parts)) {
  const name = `${definition.id} - ${definition.category} ${definition.name}`;
  const sections = [];
  const size = ~~(842 / (2 * definition.parts)) - 4;
  const numberStyle = { ...styles.number, fontSize: `${size}pt` };
  const nameStyle = { ...styles.name, fontSize: `${Math.min(16, size)}pt` };

  console.log(`Creating PDF for ${name} ...`);

  for (let i = 0; i < definition.parts; i++) {
    sections.push(
      <View style={styles.section} key={`sec_${i}`}>
        <View style={numberStyle}>
          <Text>{i + 1}</Text>
        </View>
        <View style={nameStyle}>
          <Text>{definition[i + 1]}</Text>
        </View>
      </View>,
      <View style={styles.separator} key={`sep_${i}`} />,
    );
  }

  sections.pop();

  const FolderSeparator = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {sections}
      </Page>
    </Document>
  );

  // @ts-ignore
  ReactPDF.render(<FolderSeparator />, resolve(outDir, `${name}.pdf`));

  console.log(`Created PDF for ${name}.`);
}
