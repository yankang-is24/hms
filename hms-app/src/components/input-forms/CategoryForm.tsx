import { Textarea, Group, Button, Card } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import {
  addCategory,
  editCategory,
  getCategoryDetails,
} from '../../actions/CategoryActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { CheckIcon, Cross2Icon } from '@modulz/radix-icons'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'
import { dark2, JOIN_BUTTON_COLOR } from '../../common/colors'

type IProps = {
  hackathonId: string
  categoryId: string
  context: string
}

export default function CategoryForm(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const { hackathonId, categoryId, context } = props
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState({
    hackathonID: hackathonId,
    categoryID: categoryId,
    title: '',
    description: '',
  })

  const loadSelectedCategory = () => {
    getCategoryDetails(instance, categoryId).then(
      (data) => {
        setIsLoading(false)
        setCategory({
          title: data.title,
          description: data.description,
          hackathonID: hackathonId,
          categoryID: categoryId,
        })
      },
      () => {
        setIsLoading(false)
      }
    )
  }

  useEffect(() => {
    loadSelectedCategory()
    setIsLoading(true)
  }, [])

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setCategory((prevCategoryText) => ({
      ...prevCategoryText,
      [event.target.name]: event.target.value,
    }))
  }

  function editThisCategory(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showNotification({
      id: 'category-load',
      loading: true,
      title: `Editing ${category.title}`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    editCategory(instance, category).then((response) => {
      if (JSON.stringify(response).toString().includes('error')) {
        updateNotification({
          id: 'category-load',
          color: 'red',
          title: 'Failed to edit category',
          message: undefined,
          icon: <Cross2Icon />,
          autoClose: 2000,
        })
      } else {
        updateNotification({
          id: 'category-load',
          color: 'teal',
          title: `Edited ${category.title}`,
          message: undefined,
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }
    })
  }

  function createThisCategory(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    setCategory((prevState) => ({
      ...prevState,
      hackathonID: hackathonId,
    }))
    showNotification({
      id: 'category-load',
      loading: true,
      title: `Creating ${category.title}`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    addCategory(instance, category).then((response) => {
      if (JSON.stringify(response).toString().includes('error')) {
        updateNotification({
          id: 'category-load',
          color: 'red',
          title: 'Failed to create category',
          message: undefined,
          icon: <Cross2Icon />,
          autoClose: 2000,
        })
      } else {
        updateNotification({
          id: 'category-load',
          color: 'teal',
          title: `Created ${category.title}`,
          message: undefined,
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }
    })
  }

  function submitIsEnabled(): boolean {
    return !!category.title
  }

  return (
    <>
      {isLoading && (
        <div>
          <h3>Category details are loading...</h3>
        </div>
      )}
      {!isLoading && (
        <Card withBorder className={classes.card}>
          <Card.Section className={classes.borderSection}>
            <Textarea
              label='Title'
              required
              placeholder='Title'
              maxRows={1}
              autosize
              onChange={handleChange}
              name='title'
              value={category.title}
              className={classes.label}
            />
          </Card.Section>
          <Card.Section className={classes.borderSection}>
            <Textarea
              label='Description'
              required
              placeholder='Description'
              maxRows={1}
              autosize
              onChange={handleChange}
              name='description'
              value={category.description}
              className={classes.label}
            />
          </Card.Section>
          <Group position='right' mt='xl'>
            {context === 'edit' && (
              <Button
                style={{
                  backgroundColor: submitIsEnabled()
                    ? JOIN_BUTTON_COLOR
                    : dark2,
                }}
                disabled={!submitIsEnabled()}
                onClick={editThisCategory}
              >
                Edit
              </Button>
            )}
            {context === 'new' && (
              <Button
                style={{
                  backgroundColor: submitIsEnabled()
                    ? JOIN_BUTTON_COLOR
                    : dark2,
                }}
                disabled={!submitIsEnabled()}
                onClick={createThisCategory}
              >
                Create
              </Button>
            )}
          </Group>
        </Card>
      )}
    </>
  )
}
