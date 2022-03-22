import React from 'react'

function CategoryDropdown() {
  const options = [
    { label: 'All', value: 'all' },
    { label: 'Freetime', value: 'freetime' },
    { label: 'AWS', value: 'aws' },
  ]

  const [value, setValue] = React.useState('all')

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setValue(event.target.value)
  }

  return (
    <label>
      {'Category: '}
      <select value={value} onChange={handleChange}>
        {options.map((option: any) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}

export default CategoryDropdown
