import {
  Box,
  Button,
  CloseButton,
  Container,
  Drawer,
  Heading,
  Portal,
  Separator
} from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

import ValvesDiagram from '@/components/Process/IndustrialDiagram'
import { ReactFlowProvider } from '@xyflow/react'
import { DnDProvider } from '@/components/Process/useDnd'
import { Sidebar } from '@/components/Process/Sidebar'

export const Route = createFileRoute('/_layout/')({
  component: Dashboard
})

function Dashboard () {
  return (
    <Container maxW='full'>
      <Box p={4}>
        <Heading size='lg'>Process Control Dashboard</Heading>
        <Separator m={1} />

        <Box h='10vh'>teste</Box>
        <ReactFlowProvider>
          <DnDProvider>
            {/* Drawer com suporte para DnD */}
            <Drawer.Root>
              <Drawer.Trigger asChild>
                <Button variant='outline' size='sm'>
                  Open Drawer
                </Button>
              </Drawer.Trigger>

              <Portal>
                {/* Sem backdrop */}
                <Drawer.Positioner
                  style={{
                    zIndex: 2000, // <- fundamental
                    pointerEvents: 'auto' // <- garante interação
                  }}
                >
                  <Drawer.Content
                    pointerEvents='auto'
                    style={{
                      background: 'white'
                    }}
                  >
                    <Drawer.Header>
                      <Drawer.Title>Drawer Title</Drawer.Title>
                    </Drawer.Header>

                    <Drawer.Body>
                      <Sidebar />
                    </Drawer.Body>

                    <Drawer.Footer>
                      <Button variant='outline'>Cancel</Button>
                      <Button>Save</Button>
                    </Drawer.Footer>

                    <Drawer.CloseTrigger asChild>
                      <CloseButton size='sm' />
                    </Drawer.CloseTrigger>
                  </Drawer.Content>
                </Drawer.Positioner>
              </Portal>
            </Drawer.Root>

            {/* O diagrama deve estar dentro do ReactFlowProvider */}

            <Box mt={4} className='react-flow'>
              <ValvesDiagram/>
            </Box>
          </DnDProvider>
        </ReactFlowProvider>
      </Box>
    </Container>
  )
}
