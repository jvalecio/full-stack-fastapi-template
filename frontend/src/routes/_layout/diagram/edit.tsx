import {
  Box,
  Button,
  CloseButton,
  Container,
  Drawer,
  Heading,
  Portal,
  Separator,
} from '@chakra-ui/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ReactFlowProvider } from '@xyflow/react'

import ValvesDiagram from '@/components/Process/IndustrialDiagram'
import { DnDProvider } from '@/components/Process/useDnd'
import { Sidebar } from '@/components/Process/Sidebar'

export const Route = createFileRoute('/_layout/diagram/edit')({
  component: DiagramEdit,
})

function DiagramEdit() {
  return (
    <Container maxW='full'>
      <Box p={4}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Heading size='lg'>Editor de Diagrama</Heading>
          <Button variant='outline' size='sm' asChild>
            <Link to='/'>← Voltar para Runtime</Link>
          </Button>
        </Box>
        <Separator m={1} />

        <ReactFlowProvider>
          <DnDProvider>
            <Drawer.Root>
              <Portal>
                <Drawer.Positioner style={{ zIndex: 2000, pointerEvents: 'auto' }}>
                  <Drawer.Content pointerEvents='auto' style={{ background: 'white' }}>
                    <Drawer.Header>
                      <Drawer.Title>Dispositivos</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                      <Sidebar />
                    </Drawer.Body>
                    <Drawer.CloseTrigger asChild>
                      <CloseButton size='sm' />
                    </Drawer.CloseTrigger>
                  </Drawer.Content>
                </Drawer.Positioner>
              </Portal>

              <Box position='relative' mt={4}>
                <Drawer.Trigger asChild>
                  <Button
                    position='absolute'
                    top={2}
                    left={2}
                    zIndex={10}
                    size='sm'
                    variant='outline'
                    bg='white'
                  >
                    ☰ Dispositivos
                  </Button>
                </Drawer.Trigger>

                <ValvesDiagram mode='edit' />
              </Box>
            </Drawer.Root>
          </DnDProvider>
        </ReactFlowProvider>
      </Box>
    </Container>
  )
}
