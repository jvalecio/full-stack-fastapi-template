import {
  Button, CloseButton, Dialog, Field, HStack,
  Input, Portal, Stack, Text, NativeSelect,
} from '@chakra-ui/react'
import { useReactFlow, useNodes } from '@xyflow/react'
import { useState } from 'react'
import { useDiagramContext } from './DiagramContext'
import { getSignalSchemas } from './Devices/catalog'
import {
  type ModbusRegisterType,
  type Access,
  type DataType,
} from './Devices/signals'

// ---------------------------------------------------------------------------
// Tipos locais do formulário
// ---------------------------------------------------------------------------

type FormBinding = {
  register_type: ModbusRegisterType
  address: number
}

type FormState = {
  tag: string
  slave_id: number
  poll_interval_ms: number
  signals: Record<string, FormBinding>
}

const REGISTER_OPTIONS: { value: ModbusRegisterType; label: string }[] = [
  { value: 'coil',             label: 'Coil (0x) — bool rw' },
  { value: 'discrete_input',   label: 'Discrete Input (1x) — bool r' },
  { value: 'input_register',   label: 'Input Register (3x) — 16bit r' },
  { value: 'holding_register', label: 'Holding Register (4x) — 16bit rw' },
]

function defaultRegisterType(access: Access, data_type: DataType): ModbusRegisterType {
  const isBool = data_type === 'bool'
  if (access === 'r')  return isBool ? 'discrete_input'   : 'input_register'
  if (access === 'w')  return 'coil'
  return isBool ? 'coil' : 'holding_register'
}

function initForm(node: { id: string; type?: string; data: Record<string, unknown> }): FormState {
  const schemas = getSignalSchemas(node.type ?? '')
  const conn = node.data.connection as { poll_interval_ms?: number; signals?: Record<string, { binding?: Partial<FormBinding> }> } | undefined

  const signals: Record<string, FormBinding> = {}
  for (const [name, schema] of Object.entries(schemas)) {
    const existing = conn?.signals?.[name]?.binding
    signals[name] = {
      register_type: existing?.register_type ?? defaultRegisterType(schema.access, schema.data_type),
      address:       existing?.address       ?? 0,
    }
  }

  const firstBinding = conn?.signals ? Object.values(conn.signals)[0]?.binding as { slave_id?: number } | undefined : undefined

  return {
    tag: (node.data.tag as string) ?? node.id,
    slave_id: firstBinding?.slave_id ?? 1,
    poll_interval_ms: conn?.poll_interval_ms ?? 500,
    signals,
  }
}

// ---------------------------------------------------------------------------
// Formulário interno (re-monta ao trocar de nó via key)
// ---------------------------------------------------------------------------

