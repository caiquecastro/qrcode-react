import omit from 'lodash.omit'
import { CloseButton, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'

interface JsonTableProps {
  values: Record<string, string>
  onChange: (values: Record<string, string>) => void
}

export default function JsonTable({ values, onChange }: JsonTableProps) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Chave</Th>
          <Th>Valor</Th>
          <Th>Ação</Th>
        </Tr>
      </Thead>
      <Tbody>
        {Object.keys(values).map((key) => (
          <Tr key={key}>
            <Td>{key}</Td>
            <Td>{values[key]}</Td>
            <Td>
              <CloseButton
                size="sm"
                variant="danger"
                onClick={() => onChange(omit(values, key))}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
