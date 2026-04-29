import { Box, Button, Container, Heading, Separator } from '@chakra-ui/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ReactFlowProvider } from '@xyflow/react'

import ValvesDiagram from '@/components/Process/IndustrialDiagram'

export const Route = createFileRoute('/_layout/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <Container maxW='full'>
      <Box p={4}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Heading size='lg'>Process Control Dashboard</Heading>
          <Button variant='outline' size='sm' asChild>
            <Link to='/diagram/edit'>Editar Diagrama</Link>
          </Button>
        </Box>
        <Separator m={1} />

        <Box mt={4}>
          <ReactFlowProvider>
            <ValvesDiagram mode='run' />
          </ReactFlowProvider>
        </Box>
      </Box>
    </Container>
  )
}
