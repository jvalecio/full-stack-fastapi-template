import {Box, Container, Heading, Separator } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

// Update the import path below to the correct relative path or package name
import ValvesDiagram from '@/components/Process/IndustrialDiagram'

export const Route = createFileRoute('/_layout/')({
  component: Dashboard
})


function Dashboard () {
  return (
    <>
      <Container maxW='full'>
        <Box pt={12}>
        <Heading size="lg" >
            Process Control Dashboard
        </Heading>
        <Separator m={1} />

       <ValvesDiagram />
        
        </Box>
      </Container>
    </>
  )
}
