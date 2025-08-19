import { createFileRoute } from '@tanstack/react-router'
import {
  Box,
  Container,
  Separator,
  Heading
} from '@chakra-ui/react'
// Update the import path below to the correct relative path or package name
import { Button, Field, NumberInput, Stack } from '@chakra-ui/react'
import { DataList } from '@chakra-ui/react'
import { Status } from '@chakra-ui/react'

interface LpmInputProps {
  max_flow?: number
  tag?: string
}
export const Route = createFileRoute('/_layout/control')({
  component: Control
})

function LpmInput ({ max_flow = 500, tag = 'None' }: LpmInputProps) {
  return (
    <Field.Root>
      <Field.Label>Controller {tag}</Field.Label>
      <NumberInput.Root width='200px' max={max_flow} min={0} step={0.1}>
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
      <Field.HelperText>
        Enter a number between 1 and {max_flow}
      </Field.HelperText>
    </Field.Root>
  )
}

function ControllerInfo () {
  return (
    <Stack direction='row' gap='2'>
      <LpmInput max_flow={100} tag='MSF2A' />
      <DataList.Root orientation='horizontal' ml='5' mt='5'>
        {stats.map(item => (
          <DataList.Item key={item.label}>
            <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
            <br />
            <DataList.ItemValue>{item.value}</DataList.ItemValue>
          </DataList.Item>
        ))}
      </DataList.Root>
    </Stack>
  )
}

const stats = [
  { label: 'Setpoint', value: '55.2', diff: -12, helpText: 'lpm' },
  { label: 'Feedback', value: '55.2', diff: 12, helpText: 'lpm' }
]

function Control () {
  return (
    <>
      <Container maxW='full'>
        <Box pt={12} mb={8}>
          <Heading size='lg'>Process Control</Heading>
          <Separator m={1} />

          <Stack direction='row' gap='5'>
            <Status.Root colorPalette='red'>
              <Status.Indicator />
              PLC Connection
            </Status.Root>
            <Status.Root colorPalette='red'>
              <Status.Indicator />
              NAPRO Connection
            </Status.Root>
            <Status.Root colorPalette='red'>
              <Status.Indicator />
              Remote Connection
            </Status.Root>
          </Stack>

          <Stack
            direction={{ base: 'column', md: 'row' }} // coluna em telas pequenas, linha em médias+
            mt={6}
            gap={20}
          >
            <Stack
              
              direction='column'
              alignItems='left'
              justifyContent='left'
            >
              <ControllerInfo />
              <ControllerInfo />
              <ControllerInfo />
            </Stack>

            {/* Esse separator só aparece em telas médias pra cima */}
            <Separator
              display={{ base: 'none', md: 'block' }}
              orientation='vertical'
              //ml={15}
              //mr={15}
            />

            <Stack
              //ml={5}
              direction='column'
              alignItems='left'
              justifyContent='left'
            >
              <ControllerInfo />
              <ControllerInfo />
              <ControllerInfo />
            </Stack>
          </Stack>

          <Stack direction='row' gap='2' mt={6}>
            <Button>BUTTON A</Button>
            <Button>BUTTON B</Button>
            <Button>BUTTON C</Button>
          </Stack>
        </Box>
      </Container>
    </>
  )
}
