import { Container, Heading, RadioGroup } from '@chakra-ui/react'
import { useTheme } from 'next-themes'

const Appearance = () => {
  const { setTheme } = useTheme()
  const items = [
    { label: 'System', value: 'system' },
    { label: 'Light Mode', value: 'light' },
    { label: 'Dark Mode', value: 'dark' }
  ]

  return (
    <>
    <Container maxW='full'>
      <Heading size='sm' py={4}>
        Appearance
      </Heading>

      <RadioGroup.Root
        //colorPalette={colorPalette}
        defaultValue='react'
        spaceX='8'
        >
        {items.map(item => (
          <RadioGroup.Item key={item.value} value={item.value} onChange={() => setTheme(item.value)}>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </Container>
        </>
  )
}

export default Appearance