function EditForm({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
  const nodes = useNodes()
  const { updateNodeData } = useReactFlow()

  const node = nodes.find(n => n.id === nodeId)
  if (!node) return null

  const schemas = getSignalSchemas(node.type ?? '')
  const [form, setForm] = useState<FormState>(() => initForm(node as { id: string; type?: string; data: Record<string, unknown> }))

  function setTag(tag: string) {
    setForm(f => ({ ...f, tag }))
  }

  function setSignalField(name: string, field: keyof FormBinding, value: string | number) {
    setForm(f => ({
      ...f,
      signals: {
        ...f.signals,
        [name]: { ...f.signals[name], [field]: typeof value === 'string' ? value : Number(value) },
      },
    }))
  }

  function handleSave() {
    const signals: Record<string, unknown> = {}
    for (const [name, binding] of Object.entries(form.signals)) {
      const schema = schemas[name]
      signals[name] = {
        ...schema,
        binding: { protocol: 'modbus', slave_id: form.slave_id, ...binding },
      }
    }
    updateNodeData(nodeId, {
      tag: form.tag,
      connection: { poll_interval_ms: form.poll_interval_ms, signals },
    })
    onClose()
  }

  const hasSignals = Object.keys(schemas).length > 0

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>
          Propriedades — {node.type} ({nodeId})
        </Dialog.Title>
      </Dialog.Header>

      <Dialog.Body>
        <Stack gap={5}>
          {/* Tag + Slave ID + Poll global */}
          <HStack gap={4} align='flex-end'>
            <Field.Root flex='1'>
              <Field.Label>Tag</Field.Label>
              <Input
                value={form.tag}
                onChange={e => setTag(e.target.value)}
                placeholder='ex: FIC-101'
              />
            </Field.Root>
            <Field.Root flex='0 0 90px'>
              <Field.Label>Slave ID</Field.Label>
              <Input
                type='number'
                value={form.slave_id}
                min={1}
                max={247}
                onChange={e => setForm(f => ({ ...f, slave_id: Number(e.target.value) }))}
              />
            </Field.Root>
            <Field.Root flex='0 0 110px'>
              <Field.Label>Poll leitura (ms)</Field.Label>
              <Input
                type='number'
                value={form.poll_interval_ms}
                min={100}
                step={100}
                onChange={e => setForm(f => ({ ...f, poll_interval_ms: Number(e.target.value) }))}
              />
            </Field.Root>
          </HStack>

          {/* Sinais Modbus */}
          {hasSignals && (
            <Stack gap={4}>
              <Text fontWeight='semibold' fontSize='sm' color='gray.600'>
                Endereçamento Modbus
              </Text>

              {Object.entries(schemas).map(([name, schema]) => {
                const binding = form.signals[name]
                const accessLabel = { r: 'leitura', w: 'escrita', rw: 'leitura/escrita' }[schema.access]
                return (
                  <Stack
                    key={name}
                    gap={3}
                    p={3}
                    borderWidth='1px'
                    borderRadius='md'
                    borderColor='gray.200'
                  >
                    <HStack justify='space-between'>
                      <Text fontWeight='medium' fontSize='sm'>{name}</Text>
                      <Text fontSize='xs' color='gray.500'>
                        {schema.description} · {accessLabel}
                        {schema.unit ? ` · ${schema.unit}` : ''}
                      </Text>
                    </HStack>

                    <HStack gap={3} align='flex-end'>
                      <Field.Root flex='1'>
                        <Field.Label fontSize='xs'>Tipo de registrador</Field.Label>
                        <NativeSelect.Root size='sm'>
                          <NativeSelect.Field
                            value={binding.register_type}
                            onChange={e => setSignalField(name, 'register_type', e.target.value)}
                          >
                            {REGISTER_OPTIONS.map(o => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>

                      <Field.Root flex='0 0 80px'>
                        <Field.Label fontSize='xs'>Endereço</Field.Label>
                        <Input
                          type='number'
                          size='sm'
                          value={binding.address}
                          min={0}
                          onChange={e => setSignalField(name, 'address', e.target.value)}
                        />
                      </Field.Root>
                    </HStack>
                  </Stack>
                )
              })}
            </Stack>
          )}

          {!hasSignals && (
            <Text fontSize='sm' color='gray.400'>
              Nenhum sinal configurado para este tipo de dispositivo.
            </Text>
          )}
        </Stack>
      </Dialog.Body>

      <Dialog.Footer>
        <HStack>
          <Button variant='outline' onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </HStack>
      </Dialog.Footer>
    </>
  )
}

// ---------------------------------------------------------------------------
// Modal principal
// ---------------------------------------------------------------------------

export function NodeEditModal() {
  const { editingNodeId, setEditingNodeId } = useDiagramContext()
  const isOpen = editingNodeId !== null

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={({ open }) => { if (!open) setEditingNodeId(null) }}
      size='lg'
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {isOpen && (
              <EditForm
                key={editingNodeId}
                nodeId={editingNodeId!}
                onClose={() => setEditingNodeId(null)}
              />
            )}
            <Dialog.CloseTrigger asChild>
              <CloseButton size='sm' />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
