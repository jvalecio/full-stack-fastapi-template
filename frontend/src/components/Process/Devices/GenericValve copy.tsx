import { Handle, Position, NodeProps, Node } from '@xyflow/react'
import { Box, Image, Stack, Text } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui/tooltip'
import { useState } from 'react'

const IMG_ROOT = './assets/images/devices'
const DEFAULT_IDENT = 'Generic Valve'

export type ValveDataType = Node<
  {
    tag?: string
    tooltip?: string
    state?: 'open' | 'closed'
    mechanism?: 'ball' | 'neddle'
    actuator_prop?: 'manual' | 'pneumatic' | 'electric'
    onToggle?: (id: string, state: 'open' | 'closed') => void
  },
  'valve'
>

const DEFAULT_VALVE_DATA = {
  tag: 'VALVE',
  tooltip: 'Generic Valve',
  state: 'open' as 'open' | 'closed',
  mechanism: 'neddle' as 'ball' | 'neddle',
  actuator_prop: 'manual' as 'manual' | 'pneumatic' | 'electric'
}

export default function GenericValveNode (props: NodeProps<ValveDataType>) {
  const { id } = props

  const data = {
    ...DEFAULT_VALVE_DATA,
    ...props.data
  }

  const [state, setState] = useState<string>(data?.state || 'closed')
  const [loading, setLoading] = useState(false)

  const toggleValveHook = async () => {
    const res = await fetch(
      `http://localhost:8000/api/v1/devices/valve/${id}/toggle`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.detail || 'Erro ao comunicar com backend')
    }

    return await res.json()
  }

  const handleClick = async () => {
    if (loading) return

    // UI instantânea
    setLoading(true)

    try {
      const backendResponse = await toggleValveHook()
      console.log('FASTAPI:', backendResponse)

      const newState = backendResponse.new_state as 'open' | 'closed'
      setState(newState)
    } catch (err) {
      console.error(err)
      // rollback
      setState(prev => (prev === 'open' ? 'closed' : 'open'))
    }

    setLoading(false)
  }

  return (
    <Box
      position='relative'
      backgroundColor={'red'}
      w='150px'
      h='50px'
      // p="3px"
      display='flex'
      alignItems='center'
      justifyContent='center'
      cursor='pointer'
      onClick={handleClick}
    >
      <Stack h={0}>
        
      <Box style={{background:"pink"}}>
        {data.actuator_prop && false && (
          <Tooltip content={data.actuator_prop || DEFAULT_IDENT}>
            <Image
              mt={'50%'}
              position='absolute'
              transform='translate(-50%, 0%)'
              // left='50%'
              // bottom='50%'
              src={
                data.actuator_prop === 'manual'
                ? `${IMG_ROOT}/manual_prop.svg`
                : data.actuator_prop === 'pneumatic'
                ? `${IMG_ROOT}/pneumatic_prop.svg`
                : `${IMG_ROOT}/electric_prop.svg`
              }
              />
          </Tooltip>
        )}
        <Tooltip content={data.tooltip || DEFAULT_IDENT}>
          <Image
            loading='eager'
            style={{justifyContent:"center"}}
            src={
              state == 'open'
              ? `${IMG_ROOT}/valve_2w_generic_open.svg`
              : `${IMG_ROOT}/generic_2w_valve_closed.svg`
            }
            alt={data.tooltip || DEFAULT_IDENT}
            />
        </Tooltip>
        {data.mechanism == 'ball' && (
          <Image
          position='absolute'
          transform='translate(-50%, 50%)'
          left='50%'
          bottom='50%'
          src={`${IMG_ROOT}/ball_mechanism.svg`}
          />
        )}
      <Handle type='source' position={Position.Left} />
      <Handle type='target' position={Position.Right} />
      </Box>
      <Box>
        <Text
          style={{ backgroundColor: 'grey' }}
          position='relative'
          fontSize='xs'
          textAlign='center'
          >
          {data.tag}
        </Text>
      </Box>
      </Stack>
    </Box>
  )
}
