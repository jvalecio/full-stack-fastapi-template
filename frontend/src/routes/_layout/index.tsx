import { Box, Container, Flex, Separator, Text } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

// Update the import path below to the correct relative path or package name
import { Button, Field, NumberInput, Stack } from '@chakra-ui/react'
import { DataList } from "@chakra-ui/react"

export const Route = createFileRoute('/_layout/')({
  component: Dashboard
})

interface LpmInputProps {
  max_flow?: number
  tag?: string
}

function LpmInput({ max_flow = 500, tag = 'None'}: LpmInputProps) {
  return (
    <Field.Root>
      <Field.Label>Controller {tag}</Field.Label>
      <NumberInput.Root width="200px" max={max_flow} min={0} step={0.1}>
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
      <Field.HelperText>Enter a number between 1 and {max_flow}</Field.HelperText>
    </Field.Root>
  )
}

function ControllerInfo(){
  return(
    <Stack direction='row' gap='20' align='flex-start' maxW='sm'>
      <Text>Feedback: {200}</Text>
    </Stack>
  )
}

const stats = [
  { label: "Setpoint", value: "234", diff: -12, helpText: "Till date" },
  { label: "Feedback", value: "£12,340", diff: 12, helpText: "Last 30 days" },
]

function Dashboard () {
  return (
    <>
      <Container maxW='full'>
        <Box pt={12} m={4}>
          <Text fontSize='2xl' truncate maxW='sm'>
            Process control
          </Text>

          <Separator m={1} />

          <form>
            <Stack direction='row' gap='10' align='flex-start' maxW='sm'>
              <Stack direction='row' gap='10' flex='1'>
                  <LpmInput max_flow={100} tag='MSF2A'/>

                  <DataList.Root orientation="horizontal">
                  {stats.map((item) => (
                    <DataList.Item key={item.label}>
                      <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
                      <br />
                      <DataList.ItemValue>{item.value}</DataList.ItemValue>
                    </DataList.Item>
                  ))}
                </DataList.Root>

              </Stack>
              
            </Stack>
          </form>
        </Box>
      </Container>
    </>
  )
}
