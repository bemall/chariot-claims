import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home', () => {
  it('renders Next.js logo', () => {
    render(<Home />)
    
    const logo = screen.getByRole('img', { name: /next.js logo/i })
    expect(logo).toBeInTheDocument()
  })
})
